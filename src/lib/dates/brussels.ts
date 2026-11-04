import { addDaysYmd } from "./ymd";

export function todayYmdBrussels(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function maxEndDateFromStart(start: string, maxDaysInclusive: number): string {
  return addDaysYmd(start, maxDaysInclusive - 1);
}
