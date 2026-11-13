import { and, eq, isNull, lt, or } from "drizzle-orm";
import type { getDb } from "@/server/db/client";
import { emailOperations, stripePurchases } from "@/server/db/schema";

type Db = ReturnType<typeof getDb>;

const DEFAULT_LEASE_MS = 2 * 60 * 1000;

export async function tryAcquirePurchaseLease(
  db: Db,
  purchaseId: string,
  owner: string,
  leaseMs = DEFAULT_LEASE_MS
): Promise<boolean> {
  const expires = new Date(Date.now() + leaseMs);
  const rows = await db
    .update(stripePurchases)
    .set({
      processingLeaseOwner: owner,
      processingLeaseExpiresAt: expires,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(stripePurchases.id, purchaseId),
        or(
          isNull(stripePurchases.processingLeaseExpiresAt),
          lt(stripePurchases.processingLeaseExpiresAt, new Date()),
          eq(stripePurchases.processingLeaseOwner, owner)
        )
      )
    )
    .returning({ id: stripePurchases.id });

  return rows.length > 0;
}

export async function releasePurchaseLease(
  db: Db,
  purchaseId: string,
  owner: string
): Promise<void> {
  await db
    .update(stripePurchases)
    .set({
      processingLeaseOwner: null,
      processingLeaseExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(stripePurchases.id, purchaseId),
        eq(stripePurchases.processingLeaseOwner, owner)
      )
    );
}

export async function tryAcquireEmailOperationLease(
  db: Db,
  operationId: string,
  owner: string,
  leaseMs = DEFAULT_LEASE_MS
): Promise<boolean> {
  const expires = new Date(Date.now() + leaseMs);
  const rows = await db
    .update(emailOperations)
    .set({
      processingLeaseOwner: owner,
      processingLeaseExpiresAt: expires,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(emailOperations.id, operationId),
        or(
          isNull(emailOperations.processingLeaseExpiresAt),
          lt(emailOperations.processingLeaseExpiresAt, new Date()),
          eq(emailOperations.processingLeaseOwner, owner)
        )
      )
    )
    .returning({ id: emailOperations.id });

  return rows.length > 0;
}

export async function releaseEmailOperationLease(
  db: Db,
  operationId: string,
  owner: string
): Promise<void> {
  await db
    .update(emailOperations)
    .set({
      processingLeaseOwner: null,
      processingLeaseExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(emailOperations.id, operationId),
        eq(emailOperations.processingLeaseOwner, owner)
      )
    );
}
