/** Identifiant de mesure GA4 (surcharge possible via variable d'environnement). */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-PR8420NGC1";

export const CONSENT_STORAGE_KEY = "ibu-consent-preferences-v1";

export const CONSENT_UPDATED_EVENT = "ibu-consent-updated";
