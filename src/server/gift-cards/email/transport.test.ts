import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { sendGiftCardEmail } from "./transport";

const previousMode = process.env.GIFT_CARD_EMAIL_MODE;

describe("sendGiftCardEmail mock mode", () => {
  before(() => {
    process.env.GIFT_CARD_EMAIL_MODE = "mock";
  });

  after(() => {
    process.env.GIFT_CARD_EMAIL_MODE = previousMode;
  });

  it("writes outbox files without real send", async () => {
    const result = await sendGiftCardEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
      text: "Test",
      pdfFilename: "test.pdf",
      pdfBytes: Buffer.from("%PDF-1.4"),
      idempotencyKey: "test/mock-1",
    });
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.simulated, true);
    const outDir = path.join(process.cwd(), ".gift-card-outbox");
    assert.ok(fs.existsSync(outDir));
  });
});
