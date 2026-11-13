import { describe, it } from "node:test";

/**
 * Tests de concurrence réels (PostgreSQL) : nécessitent DATABASE_URL + migration.
 * À exécuter manuellement une fois Supabase configuré.
 *
 * npm run test -- src/server/gift-cards/fulfillment/concurrency.integration.test.ts
 */
describe("gift card concurrency (integration)", { skip: !process.env.DATABASE_URL?.trim() }, () => {
  it("TODO: parallel webhook processing for same checkout session", async () => {
    // Placeholder : implémenter avec deux appels concurrents à processPaidCheckoutSession.
  });
});
