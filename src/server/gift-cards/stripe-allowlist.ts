import { GIFT_CARD_CATALOG } from "@/config/gift-cards/catalog";
import type { GiftCardOfferDefinition } from "@/config/gift-cards/types";

export type ResolvedStripeOfferBinding = {
  offer: GiftCardOfferDefinition;
  stripePriceId: string;
  stripePaymentLinkId?: string;
};

export type GiftCardStripeAllowlist = {
  bindingsByPriceId: Map<string, ResolvedStripeOfferBinding>;
  allowedPriceIds: Set<string>;
  allowedPaymentLinkIds: Set<string>;
  missingPriceIds: string[];
  pendingCommercialOffers: string[];
};

const TEST_FIXTURE_PRICE_PREFIX = "price_test_fixture_";

/** Identifiants factices pour tests unitaires sans compte Stripe. */
export function buildTestFixtureAllowlist(): GiftCardStripeAllowlist {
  const bindings = new Map<string, ResolvedStripeOfferBinding>();
  const allowedPaymentLinkIds = new Set<string>();
  for (const offer of GIFT_CARD_CATALOG) {
    const stripePriceId = `${TEST_FIXTURE_PRICE_PREFIX}${offer.offerId}`;
    bindings.set(stripePriceId, { offer, stripePriceId });
    allowedPaymentLinkIds.add(`plink_test_fixture_${offer.offerId}`);
  }
  return {
    bindingsByPriceId: bindings,
    allowedPriceIds: new Set(bindings.keys()),
    allowedPaymentLinkIds,
    missingPriceIds: [],
    pendingCommercialOffers: GIFT_CARD_CATALOG.filter(
      (o) => o.commercialValidationStatus === "pending_validation"
    ).map((o) => o.offerId),
  };
}

export function loadGiftCardStripeAllowlistFromEnv(): GiftCardStripeAllowlist {
  const bindings = new Map<string, ResolvedStripeOfferBinding>();
  const missingPriceIds: string[] = [];
  const allowedPaymentLinkIds = new Set<string>();

  for (const offer of GIFT_CARD_CATALOG) {
    const stripePriceId = process.env[offer.stripePriceIdEnvKey]?.trim();
    const paymentLinkId =
      process.env[offer.stripePaymentLinkIdEnvKey]?.trim() || undefined;

    if (!stripePriceId) {
      missingPriceIds.push(offer.stripePriceIdEnvKey);
      continue;
    }

    bindings.set(stripePriceId, {
      offer,
      stripePriceId,
      stripePaymentLinkId: paymentLinkId,
    });

    if (paymentLinkId) {
      allowedPaymentLinkIds.add(paymentLinkId);
    }
  }

  return {
    bindingsByPriceId: bindings,
    allowedPriceIds: new Set(bindings.keys()),
    allowedPaymentLinkIds,
    missingPriceIds,
    pendingCommercialOffers: GIFT_CARD_CATALOG.filter(
      (o) => o.commercialValidationStatus === "pending_validation"
    ).map((o) => o.offerId),
  };
}

export function isFixtureStripePriceId(priceId: string): boolean {
  return priceId.startsWith(TEST_FIXTURE_PRICE_PREFIX);
}
