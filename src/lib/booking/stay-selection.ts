import type { PublicCoconFilter } from "@/config/booking/public-places";
import { MAX_STAY_NIGHTS } from "@/config/booking/limits";
import {
  addDaysYmd,
  compareYmd,
  countNights,
  enumerateStayNights,
} from "@/lib/dates/ymd";
import type { AvailabilityDay, DayRate } from "./types";

export type DayIndex = Map<string, AvailabilityDay>;

export function buildDayIndex(days: AvailabilityDay[]): DayIndex {
  return new Map(days.map((d) => [d.date, d]));
}

export function intersectCoconIdsAcrossNights(
  nightDates: string[],
  dayIndex: DayIndex
): string[] {
  if (nightDates.length === 0) return [];
  let intersection: string[] | null = null;

  for (const date of nightDates) {
    const day = dayIndex.get(date);
    if (!day?.availableCoconIds.length) return [];
    if (intersection === null) {
      intersection = [...day.availableCoconIds];
    } else {
      const allowed = new Set(day.availableCoconIds);
      intersection = intersection.filter((id) => allowed.has(id));
    }
    if (intersection.length === 0) return [];
  }

  return intersection ?? [];
}

export function filterCoconsByCapacity(
  coconIds: string[],
  adults: number,
  capacityByCocon: Map<string, number>
): string[] {
  return coconIds.filter((id) => adults <= (capacityByCocon.get(id) ?? 0));
}

export function filterCoconsByCoconChoice(
  coconIds: string[],
  filter: PublicCoconFilter
): string[] {
  if (filter === "all") return coconIds;
  return coconIds.filter((id) => id === filter);
}

function rateTierAllowsStay(
  rates: DayRate[] | undefined,
  arrival: string,
  nights: number
): boolean {
  if (!rates?.length) return false;
  const arrivalRate = rates.find((r) => r.date === arrival);
  if (!arrivalRate) return false;
  return nights >= arrivalRate.minStay && nights <= arrivalRate.maxStay;
}

export function filterCoconsByRateRules(
  coconIds: string[],
  arrival: string,
  nights: number,
  ratesByCocon: Record<string, DayRate[]>
): string[] {
  return coconIds.filter((id) =>
    rateTierAllowsStay(ratesByCocon[id], arrival, nights)
  );
}

/** Cocons pouvant couvrir tout le séjour (même id chaque nuit). */
export function coconsEligibleForStay(options: {
  arrival: string;
  departure: string;
  adults: number;
  coconFilter: PublicCoconFilter;
  dayIndex: DayIndex;
  ratesByCocon: Record<string, DayRate[]>;
  capacityByCocon: Map<string, number>;
}): string[] {
  const nights = countNights(options.arrival, options.departure);
  if (nights <= 0 || nights > MAX_STAY_NIGHTS) return [];

  const nightDates = enumerateStayNights(options.arrival, options.departure);
  let ids = intersectCoconIdsAcrossNights(nightDates, options.dayIndex);
  ids = filterCoconsByCoconChoice(ids, options.coconFilter);
  ids = filterCoconsByCapacity(ids, options.adults, options.capacityByCocon);
  ids = filterCoconsByRateRules(
    ids,
    options.arrival,
    nights,
    options.ratesByCocon
  );
  return ids;
}

export function isStayRangeValid(options: {
  arrival: string;
  departure: string;
  adults: number;
  coconFilter: PublicCoconFilter;
  dayIndex: DayIndex;
  ratesByCocon: Record<string, DayRate[]>;
  capacityByCocon: Map<string, number>;
}): boolean {
  return coconsEligibleForStay(options).length > 0;
}

export function dayAggregateVisual(
  day: AvailabilityDay | undefined,
  coconFilter: PublicCoconFilter
): "available" | "partial" | "unavailable" | "unknown" {
  if (!day) return "unknown";
  if (coconFilter === "all") {
    if (day.status === "available") return "available";
    if (day.status === "partial") return "partial";
    return "unavailable";
  }
  return day.availableCoconIds.includes(coconFilter) ? "available" : "unavailable";
}

export function isArrivalSelectable(
  date: string,
  today: string,
  coconFilter: PublicCoconFilter,
  dayIndex: DayIndex
): boolean {
  if (compareYmd(date, today) < 0) return false;
  const visual = dayAggregateVisual(dayIndex.get(date), coconFilter);
  return visual === "available" || visual === "partial";
}

export function isDepartureSelectable(
  arrival: string,
  departure: string,
  options: {
    adults: number;
    coconFilter: PublicCoconFilter;
    dayIndex: DayIndex;
    ratesByCocon: Record<string, DayRate[]>;
    capacityByCocon: Map<string, number>;
  }
): boolean {
  if (compareYmd(departure, arrival) <= 0) return false;
  const nights = countNights(arrival, departure);
  if (nights <= 0 || nights > MAX_STAY_NIGHTS) return false;

  const nightDates = enumerateStayNights(arrival, departure);
  for (const night of nightDates) {
    const visual = dayAggregateVisual(options.dayIndex.get(night), options.coconFilter);
    if (visual === "unavailable") return false;
  }

  return isStayRangeValid({
    arrival,
    departure,
    adults: options.adults,
    coconFilter: options.coconFilter,
    dayIndex: options.dayIndex,
    ratesByCocon: options.ratesByCocon,
    capacityByCocon: options.capacityByCocon,
  });
}

/** Si le séjour actuel n’est plus valide après changement de cocon, le vider. */
export function shouldClearDatesOnCoconChange(
  arrival: string | null,
  departure: string | null,
  adults: number,
  newFilter: PublicCoconFilter,
  dayIndex: DayIndex,
  ratesByCocon: Record<string, DayRate[]>,
  capacityByCocon: Map<string, number>
): boolean {
  if (!arrival || !departure) return false;
  return !isStayRangeValid({
    arrival,
    departure,
    adults,
    coconFilter: newFilter,
    dayIndex,
    ratesByCocon,
    capacityByCocon,
  });
}

export function minStayHintForArrival(
  arrival: string,
  coconFilter: PublicCoconFilter,
  ratesByCocon: Record<string, DayRate[]>,
  eligibleCoconIds: string[]
): number | null {
  const ids =
    coconFilter === "all"
      ? eligibleCoconIds
      : eligibleCoconIds.filter((id) => id === coconFilter);
  if (!ids.length) return null;

  let min: number | null = null;
  for (const id of ids) {
    const rate = ratesByCocon[id]?.find((r) => r.date === arrival);
    if (!rate) continue;
    min = min === null ? rate.minStay : Math.min(min, rate.minStay);
  }
  return min;
}

export function splitFetchWindow(
  start: string,
  end: string,
  maxDaysInclusive: number
): { start: string; end: string }[] {
  const chunks: { start: string; end: string }[] = [];
  let cursor = start;
  while (compareYmd(cursor, end) <= 0) {
    let chunkEnd = end;
    const spanEnd = addDaysYmd(cursor, maxDaysInclusive - 1);
    if (compareYmd(chunkEnd, spanEnd) > 0) chunkEnd = spanEnd;
    chunks.push({ start: cursor, end: chunkEnd });
    if (compareYmd(chunkEnd, end) >= 0) break;
    cursor = addDaysYmd(chunkEnd, 1);
  }
  return chunks;
}
