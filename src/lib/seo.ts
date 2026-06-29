import { SITE_URL } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";

/** Chemins publics indexables (hors redirect racine). */
export const PUBLIC_PATHS = [
  "/accueil",
  "/a-propos",
  "/blog",
  "/contact",
  "/devenir-partenaire",
  "/domaine-de-mehaignoul",
  "/experiences",
  "/experiences/ibu-bien-etre",
  "/experiences/ibu-signature",
  "/faq",
  "/gift-card",
  "/reservations",
] as const;

export type PublicPath = (typeof PUBLIC_PATHS)[number];

export function getLocalizedPath(path: PublicPath, locale: Locale): string {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

export function getAbsoluteUrl(path: PublicPath, locale: Locale): string {
  return `${SITE_URL}${getLocalizedPath(path, locale)}`;
}

/** hreflang pour alternates.languages (inclut x-default → locale par défaut). */
export function buildAlternateLanguages(path: PublicPath): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = getAbsoluteUrl(path, loc);
  }
  languages["x-default"] = getAbsoluteUrl(path, routing.defaultLocale);
  return languages;
}

export function buildCanonicalPath(path: PublicPath, locale: string): string {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}
