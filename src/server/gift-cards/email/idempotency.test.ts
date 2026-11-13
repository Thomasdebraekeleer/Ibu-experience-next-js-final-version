import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  RESEND_IDEMPOTENCY_WINDOW_MS,
  isAutomaticRetryAllowed,
  isWithinResendIdempotencyWindow,
} from "./idempotency";

describe("Resend idempotency window", () => {
  it("allows retry inside 24h", () => {
    const created = new Date(Date.now() - RESEND_IDEMPOTENCY_WINDOW_MS + 60_000);
    assert.equal(isWithinResendIdempotencyWindow(created), true);
    assert.equal(
      isAutomaticRetryAllowed({ sendStatus: "failed", createdAt: created }),
      true
    );
  });

  it("blocks automatic retry after 24h", () => {
    const created = new Date(Date.now() - RESEND_IDEMPOTENCY_WINDOW_MS - 1);
    assert.equal(isWithinResendIdempotencyWindow(created), false);
    assert.equal(
      isAutomaticRetryAllowed({ sendStatus: "unknown", createdAt: created }),
      false
    );
  });
});
