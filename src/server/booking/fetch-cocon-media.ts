import type { BookingCocon } from "@/config/booking/types";
import { fetchPropertyRooms } from "@/server/lodgify/client";
import { normalizeRoomMediaForRoomType } from "@/server/lodgify/normalize-room-media";
import type { PublicCoconImage } from "@/server/lodgify/normalize-room-media";
import { getCached, setCached } from "@/server/lodgify/memory-cache";
import { LodgifyApiError } from "@/server/lodgify/types";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cacheKey(propertyId: number, roomTypeId: number): string {
  return `cocon-media:${propertyId}:${roomTypeId}`;
}

export async function fetchCoconGalleryImages(cocon: BookingCocon): Promise<PublicCoconImage[]> {
  const { propertyId, roomTypeId } = cocon.lodgify;
  const key = cacheKey(propertyId, roomTypeId);
  const cached = getCached<PublicCoconImage[]>(key);
  if (cached) return cached;

  try {
    const payload = await fetchPropertyRooms(propertyId);
    const images = normalizeRoomMediaForRoomType(payload, roomTypeId);
    setCached(key, images, CACHE_TTL_MS);
    return images;
  } catch (err) {
    if (err instanceof LodgifyApiError) throw err;
    throw new LodgifyApiError("lodgify_http_error", 502, "rooms");
  }
}

export type CoconGalleryResult = {
  galleries: Record<string, { images: PublicCoconImage[] }>;
  lodgifyFailures: number;
};

export async function resolveCoconMediaGalleries(
  cocons: BookingCocon[]
): Promise<CoconGalleryResult> {
  const galleries: Record<string, { images: PublicCoconImage[] }> = {};
  let lodgifyFailures = 0;

  const results = await Promise.allSettled(
    cocons.map(async (cocon) => {
      const images = await fetchCoconGalleryImages(cocon);
      return { id: cocon.id, images };
    })
  );

  for (let i = 0; i < results.length; i += 1) {
    const cocon = cocons[i]!;
    const result = results[i]!;
    if (result.status === "fulfilled") {
      galleries[cocon.id] = { images: result.value.images };
    } else {
      lodgifyFailures += 1;
      galleries[cocon.id] = { images: [] };
    }
  }

  return { galleries, lodgifyFailures };
}
