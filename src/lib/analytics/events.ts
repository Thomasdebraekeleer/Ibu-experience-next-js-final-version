import {
  getAccommodationByCoconId,
  getDomainForPath,
  resolveAccommodationFromLodgifyUrl,
  RESERVATIONS_LIST_ITEMS,
} from "./accommodations";
import { gtagCommand, trackGaEvent } from "./gtag";
import { readStoredConsent } from "./consent-storage";
import type { AnalyticsSiteLanguage } from "./site-language";
import { getPageType, normalizeAppPathname } from "./page-context";
import type { ButtonLocation, DestinationType, PageType } from "./taxonomy";

function canTrackAnalytics(): boolean {
  const stored = readStoredConsent();
  return Boolean(stored?.analytics);
}

function scrubParams(
  params: Record<string, string | number | boolean | undefined>
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

function baseContext(
  siteLanguage: AnalyticsSiteLanguage,
  pageType?: PageType
): Record<string, string | undefined> {
  return {
    site_language: siteLanguage,
    page_type: pageType,
  };
}

export function trackViewItem(pathname: string, siteLanguage: AnalyticsSiteLanguage): void {
  if (!canTrackAnalytics()) return;

  const domain = getDomainForPath(pathname);
  if (!domain) return;

  const pageType = getPageType(pathname);

  trackGaEvent(
    "view_item",
    scrubParams({
      ...baseContext(siteLanguage, pageType),
      item_id: domain.place_id,
      item_name: domain.place_name,
      accommodation_id: domain.place_id,
      accommodation_name: domain.place_name,
    })
  );
}

export function trackViewItemList(
  pathname: string,
  siteLanguage: AnalyticsSiteLanguage,
  listId: string
): void {
  if (!canTrackAnalytics()) return;

  const pageType = getPageType(pathname);

  gtagCommand("event", "view_item_list", {
    ...scrubParams({
      ...baseContext(siteLanguage, pageType),
      item_list_id: listId,
      item_list_name: listId,
    }),
    items: RESERVATIONS_LIST_ITEMS.map((item, index) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_category: item.item_category,
      index,
    })),
  });
}

export function trackSelectItem(options: {
  siteLanguage: AnalyticsSiteLanguage;
  pathname: string;
  itemId: string;
  itemName: string;
  buttonLocation: ButtonLocation | string;
}): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(
    "select_item",
    scrubParams({
      ...baseContext(siteLanguage, getPageType(options.pathname)),
      item_id: options.itemId,
      item_name: options.itemName,
      button_location: options.buttonLocation,
    })
  );
}

export type TrackBookingClickOptions = {
  href: string;
  siteLanguage: AnalyticsSiteLanguage;
  buttonLocation: ButtonLocation | string;
  pathname?: string;
  pageType?: PageType;
  ctaId?: string;
  coconId?: string;
};

export function trackBookingClick(options: TrackBookingClickOptions): void {
  if (!canTrackAnalytics()) return;

  const fromUrl = resolveAccommodationFromLodgifyUrl(options.href);
  const fromCocon = getAccommodationByCoconId(options.coconId);
  const accommodation = fromUrl ?? fromCocon;
  const pageType =
    options.pageType ??
    (options.pathname ? getPageType(options.pathname) : undefined);

  trackGaEvent(
    "booking_click",
    scrubParams({
      ...baseContext(options.siteLanguage, pageType),
      destination_type: "lodgify" satisfies DestinationType,
      button_location: options.buttonLocation,
      cta_id: options.ctaId,
      accommodation_id:
        accommodation?.accommodation_id ?? "lodgify_general",
      accommodation_name:
        accommodation?.accommodation_name ?? "Lodgify",
      place_id: fromCocon?.place_id ?? fromUrl?.place_id,
    })
  );
}

export function trackAvailabilitySearch(options: {
  siteLanguage: AnalyticsSiteLanguage;
  pathname: string;
  searchContext: string;
  stayNights?: number;
  accommodationId?: string;
}): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(
    "availability_search",
    scrubParams({
      ...baseContext(options.siteLanguage, getPageType(options.pathname)),
      search_context: options.searchContext,
      stay_nights: options.stayNights,
      accommodation_id: options.accommodationId,
      destination_type: "lodgify",
    })
  );
}

export function trackCtaClick(options: {
  siteLanguage: AnalyticsSiteLanguage;
  pathname: string;
  ctaId: string;
  buttonLocation: ButtonLocation | string;
  destinationType: DestinationType;
  destinationPath?: string;
}): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(
    "cta_click",
    scrubParams({
      ...baseContext(options.siteLanguage, getPageType(options.pathname)),
      cta_id: options.ctaId,
      button_location: options.buttonLocation,
      destination_type: options.destinationType,
      destination_path: options.destinationPath
        ? normalizeAppPathname(options.destinationPath)
        : undefined,
    })
  );
}

export function trackClickEmail(siteLanguage: AnalyticsSiteLanguage, pathname: string): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(
    "click_email",
    scrubParams({
      ...baseContext(siteLanguage, getPageType(pathname)),
      destination_type: "email",
    })
  );
}

export function trackClickPhone(siteLanguage: AnalyticsSiteLanguage, pathname: string): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(
    "click_phone",
    scrubParams({
      ...baseContext(siteLanguage, getPageType(pathname)),
      destination_type: "phone",
    })
  );
}

export function trackGiftCardClick(options: {
  siteLanguage: AnalyticsSiteLanguage;
  pathname: string;
  ctaId: string;
  giftCardType?: string;
  buttonLocation?: string;
}): void {
  if (!canTrackAnalytics()) return;

  trackGaEvent(
    "gift_card_click",
    scrubParams({
      ...baseContext(siteLanguage, getPageType(options.pathname)),
      cta_id: options.ctaId,
      gift_card_type: options.giftCardType,
      button_location: options.buttonLocation ?? "gift_card_page",
      destination_type: "stripe",
    })
  );
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
    pathname?: string;
  }
): void {
  if (!canTrackAnalytics()) return;

  const acc = getAccommodationByCoconId(options.coconId);

  trackGaEvent(
    eventName,
    scrubParams({
      ...baseContext(
        options.siteLanguage,
        options.pathname ? getPageType(options.pathname) : "domain"
      ),
      place_id: options.placeId,
      cocon_id: options.coconId,
      accommodation_id: acc?.accommodation_id,
      accommodation_name: acc?.accommodation_name,
      reason: options.reason,
      search_context: "place_booking_section",
    })
  );
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
    pathname?: string;
    stayNights?: number;
  }
): void {
  if (!canTrackAnalytics()) return;

  const acc = getAccommodationByCoconId(
    options.coconId && options.coconId !== "all" ? options.coconId : undefined
  );

  trackGaEvent(
    eventName,
    scrubParams({
      ...baseContext(
        options.siteLanguage,
        options.pathname ? getPageType(options.pathname) : "home"
      ),
      place_id: options.placeId,
      cocon_id: options.coconId,
      accommodation_id: acc?.accommodation_id,
      accommodation_name: acc?.accommodation_name,
      reason: options.reason,
      search_context: "hero_booking_search",
      stay_nights: options.stayNights,
    })
  );
}

export function trackLanguageChange(options: {
  from: AnalyticsSiteLanguage;
  to: AnalyticsSiteLanguage;
}): void {
  if (!canTrackAnalytics()) return;
  if (options.from === options.to) return;

  trackGaEvent(
    "language_change",
    scrubParams({
      site_language: options.to,
      previous_language: options.from,
    })
  );
}