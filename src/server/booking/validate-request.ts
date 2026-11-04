import { MAX_CALENDAR_WINDOW_DAYS, MAX_STAY_NIGHTS } from "@/config/booking/limits";
import { getBookablePlace, isKnownCoconId, resolvePlaceCocons } from "@/config/booking/places";
import type { ValidateReason } from "@/config/booking/types";
import { todayYmdBrussels } from "@/lib/dates/brussels";
import {
  compareYmd,
  countDaysInclusive,
  countNights,
  isValidYmd,
} from "@/lib/dates/ymd";
import type { BookingCocon, BookingPlace } from "@/config/booking/types";

export type ParsedAvailabilityQuery =
  | { ok: true; place: BookingPlace; cocons: BookingCocon[]; start: string; end: string }
  | { ok: false; reason: ValidateReason };

function normalizeCoconFilter(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "all") return null;
  return trimmed;
}

export function parseAvailabilityQuery(params: {
  placeId: string | null;
  start: string | null;
  end: string | null;
  coconId?: string | null;
}): ParsedAvailabilityQuery {
  if (!params.placeId || !params.start || !params.end) {
    return { ok: false, reason: "invalid_request" };
  }

  const place = getBookablePlace(params.placeId);
  if (!place) return { ok: false, reason: "invalid_place" };

  if (!isValidYmd(params.start) || !isValidYmd(params.end)) {
    return { ok: false, reason: "invalid_date_format" };
  }

  if (compareYmd(params.start, params.end) > 0) {
    return { ok: false, reason: "invalid_date_range" };
  }

  const today = todayYmdBrussels();
  if (compareYmd(params.start, today) < 0) {
    return { ok: false, reason: "arrival_in_past" };
  }

  const span = countDaysInclusive(params.start, params.end);
  if (span === 0 || span > MAX_CALENDAR_WINDOW_DAYS) {
    return { ok: false, reason: "calendar_window_exceeded" };
  }

  const coconFilter = normalizeCoconFilter(params.coconId);
  if (coconFilter) {
    if (!isKnownCoconId(place, coconFilter)) {
      return { ok: false, reason: "invalid_cocon" };
    }
    const cocons = resolvePlaceCocons(place, coconFilter);
    if (cocons.length === 0) return { ok: false, reason: "invalid_cocon" };
    return { ok: true, place, cocons, start: params.start, end: params.end };
  }

  const cocons = resolvePlaceCocons(place, null);
  return { ok: true, place, cocons, start: params.start, end: params.end };
}

export type ParsedValidateBody =
  | {
      ok: true;
      place: BookingPlace;
      cocons: BookingCocon[];
      arrival: string;
      departure: string;
      adults: number;
      coconScope: "all" | "single";
    }
  | { ok: false; reason: ValidateReason };

export function parseValidateBody(body: unknown): ParsedValidateBody {
  if (!body || typeof body !== "object") {
    return { ok: false, reason: "invalid_request" };
  }

  const b = body as Record<string, unknown>;
  const placeId = typeof b.placeId === "string" ? b.placeId : "";
  const coconIdRaw = b.coconId;
  const arrival = typeof b.arrival === "string" ? b.arrival : "";
  const departure = typeof b.departure === "string" ? b.departure : "";
  const adults = typeof b.adults === "number" ? b.adults : Number(b.adults);

  const place = getBookablePlace(placeId);
  if (!place) return { ok: false, reason: "invalid_place" };

  const coconFilter = normalizeCoconFilter(
    typeof coconIdRaw === "string" ? coconIdRaw : coconIdRaw == null ? null : String(coconIdRaw)
  );

  if (coconFilter && !isKnownCoconId(place, coconFilter)) {
    return { ok: false, reason: "invalid_cocon" };
  }

  if (!isValidYmd(arrival) || !isValidYmd(departure)) {
    return { ok: false, reason: "invalid_date_format" };
  }

  if (compareYmd(departure, arrival) <= 0) {
    return { ok: false, reason: "departure_not_after_arrival" };
  }

  const today = todayYmdBrussels();
  if (compareYmd(arrival, today) < 0) {
    return { ok: false, reason: "arrival_in_past" };
  }

  const nights = countNights(arrival, departure);
  if (nights === 0 || nights > MAX_STAY_NIGHTS) {
    return { ok: false, reason: nights === 0 ? "invalid_date_range" : "stay_too_long" };
  }

  if (!Number.isFinite(adults) || adults < 1 || !Number.isInteger(adults)) {
    return { ok: false, reason: "invalid_request" };
  }

  const cocons = resolvePlaceCocons(place, coconFilter);
  if (cocons.length === 0) return { ok: false, reason: "invalid_cocon" };

  if (coconFilter) {
    const cocon = cocons[0];
    if (adults > cocon.capacityAdults) {
      return { ok: false, reason: "adults_exceed_capacity" };
    }
  }

  const span = countDaysInclusive(arrival, departure);
  if (span === 0 || span > MAX_CALENDAR_WINDOW_DAYS) {
    return { ok: false, reason: "calendar_window_exceeded" };
  }

  return {
    ok: true,
    place,
    cocons,
    arrival,
    departure,
    adults,
    coconScope: coconFilter ? "single" : "all",
  };
}
