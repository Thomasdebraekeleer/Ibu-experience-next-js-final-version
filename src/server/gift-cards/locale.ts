import type Stripe from "stripe";
import type { GiftCardLocale } from "@/config/gift-cards/types";

/** Normalise session.locale Stripe → fr | nl-BE (repli FR). */
export function normalizeGiftCardLocale(
  stripeLocale: string | null | undefined
): GiftCardLocale {
  if (!stripeLocale || stripeLocale === "auto") {
    return "fr";
  }
  const value = stripeLocale.toLowerCase();
  if (value.startsWith("nl")) {
    return "nl-BE";
  }
  return "fr";
}

/**
 * Langue du parcours :
 * 1. metadata.gift_card_locale (Payment Link / session)
 * 2. client_reference_id « nl » | « fr » si présent
 * 3. session.locale Stripe
 * 4. repli FR
 */
export function resolveGiftCardSiteLocale(
  session: Stripe.Checkout.Session
): GiftCardLocale {
  const meta = session.metadata?.gift_card_locale?.toLowerCase();
  if (meta === "nl-be" || meta === "nl") return "nl-BE";
  if (meta === "fr") return "fr";

  const ref = session.client_reference_id?.toLowerCase();
  if (ref === "nl" || ref === "nl-be") return "nl-BE";
  if (ref === "fr") return "fr";

  return normalizeGiftCardLocale(session.locale);
}
