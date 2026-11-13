import type { GiftCardLocale } from "@/config/gift-cards/types";

export type GiftCardDocumentLocale = "fr" | "en";

/** Parcours site fr → documents FR ; nl-BE → documents EN (PDF + e-mail). */
export function giftCardDocumentLocale(siteLocale: GiftCardLocale): GiftCardDocumentLocale {
  return siteLocale === "nl-BE" ? "en" : "fr";
}
