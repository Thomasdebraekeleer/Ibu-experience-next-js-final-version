import type { BookingCocon } from "@/config/booking/types";
import type { ValidateReason } from "@/config/booking/types";
import { minutesUntilCheckInBrussels } from "@/lib/dates/brussels-datetime";
import { addDaysYmd, compareYmd, countNights, enumerateStayNights } from "@/lib/dates/ymd";
import type { NormalizedDayRate } from "@/config/booking/types";
import { selectPriceTierForNights } from "./normalize-rates";
import type { CoconRateMeta } from "./fetch-place-calendar";

export type StayValidationInput = {
  arrival: string;
  departure: string;
  adults: number;
  cocons: BookingCocon[];
  bookableByCocon: Map<string, Map<string, boolean>>;
  ratesByCocon: Map<string, Map<string, NormalizedDayRate>>;
  rateMetaByCocon: Map<string, CoconRateMeta>;
};

export type StayValidationResult = {
  valid: boolean;
  availableCoconIds: string[];
  reason: ValidateReason | null;
  constraints: {
    nights: number;
    minStay?: number;
    maxStay?: number;
    currencyCode?: string;
  };
};

export function meetsAdvanceNotice(
  arrival: string,
  meta: Pick<CoconRateMeta, "advanceNoticeDays" | "advanceNoticeHours" | "checkInHour">,
  now: Date = new Date()
): boolean {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  if (meta.advanceNoticeDays > 0) {
    const earliest = addDaysYmd(today, meta.advanceNoticeDays);
    if (compareYmd(arrival, earliest) < 0) return false;
  }

  if (meta.advanceNoticeHours > 0) {
    const minutes = minutesUntilCheckInBrussels(arrival, meta.checkInHour, now);
    if (minutes === null || minutes < meta.advanceNoticeHours * 60) {
      return false;
    }
  }

  return true;
}

function hasArrivalPricing(
  coconId: string,
  arrival: string,
  nights: number,
  input: StayValidationInput
): { ok: boolean; minStay?: number; maxStay?: number; currencyCode?: string } {
  const meta = input.rateMetaByCocon.get(coconId);
  const arrivalRates = input.ratesByCocon.get(coconId)?.get(arrival);
  const prices = meta?.pricesByDate.get(arrival);

  if (prices?.length) {
    const tier = selectPriceTierForNights(prices, nights);
    if (!tier) return { ok: false };
    return {
      ok: true,
      minStay: tier.min_stay,
      maxStay: tier.max_stay,
      currencyCode: arrivalRates?.currencyCode,
    };
  }

  if (arrivalRates) {
    if (nights < arrivalRates.minStay || nights > arrivalRates.maxStay) {
      return { ok: false, minStay: arrivalRates.minStay, maxStay: arrivalRates.maxStay };
    }
    return {
      ok: true,
      minStay: arrivalRates.minStay,
      maxStay: arrivalRates.maxStay,
      currencyCode: arrivalRates.currencyCode,
    };
  }

  return { ok: false };
}

export function evaluateCoconStay(
  cocon: BookingCocon,
  input: StayValidationInput
): { eligible: boolean; failReason?: ValidateReason } {
  if (input.adults > cocon.capacityAdults) {
    return { eligible: false, failReason: "adults_exceed_capacity" };
  }

  const dayMap = input.bookableByCocon.get(cocon.id);
  if (!dayMap) return { eligible: false, failReason: "dates_unavailable" };

  const stayNights = enumerateStayNights(input.arrival, input.departure);
  for (const night of stayNights) {
    if (dayMap.get(night) !== true) {
      return { eligible: false, failReason: "dates_unavailable" };
    }
  }

  const meta = input.rateMetaByCocon.get(cocon.id);
  if (meta && !meetsAdvanceNotice(input.arrival, meta)) {
    return { eligible: false, failReason: "advance_notice_not_met" };
  }

  const nights = countNights(input.arrival, input.departure);
  const pricing = hasArrivalPricing(cocon.id, input.arrival, nights, input);
  if (!pricing.ok) {
    if (meta?.pricesByDate.get(input.arrival)?.length) {
      return { eligible: false, failReason: "min_stay_not_met" };
    }
    const arrivalRates = input.ratesByCocon.get(cocon.id)?.get(input.arrival);
    if (arrivalRates && nights > arrivalRates.maxStay) {
      return { eligible: false, failReason: "max_stay_exceeded" };
    }
    return { eligible: false, failReason: "dates_unavailable" };
  }

  return { eligible: true };
}

export function validateStay(input: StayValidationInput): StayValidationResult {
  const nights = countNights(input.arrival, input.departure);
  const availableCoconIds: string[] = [];
  const failReasons: ValidateReason[] = [];

  for (const cocon of input.cocons) {
    const result = evaluateCoconStay(cocon, input);
    if (result.eligible) {
      availableCoconIds.push(cocon.id);
    } else if (result.failReason) {
      failReasons.push(result.failReason);
    }
  }

  if (availableCoconIds.length === 0) {
    const reason = failReasons[0] ?? "dates_unavailable";
    const first = input.cocons[0];
    const arrivalRates = first
      ? input.ratesByCocon.get(first.id)?.get(input.arrival)
      : undefined;
    return {
      valid: false,
      availableCoconIds: [],
      reason,
      constraints: {
        nights,
        minStay: arrivalRates?.minStay,
        maxStay: arrivalRates?.maxStay,
        currencyCode: arrivalRates?.currencyCode,
      },
    };
  }

  const refCocon = input.cocons.find((c) => c.id === availableCoconIds[0])!;
  const pricing = hasArrivalPricing(refCocon.id, input.arrival, nights, input);

  return {
    valid: true,
    availableCoconIds,
    reason: null,
    constraints: {
      nights,
      minStay: pricing.minStay,
      maxStay: pricing.maxStay,
      currencyCode: pricing.currencyCode,
    },
  };
}
