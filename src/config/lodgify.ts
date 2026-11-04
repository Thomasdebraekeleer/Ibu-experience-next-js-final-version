import type { Locale } from "@/i18n/routing";

/**
 * Configuration Lodgify — source unique pour URLs et codes langue widgets.
 *
 * Règle : ne jamais inventer d’URL NL. Tant qu’une URL NL n’est pas confirmée
 * par le client/Lodgify, les locales nl-BE réutilisent les URLs FR documentées ci-dessous.
 *
 * @see I18N_REMAINING_PAGES_INVENTORY.md — section Lodgify (Lot 5B)
 */

/** URLs FR confirmées en production (audit Lot 5A/5B). */
export const LODGIFY_URLS_FR = {
  /** Page d’accueil Lodgify (CTA réservations bas de page). */
  siteRoot: "https://ibu-experience.lodgify.com/",
  /** Accueil — AvailabilitySearch (redirect avec query params). */
  allProperties: "https://ibu-experience.lodgify.com/fr/toutes-les-proprietes/",
  /** Domaine Mehaignoul — Cocon 1. */
  mehaignoulCocon1:
    "https://ibu-experience.lodgify.com/fr/ibu-experience---cocon-1---domaine-de-mehaignoul",
  /** Domaine Mehaignoul — Cocon 2. */
  mehaignoulCocon2:
    "https://ibu-experience.lodgify.com/fr/ibu-experience---cocon-2---domaine-de-mehaignoul",
  /** Legacy — LodgifySearchBar / page-test uniquement (mallen-jallow). */
  legacyPortableSearch: "https://mallen-jallow.lodgify.com/fr/toutes-les-proprietes",
} as const;

/**
 * URLs NL officielles — null tant que non confirmées par client/Lodgify.
 * Renseigner ici après validation ; les getters basculeront automatiquement pour nl-BE.
 */
export const LODGIFY_URLS_NL_PENDING = {
  /** Accueil — AvailabilitySearch (redirect avec query params). */
  allProperties: "https://ibu-experience.lodgify.com/nl/alle-eigenschappen/",
  /** Domaine Mehaignoul — Cocon 1. */
  mehaignoulCocon1:
    "https://ibu-experience.lodgify.com/nl/ibu-experience---cocon-1---domaine-de-mehaignoul",
  /** Domaine Mehaignoul — Cocon 2 (null → fallback FR pour nl-BE). */
  mehaignoulCocon2: null as string | null,
  legacyPortableSearch: null as string | null,
} as const;

export const LODGIFY_SCRIPTS = {
  portableSearchBar:
    "https://app.lodgify.com/portable-search-bar/stable/renderPortableSearchBar.js",
  bookNowBox: "https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js",
} as const;

export const LODGIFY_WIDGET_IDS = {
  websiteId: "607668",
  rentalId: "710587",
  slug: "mallen-jallow",
} as const;

/**
 * Code langue Lodgify (`data-language-code`).
 * Valeurs usuelles : fr, en, de, es, it, pt, nl (doc Lodgify widgets).
 *
 * nl-BE : `nl` dès que l’URL de recherche globale NL est confirmée.
 */
export function getLodgifyLanguageCode(locale: Locale): "fr" | "nl" {
  if (locale === "nl-BE" && LODGIFY_URLS_NL_PENDING.allProperties) {
    return "nl";
  }
  return "fr";
}

function resolveLodgifyUrl(locale: Locale, frUrl: string, nlUrl: string | null): string {
  if (locale === "nl-BE" && nlUrl) {
    return nlUrl;
  }
  return frUrl;
}

/** URL de recherche globale (AvailabilitySearch sur l’accueil). */
export function getLodgifyAllPropertiesSearchUrl(locale: Locale): string {
  return resolveLodgifyUrl(
    locale,
    LODGIFY_URLS_FR.allProperties,
    LODGIFY_URLS_NL_PENDING.allProperties
  );
}

/** URL réservation Cocon 1 — Domaine de Mehaignoul. */
export function getLodgifyMehaignoulCocon1Url(locale: Locale): string {
  return resolveLodgifyUrl(
    locale,
    LODGIFY_URLS_FR.mehaignoulCocon1,
    LODGIFY_URLS_NL_PENDING.mehaignoulCocon1
  );
}

/** URL réservation Cocon 2 — Domaine de Mehaignoul. */
export function getLodgifyMehaignoulCocon2Url(locale: Locale): string {
  return resolveLodgifyUrl(
    locale,
    LODGIFY_URLS_FR.mehaignoulCocon2,
    LODGIFY_URLS_NL_PENDING.mehaignoulCocon2
  );
}

/** URL portable search bar (composant test / legacy). */
export function getLodgifyLegacyPortableSearchUrl(locale: Locale): string {
  return resolveLodgifyUrl(
    locale,
    LODGIFY_URLS_FR.legacyPortableSearch,
    LODGIFY_URLS_NL_PENDING.legacyPortableSearch
  );
}

/** Indique si nl-BE utilise encore les URLs FR (état actuel Lot 5B). */
export function isLodgifyUsingFrenchUrlsForLocale(locale: Locale): boolean {
  if (locale === "fr") return true;
  return !LODGIFY_URLS_NL_PENDING.allProperties;
}
