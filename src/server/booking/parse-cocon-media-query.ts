import { getBookablePlace, getActiveCocons, isKnownCoconId } from "@/config/booking/places";
import type { BookingCocon, BookingPlace } from "@/config/booking/types";
import type { ValidateReason } from "@/config/booking/types";

export type ParsedCoconMediaQuery =
  | { ok: true; place: BookingPlace; cocons: BookingCocon[] }
  | { ok: false; reason: ValidateReason };

export function parseCoconMediaQuery(params: {
  placeId: string | null;
  coconIds: string | null;
}): ParsedCoconMediaQuery {
  if (!params.placeId?.trim()) {
    return { ok: false, reason: "invalid_request" };
  }

  const place = getBookablePlace(params.placeId.trim());
  if (!place) return { ok: false, reason: "invalid_place" };

  const raw = params.coconIds?.trim();
  if (!raw) return { ok: false, reason: "invalid_request" };

  const requested = Array.from(
    new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))
  );
  if (requested.length === 0) return { ok: false, reason: "invalid_request" };

  const activeIds = new Set(getActiveCocons(place).map((c) => c.id));
  const maxAllowed = activeIds.size;

  if (requested.length > maxAllowed) {
    return { ok: false, reason: "invalid_request" };
  }

  const cocons: BookingCocon[] = [];
  for (const id of requested) {
    if (!isKnownCoconId(place, id) || !activeIds.has(id)) {
      return { ok: false, reason: "invalid_cocon" };
    }
    const cocon = getActiveCocons(place).find((c) => c.id === id);
    if (cocon) cocons.push(cocon);
  }

  return { ok: true, place, cocons };
}
