import type Stripe from "stripe";
import { getStripeClient } from "./client";
import { paymentIntentPaidAt } from "./paid-at";
import {
  fetchCheckoutSessionLineItems,
  parseCheckoutSession,
  type ParsedGiftCheckoutSession,
} from "./parse-session";

export async function loadGiftCheckoutSessionFromStripe(
  sessionId: string,
  options?: { checkoutCompletedAt?: Date | null }
): Promise<ParsedGiftCheckoutSession> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: [
      "line_items.data.price.product",
      "payment_intent",
      "discounts.promotion_code",
      "discounts.coupon",
    ],
  });

  const lines = await fetchCheckoutSessionLineItems(
    stripe,
    session.id,
    session.line_items ?? undefined
  );

  const parsed = parseCheckoutSession(session, lines, options);

  if (!parsed.paidAt && parsed.paymentStatus === "paid") {
    if (typeof session.payment_intent === "string") {
      const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
      parsed.paidAt = paymentIntentPaidAt(pi);
    }
  }

  return parsed;
}

export type StripeSessionDiagnosis = {
  parsed: ParsedGiftCheckoutSession;
  stripeStatus: string | null;
  stripePaymentStatus: string | null;
  stripeMode: Stripe.Checkout.Session.Mode | null;
  amountTotal: number | null;
  amountSubtotal: number | null;
};

export async function diagnoseStripeGiftSession(
  sessionId: string
): Promise<StripeSessionDiagnosis> {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: [
      "line_items.data.price.product",
      "payment_intent",
      "discounts.promotion_code",
      "discounts.coupon",
    ],
  });
  const lines = await fetchCheckoutSessionLineItems(
    stripe,
    session.id,
    session.line_items ?? undefined
  );
  const parsed = parseCheckoutSession(session, lines);
  return {
    parsed,
    stripeStatus: session.status ?? null,
    stripePaymentStatus: session.payment_status ?? null,
    stripeMode: session.mode,
    amountTotal: session.amount_total,
    amountSubtotal: session.amount_subtotal,
  };
}
