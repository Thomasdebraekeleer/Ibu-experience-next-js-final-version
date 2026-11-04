import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildValidateCheckoutOutcome } from "./validate-checkout-outcome";
import { resolveCoconCheckoutUrl } from "@/config/booking/checkout-url";
import type { BookingCocon } from "@/config/booking/types";

const constraints = { nights: 3, minStay: 1, maxStay: 30, currencyCode: "EUR" };

const cocon1: BookingCocon = {
  id: "cocon-1",
  status: "active",
  capacityAdults: 2,
  lodgify: { propertyId: 710587, roomTypeId: 777690 },
  checkoutUrlKey: "mehaignoulCocon1",
};

const cocon2: BookingCocon = {
  id: "cocon-2",
  status: "active",
  capacityAdults: 2,
  lodgify: { propertyId: 738662, roomTypeId: 805778 },
  checkoutUrlKey: "mehaignoulCocon2",
};

const stay = { arrival: "2026-11-17", departure: "2026-11-20", adults: 2 };

describe("buildValidateCheckoutOutcome", () => {
  it("coconId=all, only Cocon 2 quoted, preview checkout refused → 422", () => {
    const outcome = buildValidateCheckoutOutcome({
      quoteConfirmedIds: ["cocon-2"],
      checkoutUrls: {},
      checkoutBlocked: { "cocon-2": "checkout_not_configured" },
      constraints,
      pricingByCocon: {},
    });
    assert.equal(outcome.status, 422);
    assert.equal(outcome.body.valid, false);
    assert.equal(outcome.body.reason, "checkout_not_configured");
    assert.deepEqual(outcome.body.availableCoconIds, ["cocon-2"]);
    assert.deepEqual(outcome.body.checkoutUrls, {});
    assert.equal(outcome.body.checkoutBlocked["cocon-2"], "checkout_not_configured");
  });

  it("coconId=all, both quoted, Cocon 1 checkout only → 200", () => {
    const c1 = resolveCoconCheckoutUrl(cocon1, "fr", stay);
    assert.equal(c1.ok, true);

    const outcome = buildValidateCheckoutOutcome({
      quoteConfirmedIds: ["cocon-1", "cocon-2"],
      checkoutUrls: c1.ok ? { "cocon-1": c1.url } : {},
      checkoutBlocked: { "cocon-2": "checkout_not_configured" },
      constraints,
      pricingByCocon: {
        "cocon-1": { totalIncludingVat: 795, currencyCode: "EUR", nights: 3 },
      },
    });
    assert.equal(outcome.status, 200);
    assert.equal(outcome.body.valid, true);
    assert.equal(outcome.body.reason, null);
    assert.ok(outcome.body.checkoutUrls["cocon-1"]);
    assert.equal(outcome.body.checkoutBlocked["cocon-2"], "checkout_not_configured");
  });

  it("official Cocon 2 URL → checkout resolved and full validate 200", () => {
    const c2 = resolveCoconCheckoutUrl(cocon2, "fr", stay);
    assert.equal(c2.ok, true);
    if (!c2.ok) return;

    const c1 = resolveCoconCheckoutUrl(cocon1, "fr", stay);
    assert.equal(c1.ok, true);
    if (!c1.ok) return;

    const outcome = buildValidateCheckoutOutcome({
      quoteConfirmedIds: ["cocon-1", "cocon-2"],
      checkoutUrls: {
        "cocon-1": c1.url,
        "cocon-2": c2.url,
      },
      checkoutBlocked: {},
      constraints,
      pricingByCocon: {
        "cocon-1": { totalIncludingVat: 795, currencyCode: "EUR", nights: 3 },
        "cocon-2": { totalIncludingVat: 795, currencyCode: "EUR", nights: 3 },
      },
    });
    assert.equal(outcome.status, 200);
    assert.equal(outcome.body.valid, true);
    assert.ok(outcome.body.checkoutUrls["cocon-2"].includes("ibu-experience.lodgify.com"));
    assert.deepEqual(outcome.body.checkoutBlocked, {});
  });

  it("never returns valid true when checkoutUrls is empty", () => {
    const outcome = buildValidateCheckoutOutcome({
      quoteConfirmedIds: ["cocon-1", "cocon-2"],
      checkoutUrls: {},
      checkoutBlocked: {
        "cocon-1": "checkout_not_configured",
        "cocon-2": "checkout_not_configured",
      },
      constraints,
      pricingByCocon: {},
    });
    assert.equal(outcome.body.valid, false);
    assert.equal(Object.keys(outcome.body.checkoutUrls).length, 0);
  });
});
