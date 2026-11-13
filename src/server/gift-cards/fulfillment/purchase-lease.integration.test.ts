import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { loadEnvLocal } from "../../../../scripts/load-env-local";
import { getDb, closeAppDb } from "@/server/db/app-db";
import { stripePurchases } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {
  tryAcquirePurchaseLease,
  releasePurchaseLease,
} from "./lease";
import {
  GIFT_CARD_CONDITIONS_VERSION,
  GIFT_CARD_DOCUMENT_TEMPLATE_VERSION,
} from "@/config/gift-cards/types";

loadEnvLocal();

const enabled = Boolean(process.env.DATABASE_URL?.trim());
const isLive =
  process.env.STRIPE_EXPECTED_LIVEMODE === "live" &&
  process.env.GIFT_CARD_INTEGRATION_ALLOW_LIVE_DB !== "true";

describe("purchase lease concurrency", { skip: !enabled || isLive }, () => {
  let purchaseId: string;
  const sessionId = `cs_test_lease_${Date.now()}`;

  after(async () => {
    await closeAppDb();
  });

  it("only one worker holds an active lease", async () => {
    const db = getDb();
    const inserted = await db
      .insert(stripePurchases)
      .values({
        stripeCheckoutSessionId: sessionId,
        buyerEmail: "lease-test@example.com",
        currency: "eur",
        paidAmountCents: 5000,
        livemode: false,
        paymentStatus: "paid",
        purchaseStatus: "open",
        stripeEnvironment: "test",
        documentTemplateVersion: GIFT_CARD_DOCUMENT_TEMPLATE_VERSION,
        conditionsVersion: GIFT_CARD_CONDITIONS_VERSION,
      })
      .returning({ id: stripePurchases.id });

    purchaseId = inserted[0]!.id;

    const a = await tryAcquirePurchaseLease(db, purchaseId, "worker-a");
    const b = await tryAcquirePurchaseLease(db, purchaseId, "worker-b");
    assert.equal(a, true);
    assert.equal(b, false);

    await releasePurchaseLease(db, purchaseId, "worker-a");
    const c = await tryAcquirePurchaseLease(db, purchaseId, "worker-c");
    assert.equal(c, true);
    await releasePurchaseLease(db, purchaseId, "worker-c");

    await db.delete(stripePurchases).where(eq(stripePurchases.id, purchaseId));
  });
});
