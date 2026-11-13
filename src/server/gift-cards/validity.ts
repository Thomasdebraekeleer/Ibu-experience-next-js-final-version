export const GIFT_CARD_VALIDITY_RULE_VERSION = "paid-plus-12-calendar-months-brussels-v1";
export const GIFT_CARD_TIMEZONE = "Europe/Brussels";

type BrusselsYmd = { year: number; month: number; day: number };

function brusselsYmd(instant: Date): BrusselsYmd {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: GIFT_CARD_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = formatter.format(instant).split("-").map(Number);
  return { year, month, day };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Ajoute 12 mois calendaires (règle 29 fév. → dernier jour de février l’année suivante). */
export function expiryCalendarDateFromPaid(paidYmd: BrusselsYmd): BrusselsYmd {
  const targetYear = paidYmd.year + 1;
  const targetMonth = paidYmd.month;
  let day = paidYmd.day;

  if (paidYmd.month === 2 && paidYmd.day === 29) {
    day = isLeapYear(targetYear) ? 29 : 28;
  } else {
    const maxDay = daysInMonth(targetYear, targetMonth);
    day = Math.min(day, maxDay);
  }

  return { year: targetYear, month: targetMonth, day };
}

function compareYmd(a: BrusselsYmd, b: BrusselsYmd): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

/** Dernier instant UTC encore dans la date civile `ymd` à Bruxelles. */
function instantEndOfBrusselsDay(ymd: BrusselsYmd): Date {
  let low = Date.UTC(ymd.year, ymd.month - 1, ymd.day - 1, 0, 0, 0, 0);
  let high = Date.UTC(ymd.year, ymd.month - 1, ymd.day + 2, 0, 0, 0, 0);

  while (high - low > 1) {
    const mid = low + Math.floor((high - low) / 2);
    const ymdAtMid = brusselsYmd(new Date(mid));
    if (compareYmd(ymdAtMid, ymd) <= 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return new Date(low);
}

export function computeGiftCardExpiresAt(paidAt: Date): Date {
  const paidYmd = brusselsYmd(paidAt);
  const expiryYmd = expiryCalendarDateFromPaid(paidYmd);
  return instantEndOfBrusselsDay(expiryYmd);
}

export function isGiftCardExpired(
  expiresAt: Date,
  now: Date = new Date()
): boolean {
  return now.getTime() > expiresAt.getTime();
}

export function formatGiftCardDate(
  instant: Date,
  documentLocale: "fr" | "en"
): string {
  const intlLocale = documentLocale === "en" ? "en-GB" : "fr-BE";
  return new Intl.DateTimeFormat(intlLocale, {
    timeZone: GIFT_CARD_TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(instant);
}

export type GiftCardUsability =
  | { ok: true }
  | { ok: false; reason: "expired" | "inactive" };

/** Contrôle d’utilisation du bon (pas seulement l’affichage). */
export function checkGiftCardUsability(
  input: { cardStatus: string; expiresAt: Date | null },
  at: Date = new Date()
): GiftCardUsability {
  if (input.cardStatus !== "active") {
    return { ok: false, reason: "inactive" };
  }
  if (input.expiresAt && isGiftCardExpired(input.expiresAt, at)) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true };
}

export function formatValiditySentence(
  paidAt: Date,
  expiresAt: Date,
  documentLocale: "fr" | "en"
): string {
  const purchase = formatGiftCardDate(paidAt, documentLocale);
  const expiry = formatGiftCardDate(expiresAt, documentLocale);
  if (documentLocale === "en") {
    return `Valid for 12 months from ${purchase}, until ${expiry}`;
  }
  return `Valable 12 mois à compter du ${purchase}, jusqu’au ${expiry}`;
}
