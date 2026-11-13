import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkGiftCardUsability,
  computeGiftCardExpiresAt,
  expiryCalendarDateFromPaid,
  isGiftCardExpired,
} from "./validity";

describe("gift card validity", () => {
  it("expires 12 calendar months later (Brussels)", () => {
    const paidAt = new Date("2024-01-15T14:30:00.000Z");
    const expiresAt = computeGiftCardExpiresAt(paidAt);
    assert.equal(isGiftCardExpired(expiresAt, paidAt), false);
    assert.equal(
      isGiftCardExpired(expiresAt, new Date(expiresAt.getTime() + 60_000)),
      true
    );
  });

  it("handles Feb 29 paid date", () => {
    const paidYmd = { year: 2024, month: 2, day: 29 };
    const expiryYmd = expiryCalendarDateFromPaid(paidYmd);
    assert.equal(expiryYmd.year, 2025);
    assert.equal(expiryYmd.month, 2);
    assert.equal(expiryYmd.day, 28);
  });

  it("handles month-end Jan 31", () => {
    const paidYmd = { year: 2024, month: 1, day: 31 };
    const expiryYmd = expiryCalendarDateFromPaid(paidYmd);
    assert.equal(expiryYmd.year, 2025);
    assert.equal(expiryYmd.month, 1);
    assert.equal(expiryYmd.day, 31);
  });

  it("blocks redemption when expired", () => {
    const past = new Date("2020-01-01T12:00:00.000Z");
    const result = checkGiftCardUsability({
      cardStatus: "active",
      expiresAt: past,
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.reason, "expired");
  });
});
