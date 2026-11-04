export type PlaceCategory = "vignoble" | "chateau" | "domaine";
export type PlaceStatus = "active" | "coming-soon";
export type CoconStatus = "active" | "inactive";

export type BookingCocon = {
  id: string;
  status: CoconStatus;
  capacityAdults: number;
  lodgify: {
    propertyId: number;
    roomTypeId: number;
  };
  /** Référence vers les getters checkout dans src/config/lodgify.ts */
  checkoutUrlKey: "mehaignoulCocon1" | "mehaignoulCocon2";
};

export type BookingPlace = {
  id: string;
  slug: string;
  status: PlaceStatus;
  category: PlaceCategory;
  editorialPath: string;
  cocons: BookingCocon[];
};

export type DayAggregateStatus = "available" | "partial" | "unavailable";

export type PlaceDayAvailability = {
  date: string;
  availableCount: number;
  totalCount: number;
  availableCoconIds: string[];
  status: DayAggregateStatus;
};

export type NormalizedDayRate = {
  date: string;
  minStay: number;
  maxStay: number;
  indicativePricePerDay: number | null;
  currencyCode: string;
};

export type ValidateReason =
  | "invalid_place"
  | "invalid_cocon"
  | "invalid_date_format"
  | "invalid_date_range"
  | "arrival_in_past"
  | "departure_not_after_arrival"
  | "calendar_window_exceeded"
  | "stay_too_long"
  | "adults_exceed_capacity"
  | "dates_unavailable"
  | "min_stay_not_met"
  | "max_stay_exceeded"
  | "advance_notice_not_met"
  | "lodgify_error"
  | "quote_not_available"
  | "checkout_not_configured"
  | "invalid_request";
