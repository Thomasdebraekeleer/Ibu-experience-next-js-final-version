import { MAX_CALENDAR_WINDOW_DAYS, MAX_STAY_NIGHTS } from "@/config/booking/limits";

const YMD_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseYmd(ymd: string): { y: number; m: number; d: number } | null {
  const m = YMD_RE.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m: mo, d };
}

export function isValidYmd(ymd: string): boolean {
  return parseYmd(ymd) !== null;
}

export function compareYmd(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** Numéro de jour UTC (évite les boucles pour compter les jours). */
export function utcDayNumber(ymd: string): number | null {
  const p = parseYmd(ymd);
  if (!p) return null;
  return Math.floor(Date.UTC(p.y, p.m - 1, p.d) / 86_400_000);
}

export function addDaysYmd(ymd: string, days: number): string {
  const p = parseYmd(ymd);
  if (!p) throw new Error("invalid_ymd");
  const dt = new Date(Date.UTC(p.y, p.m - 1, p.d + days));
  return [
    dt.getUTCFullYear(),
    String(dt.getUTCMonth() + 1).padStart(2, "0"),
    String(dt.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

/** Nuits entre arrivée (incl.) et départ (excl.). */
export function countNights(arrival: string, departure: string): number {
  const a = utcDayNumber(arrival);
  const b = utcDayNumber(departure);
  if (a === null || b === null || b <= a) return 0;
  return b - a;
}

/** Jours inclusifs [start, end] — O(1). */
export function countDaysInclusive(start: string, end: string): number {
  const a = utcDayNumber(start);
  const b = utcDayNumber(end);
  if (a === null || b === null || b < a) return 0;
  return b - a + 1;
}

/** Jours inclusifs [start, end] — expansion uniquement si la plage est déjà bornée. */
export function expandInclusivePeriod(
  start: string,
  end: string,
  maxDaysInclusive: number = MAX_CALENDAR_WINDOW_DAYS
): string[] {
  const total = countDaysInclusive(start, end);
  if (total === 0 || total > maxDaysInclusive) return [];

  const days: string[] = new Array(total);
  let cursor = start;
  for (let i = 0; i < total; i += 1) {
    days[i] = cursor;
    if (i < total - 1) cursor = addDaysYmd(cursor, 1);
  }
  return days;
}

export function enumerateStayNights(arrival: string, departure: string): string[] {
  const nights = countNights(arrival, departure);
  if (nights <= 0 || nights > MAX_STAY_NIGHTS) return [];

  const list: string[] = new Array(nights);
  for (let i = 0; i < nights; i += 1) {
    list[i] = addDaysYmd(arrival, i);
  }
  return list;
}
