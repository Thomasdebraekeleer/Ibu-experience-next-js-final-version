import { and, eq, inArray, lt, or, sql } from "drizzle-orm";
import type { getDb } from "@/server/db/client";
import { stripeWebhookEvents } from "@/server/db/schema";

type Db = ReturnType<typeof getDb>;

const DEFAULT_WEBHOOK_LEASE_MS = 2 * 60 * 1000;

const TERMINAL_STATUSES = new Set(["processed", "ignored"]);

export type WebhookEventClaim =
  | { kind: "claimed" }
  | { kind: "skip_done" }
  | { kind: "busy" };

export async function claimStripeWebhookEvent(
  db: Db,
  stripeEventId: string,
  owner: string,
  leaseMs = DEFAULT_WEBHOOK_LEASE_MS
): Promise<WebhookEventClaim> {
  const existing = await db
    .select()
    .from(stripeWebhookEvents)
    .where(eq(stripeWebhookEvents.stripeEventId, stripeEventId))
    .limit(1);

  const row = existing[0];
  if (row && TERMINAL_STATUSES.has(row.processingStatus)) {
    return { kind: "skip_done" };
  }

  const now = new Date();
  const expires = new Date(Date.now() + leaseMs);

  const claimed = await db
    .update(stripeWebhookEvents)
    .set({
      processingStatus: "processing",
      processingLeaseOwner: owner,
      processingLeaseExpiresAt: expires,
      processingAttempts: sql`${stripeWebhookEvents.processingAttempts} + 1`,
    })
    .where(
      and(
        eq(stripeWebhookEvents.stripeEventId, stripeEventId),
        or(
          inArray(stripeWebhookEvents.processingStatus, ["received", "failed"]),
          and(
            eq(stripeWebhookEvents.processingStatus, "processing"),
            or(
              sql`${stripeWebhookEvents.processingLeaseExpiresAt} IS NULL`,
              lt(stripeWebhookEvents.processingLeaseExpiresAt, now)
            )
          )
        )
      )
    )
    .returning({ id: stripeWebhookEvents.id });

  if (claimed.length > 0) {
    return { kind: "claimed" };
  }

  return { kind: "busy" };
}

export async function releaseStripeWebhookEventLease(
  db: Db,
  stripeEventId: string,
  owner: string
): Promise<void> {
  await db
    .update(stripeWebhookEvents)
    .set({
      processingLeaseOwner: null,
      processingLeaseExpiresAt: null,
    })
    .where(
      and(
        eq(stripeWebhookEvents.stripeEventId, stripeEventId),
        eq(stripeWebhookEvents.processingLeaseOwner, owner)
      )
    );
}
