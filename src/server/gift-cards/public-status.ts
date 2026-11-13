import { GIFT_CARD_CATALOG } from "@/config/gift-cards/catalog";
import { loadGiftCardStripeAllowlistFromEnv } from "./stripe-allowlist";

export type GiftCardSystemPublicStatus = {
  automationConfigured: boolean;
  storefrontReady: boolean;
  pendingCommercialOffers: string[];
  messages: string[];
};

/** État public affiché sur la page carte cadeau (sans accès DB). */
export function getGiftCardSystemPublicStatus(): GiftCardSystemPublicStatus {
  const missingEnvKeys: string[] = [];

  const optionalAutomationKeys = [
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "GIFT_CARD_EMAIL_MODE",
  ];

  for (const key of optionalAutomationKeys) {
    if (!process.env[key]?.trim()) {
      missingEnvKeys.push(key);
    }
  }

  const allowlist = loadGiftCardStripeAllowlistFromEnv();
  missingEnvKeys.push(...allowlist.missingPriceIds);

  const emailMode = process.env.GIFT_CARD_EMAIL_MODE?.trim() || "mock";
  if (emailMode === "resend" || emailMode === "resend_allowlisted") {
    if (!process.env.RESEND_API_KEY?.trim()) missingEnvKeys.push("RESEND_API_KEY");
    if (!process.env.GIFT_CARD_FROM_EMAIL?.trim()) {
      missingEnvKeys.push("GIFT_CARD_FROM_EMAIL");
    }
  }

  if (process.env.NODE_ENV === "production" && !process.env.STRIPE_EXPECTED_LIVEMODE?.trim()) {
    missingEnvKeys.push("STRIPE_EXPECTED_LIVEMODE");
  }

  const uniqueMissing = Array.from(new Set(missingEnvKeys));
  const automationConfigured = uniqueMissing.length === 0;

  const storefrontReady =
    allowlist.missingPriceIds.length < GIFT_CARD_CATALOG.length;

  const messages: string[] = [];
  if (allowlist.pendingCommercialOffers.length > 0) {
    messages.push(
      "Certaines offres (265 € / 315 €) restent en attente de validation commerciale avant émission automatique en production."
    );
  }
  if (!automationConfigured) {
    messages.push(
      "La configuration serveur des bons cadeaux est incomplète : l’achat reste possible via Stripe, mais l’envoi automatique n’est pas encore actif."
    );
  }

  return {
    automationConfigured,
    storefrontReady,
    pendingCommercialOffers: allowlist.pendingCommercialOffers,
    messages,
  };
}

/** Diagnostic serveur (CLI) — n’expose pas de secrets, peut lister des noms de variables. */
export function getGiftCardAutomationDiagnostics(): {
  missingEnvKeys: string[];
  automationConfigured: boolean;
} {
  const missingEnvKeys: string[] = [];
  const keys = [
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "GIFT_CARD_EMAIL_MODE",
  ];
  for (const key of keys) {
    if (!process.env[key]?.trim()) missingEnvKeys.push(key);
  }
  const allowlist = loadGiftCardStripeAllowlistFromEnv();
  missingEnvKeys.push(...allowlist.missingPriceIds);
  const uniqueMissing = Array.from(new Set(missingEnvKeys));
  return {
    missingEnvKeys: uniqueMissing,
    automationConfigured: uniqueMissing.length === 0,
  };
}
