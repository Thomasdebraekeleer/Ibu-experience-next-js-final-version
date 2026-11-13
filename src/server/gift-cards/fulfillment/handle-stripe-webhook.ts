import type Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { stripeWebhookEvents } from "@/server/db/schema";
import { getStripeClient } from "../stripe/client";
import {
  fetchCheckoutSessionLineItems,
  parseCheckoutSession,
} from "../stripe/parse-session";
import { paymentIntentPaidAt } from "../stripe/paid-at";
import {
  isCheckoutPaymentStatusEligible,
  isCheckoutSessionStatusEligible,
  shouldDeferFulfillmentForPaymentStatus,
} from "../session-eligibility";
import { markCheckoutSessionPaymentFailed } from "./payment-failed";
import { processPaidCheckoutSession } from "./process-session";
import { fulfillmentWorkerId } from "./worker-id";
import {
  claimStripeWebhookEvent,
  releaseStripeWebhookEventLease,
} from "./webhook-event-lease";

const FULFILLMENT_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

export type StripeWebhookHandlerResult = {
  httpStatus: number;
  body: { received: boolean; message?: string };
};

export async function ensureStripeWebhookEventRow(
  event: Stripe.Event
): Promise<void> {
  const db = getDb();
  const sessionId =
    event.type.startsWith("checkout.session.") &&
    event.data.object &&
    typeof event.data.object === "object" &&
    "id" in event.data.object
      ? String((event.data.object as Stripe.Checkout.Session).id)
      : null;

  try {
    await db.insert(stripeWebhookEvents).values({
      stripeEventId: event.id,
      eventType: event.type,
      checkoutSessionId: sessionId,
      processingStatus: "received",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message.toLowerCase() : "";
    if (!message.includes("stripe_webhook_events_event_uidx") && !message.includes("unique")) {
      throw err;
    }
  }
}

export async function finalizeStripeWebhookEvent(
  eventId: string,
  owner: string,
  httpStatus: number,
  status: "processed" | "ignored" | "failed",
  errorMessage?: string
): Promise<boolean> {
  const db = getDb();
  const rows = await db
    .update(stripeWebhookEvents)
    .set({
      processingStatus: status,
      handlerHttpStatus: httpStatus,
      errorMessage: errorMessage ?? null,
      processedAt: new Date(),
      processingLeaseOwner: null,
      processingLeaseExpiresAt: null,
    })
    .where(
      and(
        eq(stripeWebhookEvents.stripeEventId, eventId),
        eq(stripeWebhookEvents.processingLeaseOwner, owner)
      )
    )
    .returning({ id: stripeWebhookEvents.id });
  return rows.length > 0;
}

function webhookOwner(): string {
  return fulfillmentWorkerId("wh");
}

export async function handleStripeGiftCardWebhookEvent(
  event: Stripe.Event,
  processingOwner = webhookOwner()
): Promise<StripeWebhookHandlerResult> {
  await ensureStripeWebhookEventRow(event);

  const db = getDb();
  const claim = await claimStripeWebhookEvent(db, event.id, processingOwner);

  if (claim.kind === "skip_done") {
    return { httpStatus: 200, body: { received: true, message: "already_done" } };
  }

  if (claim.kind === "busy") {
    return {
      httpStatus: 503,
      body: {
        received: false,
        message: "another_worker_processing",
      },
    };
  }

  try {
    if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await markCheckoutSessionPaymentFailed(session.id);
      const finalized = await finalizeStripeWebhookEvent(
        event.id,
        processingOwner,
        200,
        "processed"
      );
      if (!finalized) {
        return {
          httpStatus: 503,
          body: { received: false, message: "lease_lost_before_finalize" },
        };
      }
      return { httpStatus: 200, body: { received: true } };
    }

    if (!FULFILLMENT_EVENTS.has(event.type)) {
      const finalized = await finalizeStripeWebhookEvent(
        event.id,
        processingOwner,
        200,
        "ignored"
      );
      if (!finalized) {
        return {
          httpStatus: 503,
          body: { received: false, message: "lease_lost_before_finalize" },
        };
      }
      return { httpStatus: 200, body: { received: true } };
    }

    const sessionPayload = event.data.object as Stripe.Checkout.Session;

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionPayload.id, {
      expand: [
        "line_items.data.price.product",
        "payment_intent",
        "discounts.promotion_code",
        "discounts.coupon",
      ],
    });

    if (!isCheckoutSessionStatusEligible(session.status)) {
      const finalized = await finalizeStripeWebhookEvent(
        event.id,
        processingOwner,
        200,
        "ignored",
        `session_status_${session.status ?? "unknown"}`
      );
      if (!finalized) {
        return {
          httpStatus: 503,
          body: { received: false, message: "lease_lost_before_finalize" },
        };
      }
      return {
        httpStatus: 200,
        body: { received: true, message: "session_not_complete" },
      };
    }

    if (shouldDeferFulfillmentForPaymentStatus(session.payment_status)) {
      const finalized = await finalizeStripeWebhookEvent(
        event.id,
        processingOwner,
        200,
        "ignored",
        "payment_unpaid_deferred"
      );
      if (!finalized) {
        return {
          httpStatus: 503,
          body: { received: false, message: "lease_lost_before_finalize" },
        };
      }
      return { httpStatus: 200, body: { received: true, message: "deferred_unpaid" } };
    }

    if (!isCheckoutPaymentStatusEligible(session.payment_status)) {
      const finalized = await finalizeStripeWebhookEvent(
        event.id,
        processingOwner,
        200,
        "ignored",
        `payment_status_${session.payment_status ?? "unknown"}`
      );
      if (!finalized) {
        return {
          httpStatus: 503,
          body: { received: false, message: "lease_lost_before_finalize" },
        };
      }
      return { httpStatus: 200, body: { received: true, message: "not_eligible" } };
    }

    let paidAtCandidate = parseCheckoutSession(session, [], {
      checkoutCompletedAt: new Date(event.created * 1000),
    }).paidAt;
    if (!paidAtCandidate && typeof session.payment_intent === "string") {
      const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
      paidAtCandidate = paymentIntentPaidAt(pi);
    }

    const lines = await fetchCheckoutSessionLineItems(
      stripe,
      session.id,
      session.line_items ?? undefined
    );
    const parsed = parseCheckoutSession(session, lines, {
      checkoutCompletedAt: new Date(event.created * 1000),
    });
    if (!parsed.paidAt && paidAtCandidate) {
      parsed.paidAt = paidAtCandidate;
    }
    if (
      !parsed.paidAt &&
      session.status === "complete" &&
      (session.amount_total ?? 0) === 0
    ) {
      parsed.paidAt = new Date(event.created * 1000);
    }

    const result = await processPaidCheckoutSession(parsed, event.id);

    const finalized = await finalizeStripeWebhookEvent(
      event.id,
      processingOwner,
      result.httpStatus,
      result.httpStatus >= 500 ? "failed" : "processed",
      "message" in result ? result.message : undefined
    );

    if (!finalized && result.httpStatus < 500) {
      return {
        httpStatus: 503,
        body: { received: false, message: "lease_lost_before_finalize" },
      };
    }

    return {
      httpStatus: result.httpStatus,
      body: {
        received: result.httpStatus < 500,
        message: "message" in result ? result.message : result.outcome,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    await finalizeStripeWebhookEvent(event.id, processingOwner, 500, "failed", message);
    throw err;
  } finally {
    await releaseStripeWebhookEventLease(db, event.id, processingOwner);
  }
}
