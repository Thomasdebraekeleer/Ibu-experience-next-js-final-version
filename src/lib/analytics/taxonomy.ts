/** Type de page pour le reporting. */
export type PageType =
  | "home"
  | "reservations"
  | "domain"
  | "experiences"
  | "experience_detail"
  | "about"
  | "contact"
  | "gift_card"
  | "partner"
  | "blog"
  | "faq"
  | "other";

export type DestinationType =
  | "internal"
  | "lodgify"
  | "email"
  | "phone"
  | "stripe"
  | "external";

/** Emplacements standardisés des boutons. */
export type ButtonLocation =
  | "header"
  | "hero"
  | "main_content"
  | "accommodation_card"
  | "booking_section"
  | "place_booking_card"
  | "hero_booking_search"
  | "availability_search"
  | "availability_search_hero"
  | "reservations_grid"
  | "reservations_cta"
  | "footer"
  | "mobile_menu"
  | "gift_card_page"
  | "unknown";

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;