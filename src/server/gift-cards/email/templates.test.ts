import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildGiftCardEmail } from "./templates";

const paidAt = new Date("2025-03-01T12:00:00.000Z");
const expiresAt = new Date("2026-02-28T22:59:59.000Z");

describe("buildGiftCardEmail", () => {
  it("escapes HTML in the code", () => {
    const { html } = buildGiftCardEmail({
      siteLocale: "fr",
      buyerFullName: "Marie Dupont",
      buyerFirstName: null,
      code: `<script>alert(1)</script>`,
      nominalAmountCents: 5000,
      currency: "eur",
      pdfFilename: "bon.pdf",
      paidAt,
      expiresAt,
    });
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>alert/);
  });
});
