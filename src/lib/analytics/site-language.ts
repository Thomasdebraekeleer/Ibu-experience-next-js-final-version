import type { Locale } from "@/i18n/routing";

/** Langue analytique GA4 (distincte de la locale next-intl complète). */
export type AnalyticsSiteLanguage = "fr" | "nl";

export function toAnalyticsSiteLanguage(locale: Locale): AnalyticsSiteLanguage {
  return locale === "nl-BE" ? "nl" : "fr";
}
