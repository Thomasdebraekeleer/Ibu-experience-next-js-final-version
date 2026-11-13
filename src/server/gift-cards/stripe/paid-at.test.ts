import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveGiftCardPaidAtFromStripe } from "./paid-at";

describe("resolveGiftCardPaidAtFromStripe", () => {
  it("uses checkoutCompletedAt for no_payment_required", () => {
    const completed = new Date("2025-11-10T15:00:00.000Z");
    const paidAt = resolveGiftCardPaidAtFromStripe({
      session: {
        payment_status: "no_payment_required",
        status: "complete",
      } as Parameters<typeof resolveGiftCardPaidAtFromStripe>[0]["session"],
      checkoutCompletedAt: completed,
    });
    assert.equal(paidAt?.toISOString(), completed.toISOString());
  });
});
