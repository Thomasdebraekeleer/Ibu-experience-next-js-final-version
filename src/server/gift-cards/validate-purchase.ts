import type { StripeDiscountReferences } from "./stripe/discount-refs";
import type { GiftCardStripeAllowlist } from "./stripe-allowlist";

export type ParsedCheckoutLine = {
  priceId: string;
  productId: string | null;
  quantity: number;
  currency: string;
  amountSubtotalCents: number;
  amountTotalCents: number;
  amountDiscountCents: number;
  amountTaxCents: number;
  description: string | null;
};

export type PurchaseValidationInput = {
  mode: string | null;
  sessionStatus: string | null;
  currency: string | null;
  livemode: boolean;
  paymentStatus: string | null;
  buyerEmail: string | null;
  lines: ParsedCheckoutLine[];
  expectedLivemode: boolean | null;
  /** Remise totale session (total_details), si connue. */
  sessionAmountDiscountCents?: number | null;
  stripeDiscountReferences?: StripeDiscountReferences;
};

export type PurchaseValidationReason =
  | "foreign_payment"
  | "wrong_mode"
  | "wrong_environment"
  | "missing_email"
  | "missing_line_items"
  | "multiple_lines"
  | "quantity_not_one"
  | "unknown_price"
  | "mixed_offers"
  | "wrong_currency"
  | "amount_mismatch"
  | "discount_inconsistent"
  | "zero_total_without_discount"
  | "tax_not_supported"
  | "pending_commercial_validation"
  | "not_paid"
  | "session_not_complete"
  | "session_open_or_expired"
  | "payment_status_invalid";

export type PurchaseValidationSuccess = {
  ok: true;
  offerId: string;
  stripePriceId: string;
  stripeProductId: string | null;
  nominalAmountCents: number;
  /** Montant encaissé (peut être 0 pour 100 % promo). */
  paidAmountCents: number;
  discountAmountCents: number;
  quantity: number;
  stripeDiscountReferences: StripeDiscountReferences;
};

export type PurchaseValidationFailure = {
  ok: false;
  reason: PurchaseValidationReason;
  details?: Record<string, unknown>;
  needsReview?: boolean;
};

export type PurchaseValidationOutcome =
  | PurchaseValidationSuccess
  | PurchaseValidationFailure;

function emptyDiscountRefs(): StripeDiscountReferences {
  return { promotionCodeIds: [], couponIds: [] };
}

export function validatePaidGiftCardPurchase(
  input: PurchaseValidationInput,
  allowlist: GiftCardStripeAllowlist,
  options: { allowPendingCommercial: boolean }
): PurchaseValidationOutcome {
  const status = input.sessionStatus;
  if (status === "open" || status === "expired") {
    return {
      ok: false,
      reason: "session_open_or_expired",
      details: { sessionStatus: status },
    };
  }

  if (status && status !== "complete") {
    return {
      ok: false,
      reason: "session_not_complete",
      details: { sessionStatus: status },
    };
  }

  const ps = input.paymentStatus;
  if (ps === "unpaid" || !ps) {
    return { ok: false, reason: "not_paid", details: { paymentStatus: ps } };
  }

  if (ps !== "paid" && ps !== "no_payment_required") {
    return {
      ok: false,
      reason: "payment_status_invalid",
      details: { paymentStatus: ps },
    };
  }

  if (input.mode && input.mode !== "payment") {
    return { ok: false, reason: "wrong_mode", needsReview: true };
  }

  if (
    input.expectedLivemode !== null &&
    input.livemode !== input.expectedLivemode
  ) {
    return {
      ok: false,
      reason: "wrong_environment",
      needsReview: true,
      details: { livemode: input.livemode, expected: input.expectedLivemode },
    };
  }

  const email = input.buyerEmail?.trim();
  if (!email || !email.includes("@")) {
    return { ok: false, reason: "missing_email", needsReview: true };
  }

  if (input.lines.length === 0) {
    return { ok: false, reason: "missing_line_items", needsReview: true };
  }

  const giftLines = input.lines.filter((line) =>
    allowlist.allowedPriceIds.has(line.priceId)
  );

  if (giftLines.length === 0) {
    return { ok: false, reason: "foreign_payment" };
  }

  if (input.lines.length !== 1 || giftLines.length !== 1) {
    return {
      ok: false,
      reason: input.lines.length > 1 ? "multiple_lines" : "mixed_offers",
      needsReview: true,
      details: {
        lineCount: input.lines.length,
        giftLineCount: giftLines.length,
      },
    };
  }

  const line = giftLines[0]!;
  const binding = allowlist.bindingsByPriceId.get(line.priceId);
  if (!binding) {
    return { ok: false, reason: "unknown_price", needsReview: true };
  }

  if (line.quantity !== 1) {
    return {
      ok: false,
      reason: "quantity_not_one",
      needsReview: true,
      details: { quantity: line.quantity },
    };
  }

  const currency = (input.currency ?? line.currency).toLowerCase();
  if (currency !== "eur") {
    return {
      ok: false,
      reason: "wrong_currency",
      needsReview: true,
      details: { currency },
    };
  }

  if (line.amountTaxCents > 0) {
    return {
      ok: false,
      reason: "tax_not_supported",
      needsReview: true,
      details: { amountTaxCents: line.amountTaxCents },
    };
  }

  const nominal = binding.offer.nominalAmountCents;
  const subtotal = line.amountSubtotalCents;
  const discount = line.amountDiscountCents;
  const total = line.amountTotalCents;

  if (subtotal !== nominal) {
    return {
      ok: false,
      reason: "amount_mismatch",
      needsReview: true,
      details: {
        expectedNominalCents: nominal,
        amountSubtotalCents: subtotal,
      },
    };
  }

  if (total === 0 && discount === 0) {
    return {
      ok: false,
      reason: "zero_total_without_discount",
      needsReview: true,
      details: { total },
    };
  }

  if (total !== subtotal - discount) {
    return {
      ok: false,
      reason: "discount_inconsistent",
      needsReview: true,
      details: { subtotal, discount, total },
    };
  }

  if (discount > 0 && discount > subtotal) {
    return {
      ok: false,
      reason: "discount_inconsistent",
      needsReview: true,
      details: { discount, subtotal },
    };
  }

  const sessionDiscount = input.sessionAmountDiscountCents ?? discount;
  if (
    input.sessionAmountDiscountCents != null &&
    input.sessionAmountDiscountCents < discount
  ) {
    return {
      ok: false,
      reason: "discount_inconsistent",
      needsReview: true,
      details: {
        lineDiscount: discount,
        sessionDiscount: input.sessionAmountDiscountCents,
      },
    };
  }

  const refs = input.stripeDiscountReferences ?? emptyDiscountRefs();

  if (ps === "no_payment_required") {
    if (total !== 0) {
      return {
        ok: false,
        reason: "payment_status_invalid",
        needsReview: true,
        details: { paymentStatus: ps, total },
      };
    }
    if (discount <= 0 || discount !== subtotal) {
      return {
        ok: false,
        reason: "zero_total_without_discount",
        needsReview: true,
        details: {
          message: "no_payment_required requires verified 100% line discount",
          discount,
          subtotal,
        },
      };
    }
    if (sessionDiscount < discount) {
      return {
        ok: false,
        reason: "discount_inconsistent",
        needsReview: true,
        details: { sessionDiscount, lineDiscount: discount },
      };
    }
  }

  if (ps === "paid") {
    if (total === 0) {
      return {
        ok: false,
        reason: "zero_total_without_discount",
        needsReview: true,
        details: { paymentStatus: ps, total },
      };
    }
    if (discount > 0 && discount >= subtotal) {
      return {
        ok: false,
        reason: "payment_status_invalid",
        needsReview: true,
        details: {
          message: "100% discount must use no_payment_required",
          discount,
        },
      };
    }
  }

  if (
    binding.offer.commercialValidationStatus === "pending_validation" &&
    !options.allowPendingCommercial
  ) {
    return {
      ok: false,
      reason: "pending_commercial_validation",
      needsReview: true,
      details: { offerId: binding.offer.offerId },
    };
  }

  return {
    ok: true,
    offerId: binding.offer.offerId,
    stripePriceId: binding.stripePriceId,
    stripeProductId: line.productId,
    nominalAmountCents: nominal,
    paidAmountCents: total,
    discountAmountCents: discount,
    quantity: line.quantity,
    stripeDiscountReferences: refs,
  };
}
