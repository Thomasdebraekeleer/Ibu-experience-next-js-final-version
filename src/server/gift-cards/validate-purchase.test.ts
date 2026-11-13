import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildTestFixtureAllowlist } from "./stripe-allowlist";
import type { ParsedCheckoutLine } from "./validate-purchase";
import { validatePaidGiftCardPurchase } from "./validate-purchase";

const allowlist = buildTestFixtureAllowlist();

function lineForOffer(
  offerId: string,
  overrides?: Partial<ParsedCheckoutLine>
): ParsedCheckoutLine {
  const priceId = `price_test_fixture_${offerId}`;
  const binding = allowlist.bindingsByPriceId.get(priceId)!;
  return {
    priceId,
    productId: "prod_test",
    quantity: 1,
    currency: "eur",
    amountSubtotalCents: binding.offer.nominalAmountCents,
    amountTotalCents: binding.offer.nominalAmountCents,
    amountDiscountCents: 0,
    amountTaxCents: 0,
    description: null,
    ...overrides,
  };
}

const baseInput = {
  mode: "payment",
  sessionStatus: "complete",
  currency: "eur",
  livemode: false,
  paymentStatus: "paid",
  buyerEmail: "buyer@example.com",
  expectedLivemode: false as boolean | null,
  sessionAmountDiscountCents: 0,
  stripeDiscountReferences: { promotionCodeIds: ["promo_test"], couponIds: ["co_test"] },
};

describe("validatePaidGiftCardPurchase", () => {
  it("accepts a valid 50 € purchase", () => {
    const result = validatePaidGiftCardPurchase(
      { ...baseInput, lines: [lineForOffer("credit_50")] },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.offerId, "credit_50");
      assert.equal(result.nominalAmountCents, 5000);
      assert.equal(result.paidAmountCents, 5000);
      assert.equal(result.discountAmountCents, 0);
    }
  });

  it("accepts partial discount with paid balance", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        sessionAmountDiscountCents: 2000,
        lines: [
          lineForOffer("credit_100", {
            amountDiscountCents: 2000,
            amountTotalCents: 8000,
          }),
        ],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.nominalAmountCents, 10000);
      assert.equal(result.paidAmountCents, 8000);
      assert.equal(result.discountAmountCents, 2000);
    }
  });

  it("accepts 100% promo with no_payment_required", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        paymentStatus: "no_payment_required",
        sessionAmountDiscountCents: 10000,
        lines: [
          lineForOffer("credit_100", {
            amountDiscountCents: 10000,
            amountTotalCents: 0,
          }),
        ],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.nominalAmountCents, 10000);
      assert.equal(result.paidAmountCents, 0);
      assert.equal(result.discountAmountCents, 10000);
    }
  });

  it("rejects unpaid status", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        paymentStatus: "unpaid",
        sessionStatus: "complete",
        lines: [lineForOffer("credit_50")],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "not_paid");
  });

  it("rejects deferred session open", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        sessionStatus: "open",
        lines: [lineForOffer("credit_50")],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "session_open_or_expired");
  });

  it("rejects expired session", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        sessionStatus: "expired",
        lines: [lineForOffer("credit_50")],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
  });

  it("rejects zero total without discount", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        paymentStatus: "paid",
        lines: [
          lineForOffer("credit_50", {
            amountTotalCents: 0,
            amountDiscountCents: 0,
            amountSubtotalCents: 5000,
          }),
        ],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "zero_total_without_discount");
  });

  it("rejects no_payment_required without full line discount", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        paymentStatus: "no_payment_required",
        lines: [
          lineForOffer("credit_50", {
            amountDiscountCents: 1000,
            amountTotalCents: 4000,
          }),
        ],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
  });

  it("rejects 100% discount with paid status", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        paymentStatus: "paid",
        lines: [
          lineForOffer("credit_50", {
            amountDiscountCents: 5000,
            amountTotalCents: 0,
          }),
        ],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
  });

  it("ignores foreign payment", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        lines: [
          {
            ...lineForOffer("credit_50"),
            priceId: "price_foreign",
          },
        ],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "foreign_payment");
  });

  it("flags mixed cart", () => {
    const result = validatePaidGiftCardPurchase(
      {
        ...baseInput,
        lines: [lineForOffer("credit_50"), lineForOffer("credit_100")],
      },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "multiple_lines");
  });

  it("blocks 265 € without commercial override", () => {
    const result = validatePaidGiftCardPurchase(
      { ...baseInput, lines: [lineForOffer("package_week_265")] },
      allowlist,
      { allowPendingCommercial: false }
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "pending_commercial_validation");
  });
});
