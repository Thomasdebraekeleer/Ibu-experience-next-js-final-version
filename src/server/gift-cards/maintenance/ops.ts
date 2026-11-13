import { and, desc, eq, inArray, or } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import {
  emailOperations,
  giftCards,
  maintenanceAuditLog,
  stripePurchases,
  stripeWebhookEvents,
} from "@/server/db/schema";
import {
  diagnoseStripeGiftSession,
  loadGiftCheckoutSessionFromStripe,
} from "../stripe/load-checkout-session";
import { buildGiftCardEmail } from "../email/templates";
import {
  getFromAddress,
  getReplyToAddress,
  sendGiftCardEmail,
} from "../email/transport";
import { checkGiftCardUsability } from "../validity";
import { processPaidCheckoutSession } from "../fulfillment/process-session";
import type { ParsedGiftCheckoutSession } from "../stripe/parse-session";

async function audit(
  action: string,
  targetType: string,
  targetId: string,
  metadata?: Record<string, unknown>
) {
  const db = getDb();
  await db.insert(maintenanceAuditLog).values({
    action,
    actor: "cli",
    targetType,
    targetId,
    metadata,
  });
}

export async function lookupGiftCardByCode(code: string) {
  const db = getDb();
  const rows = await db
    .select({
      card: giftCards,
      purchase: stripePurchases,
    })
    .from(giftCards)
    .innerJoin(stripePurchases, eq(giftCards.purchaseId, stripePurchases.id))
    .where(eq(giftCards.code, code))
    .limit(1);
  return rows[0] ?? null;
}

export async function lookupGiftCardBySessionId(sessionId: string) {
  const db = getDb();
  const rows = await db
    .select({
      card: giftCards,
      purchase: stripePurchases,
    })
    .from(giftCards)
    .innerJoin(stripePurchases, eq(giftCards.purchaseId, stripePurchases.id))
    .where(eq(stripePurchases.stripeCheckoutSessionId, sessionId))
    .limit(1);
  return rows[0] ?? null;
}

export async function listNeedsReview(limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(stripePurchases)
    .where(eq(stripePurchases.purchaseStatus, "needs_review"))
    .orderBy(desc(stripePurchases.createdAt))
    .limit(limit);
}

export async function markGiftCardRedeemed(code: string, note?: string) {
  const db = getDb();
  const existing = await db
    .select()
    .from(giftCards)
    .where(eq(giftCards.code, code))
    .limit(1);
  const card = existing[0];
  if (!card) {
    throw new Error("Card not found");
  }
  const usability = checkGiftCardUsability({
    cardStatus: card.cardStatus,
    expiresAt: card.expiresAt,
  });
  if (!usability.ok) {
    throw new Error(
      usability.reason === "expired"
        ? "Card expired — redemption blocked"
        : "Card not active"
    );
  }

  const result = await db
    .update(giftCards)
    .set({ cardStatus: "redeemed" })
    .where(
      and(eq(giftCards.code, code), eq(giftCards.cardStatus, "active"))
    )
    .returning();

  if (result.length === 0) {
    throw new Error("Card not found or not active");
  }

  await audit("redeem", "gift_card", code, { note });
  return result[0]!;
}

export async function suspendGiftCard(code: string, reason: string) {
  const db = getDb();
  const result = await db
    .update(giftCards)
    .set({ cardStatus: "suspended" })
    .where(eq(giftCards.code, code))
    .returning();
  if (!result[0]) throw new Error("Card not found");
  await audit("suspend", "gift_card", code, { reason });
  return result[0];
}

export async function resendGiftCardEmail(sessionId: string, operationSuffix: string) {
  const db = getDb();
  const lookup = await lookupGiftCardBySessionId(sessionId);
  if (!lookup) throw new Error("No gift card for session");

  const { card, purchase } = lookup;
  if (!purchase.buyerEmail.includes("@")) {
    throw new Error("Invalid buyer email on purchase");
  }

  const idempotencyKey = `gift-card-email/${sessionId}/manual/${operationSuffix}`;
  if (!purchase.paidAt || !purchase.expiresAt) {
    throw new Error("Purchase missing paidAt/expiresAt — cannot rebuild email");
  }

  const emailContent = buildGiftCardEmail({
    siteLocale: card.locale as "fr" | "nl-BE",
    buyerFullName: purchase.buyerFullName,
    buyerFirstName: purchase.buyerFirstName,
    code: card.code,
    nominalAmountCents: card.nominalAmountCents,
    currency: card.currency,
    pdfFilename: card.pdfFilename,
    paidAt: purchase.paidAt,
    expiresAt: purchase.expiresAt,
  });

  const inserted = await db
    .insert(emailOperations)
    .values({
      purchaseId: purchase.id,
      giftCardId: card.id,
      operationKind: "manual_resend",
      idempotencyKey,
      recipientEmail: purchase.buyerEmail,
      sendStatus: "pending",
      emailSubject: emailContent.subject,
      emailHtml: emailContent.html,
      emailText: emailContent.text,
      fromEmail: getFromAddress(),
      replyToEmail: getReplyToAddress(),
      contentFrozenAt: new Date(),
    })
    .returning();

  const sendResult = await sendGiftCardEmail({
    to: purchase.buyerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text,
    pdfFilename: card.pdfFilename,
    pdfBytes: Buffer.from(card.pdfBytes),
    idempotencyKey,
    replyTo: getReplyToAddress(),
  });

  const operationId = inserted[0]!.id;

  if (!sendResult.ok) {
    await db
      .update(emailOperations)
      .set({
        sendStatus: sendResult.transient ? "unknown" : "failed",
        lastError: sendResult.message,
        attemptCount: 1,
        lastAttemptAt: new Date(),
      })
      .where(eq(emailOperations.id, operationId));
    throw new Error(sendResult.message);
  }

  const finalStatus = sendResult.simulated ? "mock_simulated" : "accepted";

  await db
    .update(emailOperations)
    .set({
      sendStatus: finalStatus,
      resendEmailId:
        sendResult.ok && !sendResult.simulated
          ? sendResult.providerMessageId ?? null
          : null,
      acceptedAt:
        sendResult.ok && !sendResult.simulated ? new Date() : null,
      attemptCount: 1,
      lastAttemptAt: new Date(),
    })
    .where(eq(emailOperations.id, operationId));

  await audit("manual_resend", "stripe_checkout_session", sessionId, {
    operationId,
    idempotencyKey,
  });

  return sendResult;
}

export async function retryFulfillmentFromFixture(
  parsed: ParsedGiftCheckoutSession,
  stripeEventId: string
) {
  return processPaidCheckoutSession(parsed, stripeEventId);
}

export async function listEmailProblems() {
  const db = getDb();
  return db
    .select()
    .from(emailOperations)
    .where(inArray(emailOperations.sendStatus, ["failed", "unknown", "pending"]))
    .orderBy(desc(emailOperations.updatedAt))
    .limit(100);
}

export async function diagnoseFulfillmentSession(sessionId: string) {
  const db = getDb();
  const stripeDiag = await diagnoseStripeGiftSession(sessionId);
  const dbLookup = await lookupGiftCardBySessionId(sessionId);
  const events = await db
    .select()
    .from(stripeWebhookEvents)
    .where(eq(stripeWebhookEvents.checkoutSessionId, sessionId))
    .orderBy(desc(stripeWebhookEvents.createdAt))
    .limit(20);

  const emailOps = dbLookup
    ? await db
        .select()
        .from(emailOperations)
        .where(eq(emailOperations.purchaseId, dbLookup.purchase.id))
        .orderBy(desc(emailOperations.createdAt))
    : [];

  return {
    stripe: {
      status: stripeDiag.stripeStatus,
      paymentStatus: stripeDiag.stripePaymentStatus,
      mode: stripeDiag.stripeMode,
      amountTotal: stripeDiag.amountTotal,
      amountSubtotal: stripeDiag.amountSubtotal,
      line: stripeDiag.parsed.lines[0] ?? null,
      sessionAmountDiscountCents: stripeDiag.parsed.sessionAmountDiscountCents,
      discountRefs: stripeDiag.parsed.stripeDiscountReferences,
      buyerEmail: stripeDiag.parsed.buyerEmail,
    },
    database: {
      purchase: dbLookup?.purchase ?? null,
      giftCard: dbLookup
        ? {
            id: dbLookup.card.id,
            code: dbLookup.card.code,
            cardStatus: dbLookup.card.cardStatus,
          }
        : null,
      emailOperations: emailOps.map((op) => ({
        id: op.id,
        sendStatus: op.sendStatus,
        recipientEmail: op.recipientEmail,
        attemptCount: op.attemptCount,
      })),
    },
    webhookEvents: events.map((e) => ({
      stripeEventId: e.stripeEventId,
      eventType: e.eventType,
      processingStatus: e.processingStatus,
      handlerHttpStatus: e.handlerHttpStatus,
      errorMessage: e.errorMessage,
      processedAt: e.processedAt,
    })),
  };
}

async function webhookCompletedAtForSession(
  sessionId: string
): Promise<Date | null> {
  const db = getDb();
  const row = await db
    .select()
    .from(stripeWebhookEvents)
    .where(
      and(
        eq(stripeWebhookEvents.checkoutSessionId, sessionId),
        inArray(stripeWebhookEvents.eventType, [
          "checkout.session.completed",
          "checkout.session.async_payment_succeeded",
        ])
      )
    )
    .orderBy(stripeWebhookEvents.createdAt)
    .limit(1);
  return row[0]?.createdAt ?? null;
}

export async function reprocessFulfillmentSession(
  sessionId: string,
  options: { confirm?: boolean } = {}
) {
  const diag = await diagnoseFulfillmentSession(sessionId);
  const existingCard = await lookupGiftCardBySessionId(sessionId);

  if (existingCard?.purchase.purchaseStatus === "fulfilled") {
    return {
      action: "skip",
      reason: "already_fulfilled",
      code: existingCard.card.code,
    };
  }

  if (existingCard?.card) {
    return {
      action: "skip",
      reason: "gift_card_already_exists",
      code: existingCard.card.code,
      message: "Un bon existe déjà — utiliser resend si besoin d’e-mail",
    };
  }

  if (!options.confirm) {
    return {
      action: "dry_run",
      diagnosis: diag,
      hint: "Relancer avec --confirm pour exécuter le traitement",
    };
  }

  const completedAt = (await webhookCompletedAtForSession(sessionId)) ?? new Date();
  const parsed = await loadGiftCheckoutSessionFromStripe(sessionId, {
    checkoutCompletedAt: completedAt,
  });

  const recipient = parsed.buyerEmail?.trim();
  if (!recipient) {
    throw new Error("Session without buyer email");
  }

  const result = await processPaidCheckoutSession(
    parsed,
    `reprocess-${sessionId}`
  );

  await audit("reprocess_fulfillment", "stripe_checkout_session", sessionId, {
    outcome: result.outcome,
    httpStatus: result.httpStatus,
  });

  return { action: "processed", result, recipientEmail: recipient };
}

export async function reopenWebhookEventsForSession(sessionId: string) {
  const existingCard = await lookupGiftCardBySessionId(sessionId);
  if (existingCard?.card) {
    throw new Error("Gift card already exists — reopen webhook refused");
  }

  const db = getDb();
  const rows = await db
    .update(stripeWebhookEvents)
    .set({
      processingStatus: "failed",
      errorMessage: "reopened_for_replay",
      processedAt: null,
      processingLeaseOwner: null,
      processingLeaseExpiresAt: null,
    })
    .where(
      and(
        eq(stripeWebhookEvents.checkoutSessionId, sessionId),
        or(
          eq(stripeWebhookEvents.processingStatus, "processed"),
          eq(stripeWebhookEvents.processingStatus, "ignored")
        )
      )
    )
    .returning({ stripeEventId: stripeWebhookEvents.stripeEventId });

  await audit("reopen_webhook", "stripe_checkout_session", sessionId, {
    count: rows.length,
    eventIds: rows.map((r) => r.stripeEventId),
  });

  return rows;
}
