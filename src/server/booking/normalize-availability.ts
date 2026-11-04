import { compareYmd, expandInclusivePeriod, isValidYmd } from "@/lib/dates/ymd";
import type { LodgifyAvailabilityPeriod } from "@/server/lodgify/types";

export type CoconDayBookable = {
  date: string;
  bookable: boolean;
};

export type NormalizePeriodsResult = {
  days: Map<string, boolean>;
  gaps: string[];
  overlaps: string[];
};

function isPeriodBookable(period: LodgifyAvailabilityPeriod): boolean {
  return period.available > 0 && period.closed_period == null;
}

/**
 * Développe les périodes Lodgify (start/end inclusifs) en état jour par jour.
 * Détecte trous et chevauchements contradictoires dans [windowStart, windowEnd].
 */
export function normalizeLodgifyPeriods(
  periods: LodgifyAvailabilityPeriod[],
  windowStart: string,
  windowEnd: string
): NormalizePeriodsResult {
  const days = new Map<string, boolean>();
  const gaps: string[] = [];
  const overlaps: string[] = [];

  if (!isValidYmd(windowStart) || !isValidYmd(windowEnd)) {
    return { days, gaps, overlaps };
  }

  const windowDays = expandInclusivePeriod(windowStart, windowEnd);

  for (const period of periods) {
    if (!isValidYmd(period.start) || !isValidYmd(period.end)) continue;
    const bookable = isPeriodBookable(period);
    for (const date of expandInclusivePeriod(period.start, period.end)) {
      if (compareYmd(date, windowStart) < 0 || compareYmd(date, windowEnd) > 0) {
        continue;
      }
      if (days.has(date)) {
        const prev = days.get(date)!;
        if (prev !== bookable) overlaps.push(date);
        days.set(date, prev && bookable);
      } else {
        days.set(date, bookable);
      }
    }
  }

  for (const date of windowDays) {
    if (!days.has(date)) gaps.push(date);
    else if (!days.get(date)) {
      /* couvert mais indisponible — pas un trou */
    }
  }

  for (const date of windowDays) {
    if (!days.has(date)) days.set(date, false);
  }

  return { days, gaps, overlaps };
}

export function mapToCoconDayList(days: Map<string, boolean>, windowStart: string, windowEnd: string): CoconDayBookable[] {
  const list: CoconDayBookable[] = [];
  for (const date of expandInclusivePeriod(windowStart, windowEnd)) {
    list.push({ date, bookable: days.get(date) === true });
  }
  return list;
}
