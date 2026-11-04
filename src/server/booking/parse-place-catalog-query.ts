import { getBookablePlace } from "@/config/booking/places";
import type { BookingPlace } from "@/config/booking/types";

export type ParsePlaceCatalogResult =
  | { ok: true; place: BookingPlace }
  | { ok: false; reason: "invalid_place" };

export function parsePlaceCatalogQuery(placeId: string | null): ParsePlaceCatalogResult {
  if (!placeId?.trim()) {
    return { ok: false, reason: "invalid_place" };
  }
  const place = getBookablePlace(placeId.trim());
  if (!place || place.status !== "active") {
    return { ok: false, reason: "invalid_place" };
  }
  return { ok: true, place };
}
