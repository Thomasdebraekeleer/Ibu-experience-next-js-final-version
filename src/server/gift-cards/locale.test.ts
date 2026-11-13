import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeGiftCardLocale, resolveGiftCardSiteLocale } from "./locale";

describe("normalizeGiftCardLocale", () => {
  it("falls back to fr when absent", () => {
    assert.equal(normalizeGiftCardLocale(undefined), "fr");
    assert.equal(normalizeGiftCardLocale("auto"), "fr");
  });

  it("maps nl variants", () => {
    assert.equal(normalizeGiftCardLocale("nl"), "nl-BE");
    assert.equal(normalizeGiftCardLocale("nl-BE"), "nl-BE");
  });
});

describe("resolveGiftCardSiteLocale", () => {
  it("prefers metadata gift_card_locale", () => {
    const session = {
      metadata: { gift_card_locale: "nl" },
      locale: "fr",
      client_reference_id: null,
    } as Parameters<typeof resolveGiftCardSiteLocale>[0];
    assert.equal(resolveGiftCardSiteLocale(session), "nl-BE");
  });

  it("falls back to fr when auto", () => {
    const session = {
      metadata: {},
      locale: "auto",
      client_reference_id: null,
    } as Parameters<typeof resolveGiftCardSiteLocale>[0];
    assert.equal(resolveGiftCardSiteLocale(session), "fr");
  });
});
