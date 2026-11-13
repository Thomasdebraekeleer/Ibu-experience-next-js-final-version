import { getEmailMode, isRealEmailDeliveryConfigured } from "./email/transport";
import {
  getGiftCardAutomationDiagnostics,
  getGiftCardSystemPublicStatus,
  type GiftCardSystemPublicStatus,
} from "./public-status";

export type { GiftCardSystemPublicStatus };

export function assertGiftCardProductionReady(): string[] {
  const blockers: string[] = [];

  const diag = getGiftCardAutomationDiagnostics();
  blockers.push(...diag.missingEnvKeys);

  const status = getGiftCardSystemPublicStatus();
  if (status.pendingCommercialOffers.length > 0) {
    blockers.push(
      "PENDING_COMMERCIAL: valider les offres 265 € et 315 € (crédit vs prestation, conditions) avant activation"
    );
  }

  const mode = getEmailMode();
  if (mode === "mock") {
    blockers.push("GIFT_CARD_EMAIL_MODE=mock interdit pour l’automatisation production");
  }

  if (process.env.STRIPE_EXPECTED_LIVEMODE === "live" && mode === "mock") {
    blockers.push("Stripe live + mode e-mail mock incompatible");
  }

  if (!isRealEmailDeliveryConfigured()) {
    blockers.push("Configurer Resend (resend ou resend_allowlisted) pour la production");
  }

  if (mode === "resend_allowlisted") {
    if (!process.env.GIFT_CARD_TEST_RECIPIENT_ALLOWLIST?.trim()) {
      blockers.push(
        "GIFT_CARD_TEST_RECIPIENT_ALLOWLIST obligatoire en resend_allowlisted"
      );
    }
  }

  if (process.env.GIFT_CARD_ALLOW_PENDING_COMMERCIAL === "true") {
    blockers.push(
      "GIFT_CARD_ALLOW_PENDING_COMMERCIAL ne doit pas être activé en production"
    );
  }

  if (!process.env.STRIPE_EXPECTED_LIVEMODE?.trim()) {
    blockers.push("STRIPE_EXPECTED_LIVEMODE manquant");
  }

  return blockers;
}
