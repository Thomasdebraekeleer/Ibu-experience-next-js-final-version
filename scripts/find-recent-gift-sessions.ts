import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import Stripe from "stripe";
import { desc } from "drizzle-orm";
import { getDb, closeAppDb } from "../src/server/db/app-db";
import { stripePurchases, stripeWebhookEvents } from "../src/server/db/schema";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    console.log("STRIPE_SECRET_KEY absent");
    process.exit(1);
  }

  const stripe = new Stripe(key);
  const sessions = await stripe.checkout.sessions.list({ limit: 25 });

  const candidates = [];
  for (const s of sessions.data) {
    if (s.mode !== "payment") continue;
    const lines = await stripe.checkout.sessions.listLineItems(s.id, { limit: 5 });
    const line = lines.data[0];
    const discount = line?.amount_discount ?? 0;
    const total = s.amount_total ?? 0;
    const subtotal = s.amount_subtotal ?? 0;
    if (
      (s.payment_status === "no_payment_required" && total === 0) ||
      discount > 0
    ) {
      candidates.push({
        id: s.id,
        created: new Date(s.created * 1000).toISOString(),
        status: s.status,
        payment_status: s.payment_status,
        email: s.customer_details?.email ?? s.customer_email,
        amount_total: total,
        amount_subtotal: subtotal,
        line_discount: discount,
        currency: s.currency,
      });
    }
  }

  console.log("=== Candidats Stripe (live/test selon clé) ===\n");
  console.log(JSON.stringify(candidates, null, 2));

  const db = getDb();
  const events = await db
    .select()
    .from(stripeWebhookEvents)
    .orderBy(desc(stripeWebhookEvents.createdAt))
    .limit(15);

  console.log("\n=== Derniers événements webhook en base ===\n");
  console.log(
    JSON.stringify(
      events.map((e) => ({
        stripeEventId: e.stripeEventId,
        session: e.checkoutSessionId,
        type: e.eventType,
        status: e.processingStatus,
        error: e.errorMessage,
        at: e.processedAt ?? e.createdAt,
      })),
      null,
      2
    )
  );

  const purchases = await db
    .select()
    .from(stripePurchases)
    .orderBy(desc(stripePurchases.createdAt))
    .limit(10);

  console.log("\n=== Derniers achats en base ===\n");
  console.log(
    JSON.stringify(
      purchases.map((p) => ({
        session: p.stripeCheckoutSessionId,
        offer: p.offerId,
        purchaseStatus: p.purchaseStatus,
        paymentStatus: p.paymentStatus,
        paidCents: p.paidAmountCents,
        discountCents: p.discountAmountCents,
        email: p.buyerEmail,
      })),
      null,
      2
    )
  );

  await closeAppDb();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
