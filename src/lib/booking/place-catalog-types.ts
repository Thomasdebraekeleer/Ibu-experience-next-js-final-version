import type { PublicCoconId } from "@/config/booking/public-places";

export type PublicAmenityKey =
  | "doubleBed"
  | "kitchenette"
  | "bathroom"
  | "parking"
  | "airConditioning"
  | "terrace"
  | "coffeeMachine"
  | "essentials"
  | "bedLinen"
  | "shower"
  | "breakfast";

export type PlaceCatalogCocon = {
  id: PublicCoconId;
  capacityAdults: number;
  bedrooms: number | null;
  bathrooms: number | null;
  bedType: "queen" | "double" | null;
  amenityKeys: PublicAmenityKey[];
  amenityExtraCount: number;
  coverImageUrl: string | null;
  gallery: { url: string }[];
  minPrice: { amount: number; currencyCode: string } | null;
  fallbackImage: string;
  nameKey: string;
};

export type PlaceCatalogResponse =
  | { ok: true; placeId: string; cocons: PlaceCatalogCocon[]; partialFailures: number }
  | { ok: false; reason: string };
