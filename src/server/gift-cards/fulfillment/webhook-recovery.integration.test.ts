import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { loadEnvLocal } from "../../../../scripts/load-env-local";
import { getDb, closeAppDb } from "@/server/db/app-db";
import { stripeWebhookEvents } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {
  claimStripeWebhookEvent,
  releaseStripeWebhookEventLease,
} from "./webhook-event-lease";
loadEnvLocal();

const enabled = Boolean(process.env.DATABASE_URL?.trim());
const isLive =
  process.env.STRIPE_EXPECTED_LIVEMODE === "live" &&
  process.env.GIFT_CARD_INTEGRATION_ALLOW_LIVE_DB !== "true";

describe("webhook event recovery", { skip: !enabled || isLive }, () => {
  const eventId = `evt_test_recovery_${Date.now()}`;

  after(async () => {
    await closeAppDb();
  });

  it("reclaims processing after expired lease", async () => {
    const db = getDb();
    await db.insert(stripeWebhookEvents).values({
      stripeEventId: eventId,
      eventType: "checkout.session.completed",
      checkoutSessionId: "cs_test_recovery",
      processingStatus: "processing",
      processingLeaseOwner: "stale-worker",
      processingLeaseExpiresAt: new Date(Date.now() - 60_000),
    });

    const claim = await claimStripeWebhookEvent(db, eventId, "worker-2");
    assert.equal(claim.kind, "claimed");

    await releaseStripeWebhookEventLease(db, eventId, "worker-2");

    const rows = await db
      .select()
      .from(stripeWebhookEvents)
      .where(eq(stripeWebhookEvents.stripeEventId, eventId))
      .limit(1);
    assert.equal(rows[0]?.processingLeaseOwner, null);
  });

  it("skips already processed events", async () => {
    const db = getDb();
    const doneId = `${eventId}_done`;
    await db.insert(stripeWebhookEvents).values({
      stripeEventId: doneId,
      eventType: "checkout.session.completed",
      processingStatus: "processed",
    });

    const claim = await claimStripeWebhookEvent(db, doneId, "worker-3");
    assert.equal(claim.kind, "skip_done");
  });
});
