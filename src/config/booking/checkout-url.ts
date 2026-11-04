import type { Locale } from "@/i18n/routing";
import {
  getLodgifyMehaignoulCocon1Url,
  getLodgifyMehaignoulCocon2Url,
} from "@/config/lodgify";
import type { BookingCocon } from "./types";
import type { ValidateReason } from "./types";
import { isAllowedCheckoutUrl } from "./checkout-domains";

export function getCoconCheckoutBaseUrl(cocon: BookingCocon, locale: Locale): string {
  switch (cocon.checkoutUrlKey) {
    case "mehaignoulCocon1":
      return getLodgifyMehaignoulCocon1Url(locale);
    case "mehaignoulCocon2":
      return getLodgifyMehaignoulCocon2Url(locale);
    default: {
      const _exhaustive: never = cocon.checkoutUrlKey;
      return _exhaustive;
    }
  }
}

export function buildLodgifyCheckoutUrl(
  baseUrl: string,
  params: { arrival: string; departure: string; adults: number }
): string {
  const search = new URLSearchParams({
    arrival: params.arrival,
    departure: params.departure,
    adults: String(params.adults),
    children: "0",
    infants: "0",
    pets: "0",
  });
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${search.toString()}`;
}

export type CheckoutResolution =
  | { ok: true; url: string }
  | { ok: false; reason: Extract<ValidateReason, "checkout_not_configured"> };

export function resolveCoconCheckoutUrl(
  cocon: BookingCocon,
  locale: Locale,
  params: { arrival: string; departure: string; adults: number }
): CheckoutResolution {
  const base = getCoconCheckoutBaseUrl(cocon, locale);
  if (!isAllowedCheckoutUrl(base)) {
    return { ok: false, reason: "checkout_not_configured" };
  }
  return { ok: true, url: buildLodgifyCheckoutUrl(base, params) };
}
