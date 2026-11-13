import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import {
  generateGiftCardPdf,
  GIFT_CARD_FILLABLE_FIELD_NAMES,
} from "./generate";
import { computeGiftCardExpiresAt } from "../validity";

describe("generateGiftCardPdf (Canva template)", () => {
  it("produces 2 pages with fillable TO/FROM/MESSAGE fields", async () => {
    const paidAt = new Date("2025-06-10T10:00:00.000Z");
    const expiresAt = computeGiftCardExpiresAt(paidAt);
    const result = await generateGiftCardPdf({
      code: "IBU-TEST-0001",
      offerId: "credit_50",
      nominalAmountCents: 5000,
      currency: "eur",
      documentLocale: "fr",
      paidAt,
      expiresAt,
      specimen: true,
    });

    assert.ok(result.bytes.length > 100_000);
    const doc = await PDFDocument.load(result.bytes);
    assert.equal(doc.getPageCount(), 2);
    const form = doc.getForm();
    const names = form.getFields().map((f) => f.getName());
    for (const expected of GIFT_CARD_FILLABLE_FIELD_NAMES) {
      assert.ok(names.includes(expected), `missing field ${expected}`);
    }
  });

  it("generates EN template for document locale en", async () => {
    const paidAt = new Date("2025-06-10T10:00:00.000Z");
    const expiresAt = computeGiftCardExpiresAt(paidAt);
    const result = await generateGiftCardPdf({
      code: "IBU-TEST-0002",
      offerId: "credit_100",
      nominalAmountCents: 10000,
      currency: "eur",
      documentLocale: "en",
      paidAt,
      expiresAt,
    });
    assert.match(result.filename, /EN/);
  });
});
