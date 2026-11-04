import { MAX_CALENDAR_WINDOW_DAYS } from "@/config/booking/limits";
import type { PublicCoconFilter } from "@/config/booking/public-places";
import type { AvailabilityDay, DayRate, AvailabilityResponse } from "./types";
import { splitFetchWindow } from "./stay-selection";
import { compareYmd, addDaysYmd } from "@/lib/dates/ymd";

export type AvailabilityCache = {
  days: Map<string, AvailabilityDay>;
  ratesByCocon: Record<string, Map<string, DayRate>>;
};

export function createAvailabilityCache(): AvailabilityCache {
  return { days: new Map(), ratesByCocon: {} };
}

export function mergeAvailabilityIntoCache(
  cache: AvailabilityCache,
  response: Extract<AvailabilityResponse, { ok: true }>
): void {
  for (const d of response.days) {
    cache.days.set(d.date, d);
  }
  for (const [coconId, rates] of Object.entries(response.ratesByCocon)) {
    if (!cache.ratesByCocon[coconId]) {
      cache.ratesByCocon[coconId] = new Map();
    }
    for (const rate of rates) {
      cache.ratesByCocon[coconId]!.set(rate.date, rate);
    }
  }
}

export function cacheToRatesRecord(cache: AvailabilityCache): Record<string, DayRate[]> {
  const out: Record<string, DayRate[]> = {};
  for (const [coconId, map] of Object.entries(cache.ratesByCocon)) {
    out[coconId] = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }
  return out;
}

export async function fetchAvailabilityRange(options: {
  placeId: string;
  start: string;
  end: string;
  coconId: PublicCoconFilter;
  signal?: AbortSignal;
}): Promise<AvailabilityResponse> {
  const coconParam = options.coconId === "all" ? "all" : options.coconId;
  const url = new URL("/api/booking/availability", window.location.origin);
  url.searchParams.set("placeId", options.placeId);
  url.searchParams.set("start", options.start);
  url.searchParams.set("end", options.end);
  url.searchParams.set("coconId", coconParam);

  const res = await fetch(url.toString(), { signal: options.signal, cache: "no-store" });
  return (await res.json()) as AvailabilityResponse;
}

export async function fetchAvailabilitySpan(
  options: {
    placeId: string;
    start: string;
    end: string;
    coconId: PublicCoconFilter;
    signal?: AbortSignal;
  },
  cache: AvailabilityCache
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const chunks = splitFetchWindow(
    options.start,
    options.end,
    MAX_CALENDAR_WINDOW_DAYS
  );

  for (const chunk of chunks) {
    const missing = !chunkFullyCached(cache, chunk.start, chunk.end);
    if (!missing) continue;

    const data = await fetchAvailabilityRange({
      ...options,
      start: chunk.start,
      end: chunk.end,
    });
    if (!data.ok) return { ok: false, reason: data.reason };
    mergeAvailabilityIntoCache(cache, data);
  }

  return { ok: true };
}

function chunkFullyCached(
  cache: AvailabilityCache,
  start: string,
  end: string
): boolean {
  const chunks = splitFetchWindow(start, end, MAX_CALENDAR_WINDOW_DAYS);
  for (const c of chunks) {
    let cursor = c.start;
    while (compareYmd(cursor, c.end) <= 0) {
      if (!cache.days.has(cursor)) return false;
      cursor = addDaysYmd(cursor, 1);
    }
  }
  return true;
}
