import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  assertRecipientAllowedForMode,
  getEmailMode,
} from "./transport";

const prevMode = process.env.GIFT_CARD_EMAIL_MODE;
const prevList = process.env.GIFT_CARD_TEST_RECIPIENT_ALLOWLIST;

describe("resend_allowlisted", () => {
  afterEach(() => {
    process.env.GIFT_CARD_EMAIL_MODE = prevMode;
    process.env.GIFT_CARD_TEST_RECIPIENT_ALLOWLIST = prevList;
  });

  it("refuses without explicit allowlist", () => {
    process.env.GIFT_CARD_EMAIL_MODE = "resend_allowlisted";
    delete process.env.GIFT_CARD_TEST_RECIPIENT_ALLOWLIST;
    const r = assertRecipientAllowedForMode("test@example.com");
    assert.equal(r.allowed, false);
  });

  it("does not allow arbitrary example.com when list is empty", () => {
    process.env.GIFT_CARD_EMAIL_MODE = "resend_allowlisted";
    process.env.GIFT_CARD_TEST_RECIPIENT_ALLOWLIST = "";
    assert.equal(assertRecipientAllowedForMode("buyer@example.com").allowed, false);
  });

  it("allows only listed recipients", () => {
    process.env.GIFT_CARD_EMAIL_MODE = "resend_allowlisted";
    process.env.GIFT_CARD_TEST_RECIPIENT_ALLOWLIST = "qa@test.ibu-experience.be";
    assert.equal(
      assertRecipientAllowedForMode("qa@test.ibu-experience.be").allowed,
      true
    );
    assert.equal(
      assertRecipientAllowedForMode("client@ibu-experience.be").allowed,
      false
    );
  });
});
