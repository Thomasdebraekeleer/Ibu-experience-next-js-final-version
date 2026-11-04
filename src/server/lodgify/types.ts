/** Réponse Lodgify availability (champs utilisés côté serveur uniquement). */
export type LodgifyAvailabilityPeriod = {
  start: string;
  end: string;
  available: number;
  closed_period: { id: number } | null;
};

export type LodgifyAvailabilityPayload = {
  property_id?: number;
  room_type_id?: number;
  periods?: LodgifyAvailabilityPeriod[];
};

export type LodgifyPriceTier = {
  min_stay?: number;
  max_stay?: number;
  price_per_day?: number;
  price_per_additional_guest?: number;
  additional_guests_starts_from?: number;
};

export type LodgifyCalendarItem = {
  date: string;
  is_default?: boolean;
  prices?: LodgifyPriceTier[];
};

export type LodgifyRateSettings = {
  bookability?: number;
  check_in_hour?: number;
  check_out_hour?: number;
  booking_window_days?: number;
  advance_notice_days?: number;
  advance_notice_hours?: number;
  preparation_time_days?: number;
  currency_code?: string;
  vat?: number;
  fees?: unknown[];
  taxes?: unknown[];
  promotions?: unknown[];
};

export type LodgifyRatesCalendarPayload = {
  calendar_items?: LodgifyCalendarItem[];
  rate_settings?: LodgifyRateSettings;
};

export class LodgifyApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly path: string
  ) {
    super(message);
    this.name = "LodgifyApiError";
  }
}
