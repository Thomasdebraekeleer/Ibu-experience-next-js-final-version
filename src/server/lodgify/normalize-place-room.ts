import {
  BOOKING_DISPLAY_CURRENCY,
  MAX_COCON_FULL_GALLERY_IMAGES,
} from "@/config/booking/limits";
import type { PublicCoconId } from "@/config/booking/public-places";
import { normalizeLodgifyImageUrl, normalizeRoomMediaForRoomType } from "./normalize-room-media";
import type { LodgifyRoomMedia } from "./room-media-types";

import type { PublicAmenityKey } from "@/lib/booking/place-catalog-types";

export type { PublicAmenityKey };

export type PublicCatalogMinPrice = {
  amount: number;
  currencyCode: string;
};

export type PublicCatalogCocon = {
  id: PublicCoconId;
  capacityAdults: number;
  bedrooms: number | null;
  bathrooms: number | null;
  bedType: "queen" | "double" | null;
  amenityKeys: PublicAmenityKey[];
  amenityExtraCount: number;
  coverImageUrl: string | null;
  gallery: { url: string }[];
  minPrice: PublicCatalogMinPrice | null;
};

const AMENITY_NAME_TO_KEY: Record<string, PublicAmenityKey> = {
  SleepingQueenBed: "doubleBed",
  SleepingDoubleBed: "doubleBed",
  CookingEatingKitchenette: "kitchenette",
  RoomsBathroom: "bathroom",
  SanitaryShower: "shower",
  ParkingGeneral: "parking",
  ParkingParkingLot: "parking",
  ParkingOptionIncluded: "parking",
  HeatingACAirConditioning: "airConditioning",
  RoomsTerrace: "terrace",
  CookingEatingCoffeeMachine: "coffeeMachine",
  SanitaryEssentials: "essentials",
  SleepingBedLinen: "bedLinen",
};

const AMENITY_DISPLAY_ORDER: PublicAmenityKey[] = [
  "doubleBed",
  "kitchenette",
  "bathroom",
  "parking",
  "airConditioning",
  "terrace",
  "coffeeMachine",
  "essentials",
  "bedLinen",
  "shower",
  "breakfast",
];

const CARD_AMENITY_VISIBLE = 6;

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

function readRoomDetail(room: LodgifyRoomMedia & Record<string, unknown>): {
  bedrooms: number | null;
  bathrooms: number | null;
  capacity: number | null;
  bedType: "queen" | "double" | null;
  minPrice: PublicCatalogMinPrice | null;
} {
  const bedrooms =
    typeof room.bedrooms === "number" && room.bedrooms > 0 ? room.bedrooms : null;
  const bathrooms =
    typeof room.bathrooms === "number" && room.bathrooms > 0 ? room.bathrooms : null;
  const capacity =
    typeof room.max_people === "number" && room.max_people > 0
      ? room.max_people
      : typeof room.maxPeople === "number" && room.maxPeople > 0
        ? room.maxPeople
        : null;

  let bedType: "queen" | "double" | null = null;
  const amenities = room.amenities as Record<string, unknown> | undefined;
  if (amenities && typeof amenities === "object") {
    for (const group of Object.values(amenities)) {
      if (!Array.isArray(group)) continue;
      for (const entry of group) {
        if (!entry || typeof entry !== "object") continue;
        const name = (entry as { name?: string }).name;
        if (name === "SleepingQueenBed") bedType = "queen";
        if (name === "SleepingDoubleBed") bedType = "double";
      }
    }
  }

  const rawMin = room.min_price ?? room.minPrice;
  let minPrice: PublicCatalogMinPrice | null = null;
  if (typeof rawMin === "number" && Number.isFinite(rawMin) && rawMin > 0) {
    minPrice = { amount: rawMin, currencyCode: BOOKING_DISPLAY_CURRENCY };
  }

  return { bedrooms, bathrooms, capacity, bedType, minPrice };
}

function collectAmenityKeys(room: Record<string, unknown>): PublicAmenityKey[] {
  const keys = new Set<PublicAmenityKey>();

  if (room.breakfast_included === true || room.breakfastIncluded === true) {
    keys.add("breakfast");
  }
  if (room.has_parking === true || room.hasParking === true) {
    keys.add("parking");
  }

  const amenities = room.amenities;
  if (amenities && typeof amenities === "object") {
    for (const group of Object.values(amenities as Record<string, unknown>)) {
      if (!Array.isArray(group)) continue;
      for (const entry of group) {
        if (!entry || typeof entry !== "object") continue;
        const name = (entry as { name?: string }).name;
        if (name && AMENITY_NAME_TO_KEY[name]) {
          keys.add(AMENITY_NAME_TO_KEY[name]!);
        }
      }
    }
  }

  return AMENITY_DISPLAY_ORDER.filter((k) => keys.has(k));
}

export function normalizePlaceRoomForCatalog(
  payload: unknown,
  roomTypeId: number,
  publicId: PublicCoconId,
  fallbackCapacity: number
): PublicCatalogCocon | null {
  const rooms = extractRooms(payload);
  const match = rooms.find((r) => r.id === roomTypeId);
  if (!match) return null;

  const detail = readRoomDetail(match as LodgifyRoomMedia & Record<string, unknown>);
  const allAmenities = collectAmenityKeys(match as Record<string, unknown>);
  const amenityKeys = allAmenities.slice(0, CARD_AMENITY_VISIBLE);
  const amenityExtraCount = Math.max(0, allAmenities.length - amenityKeys.length);

  const gallery = normalizeRoomMediaForRoomType(payload, roomTypeId, {
    maxImages: MAX_COCON_FULL_GALLERY_IMAGES,
  });
  const coverImageUrl = gallery[0]?.url ?? normalizeLodgifyImageUrl(match.image_url ?? undefined);

  return {
    id: publicId,
    capacityAdults: detail.capacity ?? fallbackCapacity,
    bedrooms: detail.bedrooms,
    bathrooms: detail.bathrooms,
    bedType: detail.bedType,
    amenityKeys,
    amenityExtraCount,
    coverImageUrl,
    gallery,
    minPrice: detail.minPrice,
  };
}
