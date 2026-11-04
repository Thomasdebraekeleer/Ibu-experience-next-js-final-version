import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isAllowedCheckoutHostname, isAllowedCheckoutUrl } from "./checkout-domains";
import { resolveCoconCheckoutUrl } from "./checkout-url";
import type { BookingCocon } from "./types";

describe("checkout domain allowlist", () => {
  it("rejects npreview hostnames", () => {
    assert.equal(isAllowedCheckoutHostname("npreview-ibu-experience.lodgify.com"), false);
    assert.equal(
      isAllowedCheckoutUrl(
        "https://npreview-ibu-experience.lodgify.com/fr/ibu-experience---cocon-2---domaine-de-mehaignoul"
      ),
      false
    );
  });

  it("allows official ibu-experience host", () => {
    assert.equal(isAllowedCheckoutHostname("ibu-experience.lodgify.com"), true);
  });

  it("returns checkout_not_configured for npreview base URL on cocon 2", () => {
    const previewBase =
      "https://npreview-ibu-experience.lodgify.com/fr/ibu-experience---cocon-2---domaine-de-mehaignoul";
    assert.equal(isAllowedCheckoutUrl(previewBase), false);
  });

  it("resolves official cocon 2 checkout URL", () => {
    const cocon: BookingCocon = {
      id: "cocon-2",
      status: "active",
      capacityAdults: 2,
      lodgify: { propertyId: 738662, roomTypeId: 805778 },
      checkoutUrlKey: "mehaignoulCocon2",
    };
    const result = resolveCoconCheckoutUrl(cocon, "fr", {
      arrival: "2026-12-10",
      departure: "2026-12-12",
      adults: 2,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.ok(result.url.includes("ibu-experience.lodgify.com"));
      assert.equal(result.url.includes("npreview"), false);
    }
  });
});
