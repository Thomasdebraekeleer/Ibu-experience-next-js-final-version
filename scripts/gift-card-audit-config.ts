import { loadEnvLocal } from "./load-env-local";
import { GIFT_CARD_CATALOG } from "../src/config/gift-cards/catalog";
import { sanitizeDatabaseUrlForLogs } from "../src/server/db/migrate-client";
import Stripe from "stripe";

loadEnvLocal();

function maskStripeKey(value: string | undefined): string {
  if (!value?.trim()) return "absent";
  if (value.startsWith("sk_live_")) return "sk_live_…";
  if (value.startsWith("sk_test_")) return "sk_test_…";
  return "format_inconnu";
}

function parseSupabaseRef(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    const m = host.match(/\.([a-z0-9]+)\.supabase\.co$/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function poolerKind(url: string): "transaction_6543" | "session_5432" | "direct" | "unknown" {
  try {
    const u = new URL(url);
    if (u.hostname.includes("pooler.supabase.com") && u.port === "6543") {
      return "transaction_6543";
    }
    if (u.hostname.includes("pooler.supabase.com") && u.port === "5432") {
      return "session_5432";
    }
    if (u.hostname.includes("db.") && u.hostname.includes(".supabase.co")) {
      return "direct";
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

async function auditStripePricesReadOnly(): Promise<void> {
  const expected = process.env.STRIPE_EXPECTED_LIVEMODE;
  const secret = process.env.GIFT_CARD_STRIPE_AUDIT_SECRET_KEY?.trim();
  const fallback = process.env.STRIPE_SECRET_KEY?.trim();

  const key = secret ?? fallback;
  if (!key) {
    console.log("Audit Stripe prices: aucune clé disponible");
    return;
  }

  const stripe = new Stripe(key);
  console.log(
    `Audit Stripe (lecture seule, clé ${key.startsWith("sk_live_") ? "live" : "test"})…`
  );

  for (const offer of GIFT_CARD_CATALOG) {
    const priceId = process.env[offer.stripePriceIdEnvKey]?.trim();
    if (!priceId) {
      console.log(`- ${offer.offerId}: ${offer.stripePriceIdEnvKey} absent`);
      continue;
    }
    try {
      const price = await stripe.prices.retrieve(priceId, {
        expand: ["product"],
      });
      const productId =
        typeof price.product === "string" ? price.product : price.product?.id;
      console.log(
        `- ${offer.offerId}: price OK, devise=${price.currency}, unit_amount=${price.unit_amount}, attendu=${offer.nominalAmountCents}, product=${productId ?? "?"}`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`- ${offer.offerId}: erreur lecture price — ${msg}`);
    }
  }
}

async function main() {
  console.log("=== Audit configuration bons cadeaux ===\n");

  const dbApp = process.env.DATABASE_URL?.trim() ?? "";
  const dbMig = process.env.DATABASE_MIGRATION_URL?.trim() ?? "";

  console.log("Base de données:");
  if (dbApp) {
    console.log(`  DATABASE_URL: ${sanitizeDatabaseUrlForLogs(dbApp)}`);
    console.log(`    pooler: ${poolerKind(dbApp)} (attendu: transaction_6543 pour Vercel)`);
    console.log(`    ref: ${parseSupabaseRef(dbApp) ?? "n/a"}`);
  } else {
    console.log("  DATABASE_URL: absent");
  }
  if (dbMig) {
    console.log(`  DATABASE_MIGRATION_URL: ${sanitizeDatabaseUrlForLogs(dbMig)}`);
    console.log(`    pooler: ${poolerKind(dbMig)} (attendu: direct ou session_5432)`);
    console.log(`    ref: ${parseSupabaseRef(dbMig) ?? "n/a"}`);
  } else {
    console.log("  DATABASE_MIGRATION_URL: absent (repli sur DATABASE_URL pour migrate)");
  }

  if (dbApp && dbMig) {
    const refApp = parseSupabaseRef(dbApp);
    const refMig = parseSupabaseRef(dbMig);
    if (refApp && refMig && refApp !== refMig) {
      console.log("  ATTENTION: refs Supabase différentes entre app et migration");
    }
  }

  console.log("\nStripe:");
  console.log(`  STRIPE_EXPECTED_LIVEMODE: ${process.env.STRIPE_EXPECTED_LIVEMODE ?? "absent"}`);
  console.log(`  STRIPE_SECRET_KEY: ${maskStripeKey(process.env.STRIPE_SECRET_KEY)}`);
  console.log(
    `  GIFT_CARD_STRIPE_AUDIT_SECRET_KEY: ${maskStripeKey(process.env.GIFT_CARD_STRIPE_AUDIT_SECRET_KEY)}`
  );

  const expected = process.env.STRIPE_EXPECTED_LIVEMODE;
  const sk = process.env.STRIPE_SECRET_KEY ?? "";
  if (expected === "test" && sk.startsWith("sk_live_")) {
    console.log("  ATTENTION: STRIPE_EXPECTED_LIVEMODE=test mais STRIPE_SECRET_KEY est live");
  }
  if (expected === "live" && sk.startsWith("sk_test_")) {
    console.log("  ATTENTION: STRIPE_EXPECTED_LIVEMODE=live mais STRIPE_SECRET_KEY est test");
  }

  if (expected === "live") {
    console.log(
      "  Mode live détecté — pas de test d’écriture métier automatique dans cet audit."
    );
  }

  console.log("\nResend / e-mail:");
  console.log(`  GIFT_CARD_EMAIL_MODE: ${process.env.GIFT_CARD_EMAIL_MODE ?? "mock (défaut)"}`);
  console.log(`  RESEND_API_KEY: ${process.env.RESEND_API_KEY ? "présent" : "absent"}`);

  await auditStripePricesReadOnly();
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
