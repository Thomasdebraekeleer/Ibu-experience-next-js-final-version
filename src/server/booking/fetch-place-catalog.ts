import { getActiveCocons } from "@/config/booking/places";
import type { BookingPlace } from "@/config/booking/types";
import { PUBLIC_COCONS } from "@/config/booking/public-places";
import { PLACE_CATALOG_CACHE_TTL_MS } from "@/config/booking/limits";
import { fetchPropertyRooms } from "@/server/lodgify/client";
import { normalizePlaceRoomForCatalog, type PublicCatalogCocon } from "@/server/lodgify/normalize-place-room";
import { getCached, setCached } from "@/server/lodgify/memory-cache";
import type { PublicCoconId } from "@/config/booking/public-places";

function cacheKey(placeId: string): string {
  return `place-catalog:${placeId}`;
}

export type PlaceCatalogResult = {
  cocons: PublicCatalogCocon[];
  partialFailures: number;
};

export async function resolvePlaceCatalog(place: BookingPlace): Promise<PlaceCatalogResult> {
  const key = cacheKey(place.id);
  const cached = getCached<PlaceCatalogResult>(key);
  if (cached) return cached;

  const active = getActiveCocons(place);
  const results = await Promise.allSettled(
    active.map(async (cocon) => {
      const payload = await fetchPropertyRooms(cocon.lodgify.propertyId);
      const fallbackCapacity =
        PUBLIC_COCONS.find((c) => c.id === cocon.id)?.capacityAdults ?? cocon.capacityAdults;
      const normalized = normalizePlaceRoomForCatalog(
        payload,
        cocon.lodgify.roomTypeId,
        cocon.id as PublicCoconId,
        fallbackCapacity
      );
      if (!normalized) throw new Error("normalize_failed");
      return normalized;
    })
  );

  const cocons: PublicCatalogCocon[] = [];
  let partialFailures = 0;

  for (let i = 0; i < results.length; i += 1) {
    const cocon = active[i]!;
    const result = results[i]!;
    if (result.status === "fulfilled") {
      cocons.push(result.value);
    } else {
      partialFailures += 1;
      const fallback = PUBLIC_COCONS.find((c) => c.id === cocon.id);
      if (fallback) {
        cocons.push({
          id: cocon.id as PublicCoconId,
          capacityAdults: fallback.capacityAdults,
          bedrooms: null,
          bathrooms: null,
          bedType: null,
          amenityKeys: [],
          amenityExtraCount: 0,
          coverImageUrl: null,
          gallery: [],
          minPrice: null,
        });
      }
    }
  }

  cocons.sort((a, b) => a.id.localeCompare(b.id));

  const out = { cocons, partialFailures };
  setCached(key, out, PLACE_CATALOG_CACHE_TTL_MS);
  return out;
}
