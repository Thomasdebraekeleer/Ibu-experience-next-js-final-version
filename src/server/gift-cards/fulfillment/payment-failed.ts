import { eq } from "drizzle-orm";
import { getDb } from "@/server/db/client";
import { stripePurchases } from "@/server/db/schema";

export async function markCheckoutSessionPaymentFailed(
  sessionId: string
): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) return;

  const db = getDb();
  const rows = await db
    .select()
    .from(stripePurchases)
    .where(eq(stripePurchases.stripeCheckoutSessionId, sessionId))
    .limit(1);

  if (rows[0]) {
    if (
      rows[0].purchaseStatus === "fulfilled" ||
      rows[0].purchaseStatus === "issued" ||
      rows[0].paymentStatus === "paid"
    ) {
      return;
    }
    await db
      .update(stripePurchases)
      .set({
        paymentStatus: "failed",
        purchaseStatus: "payment_failed",
        updatedAt: new Date(),
      })
      .where(eq(stripePurchases.id, rows[0].id));
    return;
  }

  await db.insert(stripePurchases).values({
    stripeCheckoutSessionId: sessionId,
    buyerEmail: "unknown@invalid.local",
    currency: "eur",
    paidAmountCents: 0,
    livemode: false,
    paymentStatus: "failed",
    purchaseStatus: "payment_failed",
    stripeEnvironment: "unknown",
    documentTemplateVersion: "n/a",
    conditionsVersion: "n/a",
  });
}
