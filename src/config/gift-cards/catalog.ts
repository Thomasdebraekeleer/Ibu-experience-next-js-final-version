import type { GiftCardOfferDefinition, GiftCardPublicOption } from "./types";

/** Payment Links actuels — conservés pour la V1. */
export const GIFT_CARD_CATALOG: GiftCardOfferDefinition[] = [
  {
    offerId: "credit_50",
    amountEur: 50,
    nominalAmountCents: 5000,
    currency: "eur",
    kind: "credit",
    paymentLinkUrl: "https://buy.stripe.com/14A9ASaweenRgvc9Qt1Fe00",
    labels: {
      fr: { title: "Crédit cadeau", short: "50 €" },
      "nl-BE": { title: "Cadeautegoed", short: "50 €" },
    },
    commercialValidationStatus: "validated",
    stripePriceIdEnvKey: "GIFT_CARD_STRIPE_PRICE_ID_50",
    stripePaymentLinkIdEnvKey: "GIFT_CARD_STRIPE_PAYMENT_LINK_ID_50",
  },
  {
    offerId: "credit_100",
    amountEur: 100,
    nominalAmountCents: 10000,
    currency: "eur",
    kind: "credit",
    paymentLinkUrl: "https://buy.stripe.com/8x28wO47QbbFbaSaUx1Fe01",
    labels: {
      fr: { title: "Crédit cadeau", short: "100 €" },
      "nl-BE": { title: "Cadeautegoed", short: "100 €" },
    },
    commercialValidationStatus: "validated",
    stripePriceIdEnvKey: "GIFT_CARD_STRIPE_PRICE_ID_100",
    stripePaymentLinkIdEnvKey: "GIFT_CARD_STRIPE_PAYMENT_LINK_ID_100",
  },
  {
    offerId: "package_week_265",
    amountEur: 265,
    nominalAmountCents: 26500,
    currency: "eur",
    kind: "package",
    paymentLinkUrl: "https://buy.stripe.com/00w14mbAi4Nh4Mu7Il1Fe05",
    descriptionKey: "weekStay",
    labels: {
      fr: {
        title: "Bon prestation (libellé site)",
        short: "265 € — séjour semaine (à valider)",
      },
      "nl-BE": {
        title: "Bon prestatie (sitenaanduiding)",
        short: "265 € — weekverblijf (te valideren)",
      },
    },
    commercialValidationStatus: "pending_validation",
    stripePriceIdEnvKey: "GIFT_CARD_STRIPE_PRICE_ID_265",
    stripePaymentLinkIdEnvKey: "GIFT_CARD_STRIPE_PAYMENT_LINK_ID_265",
  },
  {
    offerId: "package_weekend_315",
    amountEur: 315,
    nominalAmountCents: 31500,
    currency: "eur",
    kind: "package",
    paymentLinkUrl: "https://buy.stripe.com/28EeVcbAibbFbaS8Mp1Fe04",
    descriptionKey: "weekendStay",
    labels: {
      fr: {
        title: "Bon prestation (libellé site)",
        short: "315 € — séjour week-end (à valider)",
      },
      "nl-BE": {
        title: "Bon prestatie (sitenaanduiding)",
        short: "315 € — weekendverblijf (te valideren)",
      },
    },
    commercialValidationStatus: "pending_validation",
    stripePriceIdEnvKey: "GIFT_CARD_STRIPE_PRICE_ID_315",
    stripePaymentLinkIdEnvKey: "GIFT_CARD_STRIPE_PAYMENT_LINK_ID_315",
  },
];

export function getGiftCardPublicOptions(): GiftCardPublicOption[] {
  return GIFT_CARD_CATALOG.map(
    ({ offerId, amountEur, paymentLinkUrl, descriptionKey }) => ({
      offerId,
      amountEur,
      paymentLinkUrl,
      descriptionKey,
    })
  );
}

export function getOfferById(offerId: string): GiftCardOfferDefinition | undefined {
  return GIFT_CARD_CATALOG.find((o) => o.offerId === offerId);
}
