import type { LodgifyRoomMedia } from "./room-media-types";

export type PublicCoconImage = {
  url: string;
};

export const LODGIFY_CDN_HOST = "l.icdbcdn.com";
export const MAX_COCON_GALLERY_IMAGES = 6;

export function normalizeLodgifyImageUrl(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let href = trimmed;
  if (href.startsWith("//")) {
    href = `https:${href}`;
  } else if (href.startsWith("http://")) {
    return null;
  } else if (!href.startsWith("https://")) {
    return null;
  }

  try {
    const parsed = new URL(href);
    if (parsed.protocol !== "https:") return null;
    if (parsed.hostname !== LODGIFY_CDN_HOST) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function extractRooms(payload: unknown): LodgifyRoomMedia[] {
  if (payload == null) return [];
  if (Array.isArray(payload)) {
    return payload.filter((item): item is LodgifyRoomMedia => item != null && typeof item === "object");
  }
  if (typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj.rooms)) {
    return obj.rooms.filter((item): item is LodgifyRoomMedia => item != null && typeof item === "object");
  }

  return [obj as LodgifyRoomMedia];
}

function imagesFromRoom(room: LodgifyRoomMedia): string[] {
  const urls: string[] = [];
  const primary = normalizeLodgifyImageUrl(room.image_url ?? undefined);
  if (primary) urls.push(primary);

  if (Array.isArray(room.images)) {
    for (const img of room.images) {
      const u = normalizeLodgifyImageUrl(img?.url ?? undefined);
      if (u) urls.push(u);
    }
  }

  return urls;
}

/** Sélectionne le room type et retourne jusqu’à 6 URLs CDN normalisées. */
export function normalizeRoomMediaForRoomType(
  payload: unknown,
  roomTypeId: number
): PublicCoconImage[] {
  const rooms = extractRooms(payload);
  const match = rooms.find((r) => r.id === roomTypeId);
  if (!match) return [];

  const seen = new Set<string>();
  const out: PublicCoconImage[] = [];

  for (const url of imagesFromRoom(match)) {
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ url });
    if (out.length >= MAX_COCON_GALLERY_IMAGES) break;
  }

  return out;
}
