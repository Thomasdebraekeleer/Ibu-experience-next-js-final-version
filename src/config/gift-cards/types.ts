export type GiftCardOfferId =
  | "credit_50"
  | "credit_100"
  | "package_week_265"
  | "package_weekend_315";

export type GiftCardOfferKind = "credit" | "package";

export type CommercialValidationStatus =
  | "validated"
  | "pending_validation"
  | "blocked";

export type GiftCardLocale = "fr" | "nl-BE";

export type GiftCardPublicOption = {
  offerId: GiftCardOfferId;
  amountEur: number;
  paymentLinkUrl: string;
  descriptionKey?: "weekStay" | "weekendStay";
};

export type GiftCardOfferDefinition = GiftCardPublicOption & {
  nominalAmountCents: number;
  currency: "eur";
  kind: GiftCardOfferKind;
  labels: Record<GiftCardLocale, { title: string; short: string }>;
  commercialValidationStatus: CommercialValidationStatus;
  stripePriceIdEnvKey: string;
  stripePaymentLinkIdEnvKey: string;
};

export const GIFT_CARD_DOCUMENT_TEMPLATE_VERSION = "canva-fr-en-v1";
export const GIFT_CARD_CONDITIONS_VERSION = "unvalidated-v1";
