import { getAccommodationForPath, resolveAccommodationFromLodgifyUrl } from "./accommodations";
import { trackGaEvent } from "./gtag";
import { readStoredConsent } from "./consent-storage";
import type { AnalyticsSiteLanguage } from "./site-language";

function canTrackAnalytics(): boolean {
  const stored = readStoredConsent();
  return Boolean(stored?.analytics);
}

export function trackViewItem(pathname: string, siteLanguage: AnalyticsSiteLanguage): void {
  if (!canTrackAnalytics()) return;

  const item = getAccommodationForPath(pathname);
  if (!item) return;

  trackGaEvent("view_item", {
    item_id: item.accommodation_id,
    item_name: item.accommodation_name,
    site_language: siteLanguage,
  });
}

export function trackBookingClick(options: {
  href: string;
  siteLanguage: AnalyticsSiteLanguage;
  buttonLocation: string;
}): void {
  if (!canTrackAnalytics()) return;

  const fromUrl = resolveAccommodationFromLodgifyUrl(options.href);
  trackGaEvent("booking_click", {
    accommodation_id: fromUrl?.accommodation_id ?? "lodgify_general",
    accommodation_name: fromUrl?.accommodation_name ?? "Lodgify",
    site_language: options.siteLanguage,
    button_location: options.buttonLocation,
    link_url: options.href.split("?")[0],
  });
}

export function trackGenerateLead(siteLanguage: AnalyticsSiteLanguage): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent("generate_lead", {
    site_language: siteLanguage,
    lead_type: "contact_mailto",
  });
}

export function trackPlaceBookingEvent(
  eventName:
    | "place_booking_search"
    | "place_booking_gallery_open"
    | "place_booking_reserve_modal"
    | "place_booking_choose"
    | "place_booking_checkout",
  options: {
    siteLanguage: AnalyticsSiteLanguage;
    placeId: string;
    coconId?: string;
    reason?: string;
  }
): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(eventName, {
    site_language: options.siteLanguage,
    place_id: options.placeId,
    cocon_id: options.coconId ?? undefined,
    reason: options.reason ?? undefined,
  });
}

export function trackBookingSearchEvent(
  eventName:
    | "booking_search_open"
    | "booking_search_place"
    | "booking_search_cocon"
    | "booking_search_submit"
    | "booking_search_validated"
    | "booking_search_rejected"
    | "booking_search_checkout_choice",
  options: {
    siteLanguage: AnalyticsSiteLanguage;
    placeId?: string;
    coconId?: string;
    reason?: string;
  }
): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(eventName, {
    site_language: options.siteLanguage,
    place_id: options.placeId ?? undefined,
    cocon_id: options.coconId ?? undefined,
    reason: options.reason ?? undefined,
  });
}

export function trackLanguageChange(options: {
  from: AnalyticsSiteLanguage;
  to: AnalyticsSiteLanguage;
}): void {
  if (!canTrackAnalytics()) return;
  if (options.from === options.to) return;

  trackGaEvent("language_change", {
    site_language: options.to,
    previous_language: options.from,
  });
}
