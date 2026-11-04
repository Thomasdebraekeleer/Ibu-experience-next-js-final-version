import { AVAILABILITY_CACHE_TTL_MS } from "@/config/booking/limits";
import type { BookingCocon } from "@/config/booking/types";
import type { NormalizedDayRate } from "@/config/booking/types";
import { expandInclusivePeriod } from "@/lib/dates/ymd";
import { fetchAvailability, fetchRatesCalendar } from "@/server/lodgify/client";
import { getCached, setCached } from "@/server/lodgify/memory-cache";
import type {
  LodgifyCalendarItem,
  LodgifyPriceTier,
  LodgifyRatesCalendarPayload,
} from "@/server/lodgify/types";

import { aggregatePlaceRange } from "./aggregate-place";
import { extractPeriodsFromAvailabilityResponse } from "./parse-lodgify-availability";
import { normalizeLodgifyPeriods } from "./normalize-availability";
import {
  getRateSettingsForValidate,
  normalizeRatesCalendar,
} from "./normalize-rates";

export type CoconRateMeta = {
  advanceNoticeDays: number;
  advanceNoticeHours: number;
  checkInHour: number;
  pricesByDate: Map<string, LodgifyPriceTier[]>;
};

export type PlaceCalendarResult = {
  days: ReturnType<typeof aggregatePlaceRange>;
  ratesByCocon: Map<string, Map<string, NormalizedDayRate>>;
  bookableByCocon: Map<string, Map<string, boolean>>;
  rateMetaByCocon: Map<string, CoconRateMeta>;
};

function cacheKey(placeId: string, start: string, end: string, coconIds: string[]): string {
  return `avail:${placeId}:${start}:${end}:${coconIds.join(",")}`;
}

async function loadCoconAvailability(
  cocon: BookingCocon,
  start: string,
  end: string
): Promise<Map<string, boolean>> {
  const body = await fetchAvailability(
    cocon.lodgify.propertyId,
    cocon.lodgify.roomTypeId,
    start,
    end
  );
  const periods = extractPeriodsFromAvailabilityResponse(body);
  const { days } = normalizeLodgifyPeriods(periods, start, end);
  return days;
}

async function loadCoconRates(
  cocon: BookingCocon,
  start: string,
  end: string
): Promise<{
  rates: Map<string, NormalizedDayRate>;
  meta: CoconRateMeta;
}> {
  const body = (await fetchRatesCalendar(
    cocon.lodgify.propertyId,
    cocon.lodgify.roomTypeId,
    start,
    end
  )) as LodgifyRatesCalendarPayload;

  const rates = normalizeRatesCalendar(body.calendar_items ?? [], body.rate_settings);
  const pricesByDate = new Map<string, LodgifyPriceTier[]>();
  for (const item of (body.calendar_items ?? []) as LodgifyCalendarItem[]) {
    if (item.date && item.prices?.length) {
      pricesByDate.set(item.date, item.prices);
    }
  }

  const settings = getRateSettingsForValidate(body.rate_settings);
  return {
    rates,
    meta: {
      advanceNoticeDays: settings.advanceNoticeDays,
      advanceNoticeHours: settings.advanceNoticeHours,
      checkInHour: settings.checkInHour,
      pricesByDate,
    },
  };
}

export async function fetchPlaceCalendar(options: {
  placeId: string;
  cocons: BookingCocon[];
  start: string;
  end: string;
  useCache: boolean;
}): Promise<PlaceCalendarResult> {
  const coconIds = options.cocons.map((c) => c.id);
  const key = cacheKey(options.placeId, options.start, options.end, coconIds);

  if (options.useCache) {
    const hit = getCached<PlaceCalendarResult>(key);
    if (hit) return hit;
  }

  const bookableByCocon = new Map<string, Map<string, boolean>>();
  const ratesByCocon = new Map<string, Map<string, NormalizedDayRate>>();
  const metaMap = new Map<string, CoconRateMeta>();

  await Promise.all(
    options.cocons.map(async (cocon) => {
      const [dayMap, ratePack] = await Promise.all([
        loadCoconAvailability(cocon, options.start, options.end),
        loadCoconRates(cocon, options.start, options.end),
      ]);
      bookableByCocon.set(cocon.id, dayMap);
      ratesByCocon.set(cocon.id, ratePack.rates);
      metaMap.set(cocon.id, ratePack.meta);
    })
  );

  const dates = expandInclusivePeriod(options.start, options.end);
  const days = aggregatePlaceRange(dates, coconIds, bookableByCocon);

  const result: PlaceCalendarResult = {
    days,
    ratesByCocon,
    bookableByCocon,
    rateMetaByCocon: metaMap,
  };

  if (options.useCache) {
    setCached(key, result, AVAILABILITY_CACHE_TTL_MS);
  }

  return result;
}
