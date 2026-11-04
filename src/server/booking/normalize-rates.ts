import type { NormalizedDayRate } from "@/config/booking/types";
import type { LodgifyCalendarItem, LodgifyPriceTier, LodgifyRateSettings } from "@/server/lodgify/types";

export function selectPriceTierForNights(
  prices: LodgifyPriceTier[],
  nights: number
): LodgifyPriceTier | null {
  const matches = prices.filter((p) => {
    const min = p.min_stay ?? 1;
    const max = p.max_stay ?? Number.MAX_SAFE_INTEGER;
    return nights >= min && nights <= max;
  });
  if (matches.length === 0) return null;
  return matches.reduce((best, p) => {
    const bestMin = best.min_stay ?? 1;
    const pMin = p.min_stay ?? 1;
    return pMin >= bestMin ? p : best;
  });
}

function summarizeDayPrices(
  prices: LodgifyPriceTier[],
  currencyCode: string
): NormalizedDayRate {
  const minStay = Math.min(...prices.map((p) => p.min_stay ?? 1));
  const maxStay = Math.max(...prices.map((p) => p.max_stay ?? 1));
  const tierForOneNight = selectPriceTierForNights(prices, 1);
  return {
    date: "",
    minStay,
    maxStay,
    indicativePricePerDay: tierForOneNight?.price_per_day ?? null,
    currencyCode,
  };
}

export function normalizeRatesCalendar(
  calendarItems: LodgifyCalendarItem[],
  rateSettings: LodgifyRateSettings | undefined
): Map<string, NormalizedDayRate> {
  const currencyCode = rateSettings?.currency_code ?? "EUR";
  const byDate = new Map<string, NormalizedDayRate>();

  for (const item of calendarItems) {
    if (!item.date || !item.prices?.length) continue;
    const summary = summarizeDayPrices(item.prices, currencyCode);
    byDate.set(item.date, { ...summary, date: item.date });
  }

  return byDate;
}

export function getRateSettingsForValidate(settings: LodgifyRateSettings | undefined) {
  return {
    advanceNoticeDays: settings?.advance_notice_days ?? 0,
    advanceNoticeHours: settings?.advance_notice_hours ?? 0,
    preparationTimeDays: settings?.preparation_time_days ?? 0,
    bookingWindowDays: settings?.booking_window_days ?? null,
    checkInHour: settings?.check_in_hour ?? 17,
    checkOutHour: settings?.check_out_hour ?? null,
    currencyCode: settings?.currency_code ?? "EUR",
  };
}
