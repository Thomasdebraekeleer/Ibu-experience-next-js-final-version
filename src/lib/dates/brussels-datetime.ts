import { parseYmd, utcDayNumber } from "./ymd";

type BrusselsParts = {
  ymd: string;
  hour: number;
  minute: number;
};

export function getBrusselsWallClock(now = new Date()): BrusselsParts {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const y = pick("year");
  const m = pick("month");
  const d = pick("day");
  return {
    ymd: `${y}-${m}-${d}`,
    hour: Number(pick("hour")),
    minute: Number(pick("minute")),
  };
}

/** Minutes restantes avant l’heure de check-in (Europe/Brussels) à la date d’arrivée. */
export function minutesUntilCheckInBrussels(
  arrivalYmd: string,
  checkInHour: number,
  now = new Date()
): number | null {
  if (!parseYmd(arrivalYmd)) return null;
  const clock = getBrusselsWallClock(now);
  const checkInMinutes = checkInHour * 60;
  const nowMinutes = clock.hour * 60 + clock.minute;

  const arrivalDay = arrivalYmd;
  if (arrivalDay < clock.ymd) return -1;
  if (arrivalDay > clock.ymd) {
    const a = utcDayNumber(arrivalDay);
    const b = utcDayNumber(clock.ymd);
    if (a === null || b === null) return null;
    const dayDiff = a - b;
    return dayDiff * 24 * 60 + (checkInMinutes - nowMinutes);
  }
  return checkInMinutes - nowMinutes;
}
