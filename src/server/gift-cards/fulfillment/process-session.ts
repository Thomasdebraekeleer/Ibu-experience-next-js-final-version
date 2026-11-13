import { and, eq } from "drizzle-orm";
import {
  GIFT_CARD_CONDITIONS_VERSION,
  GIFT_CARD_DOCUMENT_TEMPLATE_VERSION,
} from "@/config/gift-cards/types";
import { getDb } from "@/server/db/app-db";
import {
  emailOperations,
  giftCards,
  stripePurchases,
} from "@/server/db/schema";
import { generateGiftCardCode } from "../code";
import { buildGiftCardEmail } from "../email/templates";
import { isAutomaticRetryAllowed } from "../email/idempotency";
import {
  getFromAddress,
  getReplyToAddress,
  sendGiftCardEmail,
} from "../email/transport";
import { giftCardDocumentLocale } from "../document-locale";
import { generateGiftCardPdf } from "../pdf/generate";
import {
  GIFT_CARD_VALIDITY_RULE_VERSION,
  computeGiftCardExpiresAt,
} from "../validity";
import { fulfillmentWorkerId } from "./worker-id";
import type { ParsedGiftCheckoutSession } from "../stripe/parse-session";
import {
  loadGiftCardStripeAllowlistFromEnv,
  buildTestFixtureAllowlist,
} from "../stripe-allowlist";
import { getExpectedStripeLivemode } from "../stripe/client";
import { validatePaidGiftCardPurchase } from "../validate-purchase";
import {
  releaseEmailOperationLease,
  releasePurchaseLease,
  tryAcquireEmailOperationLease,
  tryAcquirePurchaseLease,
} from "./lease";

export type FulfillmentResult =
  | { outcome: "ignored_foreign"; httpStatus: 200 }
  | { outcome: "needs_review"; httpStatus: 200; purchaseId: string }
  | { outcome: "already_fulfilled"; httpStatus: 200; purchaseId: string }
  | { outcome: "fulfilled"; httpStatus: 200; purchaseId: string }
  | { outcome: "email_simulated"; httpStatus: 200; purchaseId: string }
  | { outcome: "transient_error"; httpStatus: 500; message: string }
  | { outcome: "misconfigured"; httpStatus: 503; message: string };

function leaseOwner(): string {
  return fulfillmentWorkerId("fulfill");
}

function resolveStripeAllowlist() {
  if (process.env.GIFT_CARD_USE_FIXTURE_ALLOWLIST === "true") {
    return buildTestFixtureAllowlist();
  }
  return loadGiftCardStripeAllowlistFromEnv();
}

async function createGiftCardWithPdf(
  db: ReturnType<typeof getDb>,
  pdfInput: Parameters<typeof generateGiftCardPdf>[0],
  rowBase: Omit<typeof giftCards.$inferInsert, "code" | "pdfBytes" | "pdfSha256" | "pdfFilename">
): Promise<typeof giftCards.$inferSelect> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateGiftCardCode();
    const finalPdf = await generateGiftCardPdf({ ...pdfInput, code });
    try {
      const inserted = await db
        .insert(giftCards)
        .values({
          ...rowBase,
          code,
          pdfBytes: finalPdf.bytes,
          pdfSha256: finalPdf.sha256,
          pdfFilename: finalPdf.filename,
        })
        .returning();
      if (inserted[0]) return inserted[0];
    } catch (err) {
      const message =
        err instanceof Error ? err.message.toLowerCase() : String(err);
      if (message.includes("gift_cards_code_uidx") || message.includes("unique")) {
        continue;
      }
      throw err;
    }
  }
  throw new Error("Unable to allocate unique gift card code");
}

export async function processPaidCheckoutSession(
  parsed: ParsedGiftCheckoutSession,
  stripeEventId: string
): Promise<FulfillmentResult> {
  if (!process.env.DATABASE_URL?.trim()) {
    return { outcome: "misconfigured", httpStatus: 503, message: "DATABASE_URL missing" };
  }

  const db = getDb();
  const owner = leaseOwner();

  const allowlist = resolveStripeAllowlist();
    const allowPending =
      process.env.GIFT_CARD_ALLOW_PENDING_COMMERCIAL === "true";

    const validation = validatePaidGiftCardPurchase(
      {
        mode: parsed.mode,
        sessionStatus: parsed.sessionStatus,
        currency: parsed.currency,
        livemode: parsed.livemode,
        paymentStatus: parsed.paymentStatus,
        buyerEmail: parsed.buyerEmail,
        lines: parsed.lines,
        expectedLivemode: getExpectedStripeLivemode(),
        sessionAmountDiscountCents: parsed.sessionAmountDiscountCents,
        stripeDiscountReferences: parsed.stripeDiscountReferences,
      },
      allowlist,
      { allowPendingCommercial: allowPending }
    );

    const locale = parsed.locale;
    const documentLocale = giftCardDocumentLocale(locale);
    const stripeEnv = parsed.livemode ? "live" : "test";
    const paidCents =
      parsed.lines.reduce((sum, l) => sum + l.amountTotalCents, 0) || 0;

    const existing = await db
      .select()
      .from(stripePurchases)
      .where(eq(stripePurchases.stripeCheckoutSessionId, parsed.sessionId))
      .limit(1);

    let purchaseId: string;
    let paidAt = existing[0]?.paidAt ?? parsed.paidAt ?? null;

    const eligiblePayment =
      parsed.paymentStatus === "paid" ||
      parsed.paymentStatus === "no_payment_required";
    if (!paidAt && eligiblePayment) {
      return {
        outcome: "transient_error",
        httpStatus: 500,
        message:
          "Paid/finalized timestamp unavailable — retry after session expansion",
      };
    }

    const expiresAt =
      existing[0]?.expiresAt ??
      (paidAt ? computeGiftCardExpiresAt(paidAt) : null);

    if (existing[0]) {
      purchaseId = existing[0].id;
      if (existing[0].purchaseStatus === "fulfilled") {
        return { outcome: "already_fulfilled", httpStatus: 200, purchaseId };
      }
      if (
        parsed.paymentStatus &&
        existing[0].paymentStatus !== parsed.paymentStatus
      ) {
        await db
          .update(stripePurchases)
          .set({
            paymentStatus: parsed.paymentStatus,
            paidAt: paidAt ?? undefined,
            expiresAt: expiresAt ?? undefined,
            validityRuleVersion: GIFT_CARD_VALIDITY_RULE_VERSION,
            buyerFullName: parsed.buyerFullName,
            buyerFirstName: parsed.buyerFirstName,
            updatedAt: new Date(),
          })
          .where(eq(stripePurchases.id, purchaseId));
      }
    } else {
      const inserted = await db
        .insert(stripePurchases)
        .values({
          stripeCheckoutSessionId: parsed.sessionId,
          stripePaymentIntentId: parsed.paymentIntentId,
          stripeCustomerId: parsed.customerId,
          buyerEmail: parsed.buyerEmail ?? "unknown@invalid.local",
          currency: (parsed.currency ?? "eur").toLowerCase(),
          nominalAmountCents: validation.ok
            ? validation.nominalAmountCents
            : null,
          paidAmountCents: validation.ok
            ? validation.paidAmountCents
            : paidCents,
          discountAmountCents: validation.ok
            ? validation.discountAmountCents
            : null,
          stripePromotionCodeIds: validation.ok
            ? validation.stripeDiscountReferences.promotionCodeIds
            : null,
          stripeCouponIds: validation.ok
            ? validation.stripeDiscountReferences.couponIds
            : null,
          offerId: validation.ok ? validation.offerId : null,
          stripePriceId: validation.ok ? validation.stripePriceId : null,
          stripeProductId: validation.ok ? validation.stripeProductId : null,
          stripePaymentLinkId: parsed.paymentLinkId,
          quantity: validation.ok ? validation.quantity : 1,
          locale,
          livemode: parsed.livemode,
          paymentStatus: parsed.paymentStatus ?? "unknown",
          purchaseStatus: "open",
          stripeEnvironment: stripeEnv,
          documentTemplateVersion: GIFT_CARD_DOCUMENT_TEMPLATE_VERSION,
          conditionsVersion: GIFT_CARD_CONDITIONS_VERSION,
          buyerFullName: parsed.buyerFullName,
          buyerFirstName: parsed.buyerFirstName,
          paidAt: paidAt ?? undefined,
          expiresAt: expiresAt ?? undefined,
          validityRuleVersion: paidAt ? GIFT_CARD_VALIDITY_RULE_VERSION : null,
        })
        .returning({ id: stripePurchases.id });
      purchaseId = inserted[0]!.id;
    }

    if (!validation.ok) {
      if (validation.reason === "foreign_payment") {
        await db
          .update(stripePurchases)
          .set({
            purchaseStatus: "ignored_foreign",
            reviewReason: validation.reason,
            reviewDetails: validation.details ?? null,
            updatedAt: new Date(),
          })
          .where(eq(stripePurchases.id, purchaseId));
        return { outcome: "ignored_foreign", httpStatus: 200 };
      }

      await db
        .update(stripePurchases)
        .set({
          purchaseStatus: "needs_review",
          reviewReason: validation.reason,
          reviewDetails: {
            ...(validation.details ?? {}),
            stripeEventId,
          },
          paidAmountCents: paidCents,
          buyerEmail: parsed.buyerEmail ?? "unknown@invalid.local",
          paymentStatus: parsed.paymentStatus ?? "unknown",
          updatedAt: new Date(),
        })
        .where(eq(stripePurchases.id, purchaseId));

      return { outcome: "needs_review", httpStatus: 200, purchaseId };
    }

    const acquired = await tryAcquirePurchaseLease(db, purchaseId, owner);
    if (!acquired) {
      return { outcome: "transient_error", httpStatus: 500, message: "Purchase lease busy" };
    }

    try {
      const cardExists = await db
        .select()
        .from(giftCards)
        .where(eq(giftCards.purchaseId, purchaseId))
        .limit(1);

      let giftCardId: string;
      let code: string;
      let pdfFilename: string;
      let pdfBytes: Buffer;

      if (cardExists[0]) {
        giftCardId = cardExists[0].id;
        code = cardExists[0].code;
        pdfFilename = cardExists[0].pdfFilename;
        pdfBytes = Buffer.from(cardExists[0].pdfBytes);
      } else {
        if (!paidAt || !expiresAt) {
          return {
            outcome: "transient_error",
            httpStatus: 500,
            message: "Missing paidAt for new gift card",
          };
        }

        const row = await createGiftCardWithPdf(
          db,
          {
            code: "TEMP",
            offerId: validation.offerId,
            nominalAmountCents: validation.nominalAmountCents,
            currency: (parsed.currency ?? "eur").toLowerCase(),
            documentLocale,
            paidAt,
            expiresAt,
          },
          {
            purchaseId,
            offerId: validation.offerId,
            nominalAmountCents: validation.nominalAmountCents,
            paidAmountCents: validation.paidAmountCents,
            currency: (parsed.currency ?? "eur").toLowerCase(),
            locale,
            documentLocale,
            paidAt,
            expiresAt,
            validityRuleVersion: GIFT_CARD_VALIDITY_RULE_VERSION,
            cardStatus: "active",
          }
        );

        giftCardId = row.id;
        code = row.code;
        pdfFilename = row.pdfFilename;
        pdfBytes = Buffer.from(row.pdfBytes);
      }

      await db
        .update(stripePurchases)
        .set({
          purchaseStatus: "issued",
          paymentStatus: parsed.paymentStatus ?? "paid",
          nominalAmountCents: validation.nominalAmountCents,
          paidAmountCents: validation.paidAmountCents,
          discountAmountCents: validation.discountAmountCents,
          stripePromotionCodeIds:
            validation.stripeDiscountReferences.promotionCodeIds,
          stripeCouponIds: validation.stripeDiscountReferences.couponIds,
          offerId: validation.offerId,
          stripePriceId: validation.stripePriceId,
          stripeProductId: validation.stripeProductId,
          buyerEmail: parsed.buyerEmail!,
          buyerFullName: parsed.buyerFullName,
          buyerFirstName: parsed.buyerFirstName,
          paidAt,
          expiresAt,
          validityRuleVersion: GIFT_CARD_VALIDITY_RULE_VERSION,
          locale,
          updatedAt: new Date(),
        })
        .where(eq(stripePurchases.id, purchaseId));

      const idempotencyKey = `gift-card-email/${parsed.sessionId}/initial`;
      const existingOp = await db
        .select()
        .from(emailOperations)
        .where(eq(emailOperations.idempotencyKey, idempotencyKey))
        .limit(1);

      let operationId: string;
      if (existingOp[0]?.sendStatus === "accepted") {
        await db
          .update(stripePurchases)
          .set({ purchaseStatus: "fulfilled", updatedAt: new Date() })
          .where(eq(stripePurchases.id, purchaseId));
        return { outcome: "already_fulfilled", httpStatus: 200, purchaseId };
      }

      if (
        existingOp[0] &&
        !isAutomaticRetryAllowed({
          sendStatus: existingOp[0].sendStatus,
          createdAt: existingOp[0].createdAt,
        }) &&
        ["unknown", "failed", "pending", "sending"].includes(existingOp[0].sendStatus)
      ) {
        await db
          .update(emailOperations)
          .set({ sendStatus: "idempotency_expired", updatedAt: new Date() })
          .where(eq(emailOperations.id, existingOp[0].id));

        return {
          outcome: "transient_error",
          httpStatus: 500,
          message: "Email operation older than Resend idempotency window — manual reconciliation required",
        };
      }

      if (existingOp[0]) {
        operationId = existingOp[0].id;
      } else {
        const insertedOp = await db
          .insert(emailOperations)
          .values({
            purchaseId,
            giftCardId,
            operationKind: "initial",
            idempotencyKey,
            recipientEmail: parsed.buyerEmail!,
            sendStatus: "pending",
          })
          .returning({ id: emailOperations.id });
        operationId = insertedOp[0]!.id;
      }

      const emailLease = await tryAcquireEmailOperationLease(
        db,
        operationId,
        owner
      );
      if (!emailLease) {
        return { outcome: "transient_error", httpStatus: 500, message: "Email lease busy" };
      }

      try {
        const opRow = await db
          .select()
          .from(emailOperations)
          .where(eq(emailOperations.id, operationId))
          .limit(1);

        const currentOp = opRow[0]!;
        const attemptBase = currentOp.attemptCount ?? 0;

        let subject = currentOp.emailSubject ?? "";
        let html = currentOp.emailHtml ?? "";
        let text = currentOp.emailText ?? "";

        if (!subject || !html || !text) {
          const purchaseDates = await db
            .select({
              paidAt: stripePurchases.paidAt,
              expiresAt: stripePurchases.expiresAt,
              buyerFullName: stripePurchases.buyerFullName,
              buyerFirstName: stripePurchases.buyerFirstName,
            })
            .from(stripePurchases)
            .where(eq(stripePurchases.id, purchaseId))
            .limit(1);

          const paidForEmail = purchaseDates[0]?.paidAt ?? paidAt;
          const expiresForEmail = purchaseDates[0]?.expiresAt ?? expiresAt;
          if (!paidForEmail || !expiresForEmail) {
            return {
              outcome: "transient_error",
              httpStatus: 500,
              message: "Missing validity dates for email",
            };
          }

          const emailContent = buildGiftCardEmail({
            siteLocale: locale,
            buyerFullName:
              purchaseDates[0]?.buyerFullName ?? parsed.buyerFullName,
            buyerFirstName:
              purchaseDates[0]?.buyerFirstName ?? parsed.buyerFirstName,
            code,
            nominalAmountCents: validation.nominalAmountCents,
            currency: (parsed.currency ?? "eur").toLowerCase(),
            pdfFilename,
            paidAt: paidForEmail,
            expiresAt: expiresForEmail,
          });
          subject = emailContent.subject;
          html = emailContent.html;
          text = emailContent.text;

          await db
            .update(emailOperations)
            .set({
              emailSubject: subject,
              emailHtml: html,
              emailText: text,
              fromEmail: getFromAddress(),
              replyToEmail: getReplyToAddress(),
              contentFrozenAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(emailOperations.id, operationId));
        }

        await db
          .update(emailOperations)
          .set({
            sendStatus: "sending",
            attemptCount: attemptBase + 1,
            lastAttemptAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(emailOperations.id, operationId));

        const sendResult = await sendGiftCardEmail({
          to: parsed.buyerEmail!,
          subject,
          html,
          text,
          pdfFilename,
          pdfBytes,
          idempotencyKey,
          replyTo: getReplyToAddress(),
        });

        if (!sendResult.ok) {
          const status = sendResult.blockedRecipient
            ? "blocked_recipient"
            : sendResult.transient
              ? "unknown"
              : "failed";
          await db
            .update(emailOperations)
            .set({
              sendStatus: status,
              lastError: sendResult.message,
              lastAttemptAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(emailOperations.id, operationId));

          await db
            .update(stripePurchases)
            .set({
              purchaseStatus: "fulfillment_failed",
              updatedAt: new Date(),
            })
            .where(eq(stripePurchases.id, purchaseId));

          if (sendResult.transient) {
            return {
              outcome: "transient_error",
              httpStatus: 500,
              message: sendResult.message,
            };
          }

          return {
            outcome: "needs_review",
            httpStatus: 200,
            purchaseId,
          };
        }

        if (sendResult.simulated) {
          await db
            .update(emailOperations)
            .set({
              sendStatus: "mock_simulated",
              lastAttemptAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(emailOperations.id, operationId));

          await db
            .update(stripePurchases)
            .set({
              purchaseStatus: "email_simulated",
              updatedAt: new Date(),
            })
            .where(eq(stripePurchases.id, purchaseId));

          return { outcome: "email_simulated", httpStatus: 200, purchaseId };
        }

        await db
          .update(emailOperations)
          .set({
            sendStatus: "accepted",
            resendEmailId: sendResult.providerMessageId ?? null,
            acceptedAt: new Date(),
            lastAttemptAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(emailOperations.id, operationId));

        await db
          .update(stripePurchases)
          .set({ purchaseStatus: "fulfilled", updatedAt: new Date() })
          .where(eq(stripePurchases.id, purchaseId));

        return { outcome: "fulfilled", httpStatus: 200, purchaseId };
      } finally {
        await releaseEmailOperationLease(db, operationId, owner);
      }
    } finally {
      await releasePurchaseLease(db, purchaseId, owner);
    }
}
