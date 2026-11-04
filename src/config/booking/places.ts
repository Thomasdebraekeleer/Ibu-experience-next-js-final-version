import type { BookingCocon, BookingPlace } from "./types";

const DOMAINe_MEHaignOUL_COCONS: BookingCocon[] = [
  {
    id: "cocon-1",
    status: "active",
    capacityAdults: 2,
    lodgify: { propertyId: 710587, roomTypeId: 777690 },
    checkoutUrlKey: "mehaignoulCocon1",
  },
  {
    id: "cocon-2",
    status: "active",
    capacityAdults: 2,
    lodgify: { propertyId: 738662, roomTypeId: 805778 },
    checkoutUrlKey: "mehaignoulCocon2",
  },
];

/** Lieux connus (y compris coming-soon pour usage éditorial futur). */
export const ALL_BOOKING_PLACES: BookingPlace[] = [
  {
    id: "domaine-mehaignoul",
    slug: "domaine-mehaignoul",
    status: "active",
    category: "vignoble",
    editorialPath: "/domaine-de-mehaignoul",
    cocons: DOMAINe_MEHaignOUL_COCONS,
  },
];

const BOOKABLE_BY_ID = new Map(
  ALL_BOOKING_PLACES.filter((p) => p.status === "active").map((p) => [p.id, p])
);

export function getBookablePlace(placeId: string): BookingPlace | undefined {
  return BOOKABLE_BY_ID.get(placeId);
}

export function getActiveCocons(place: BookingPlace): BookingCocon[] {
  return place.cocons.filter((c) => c.status === "active");
}

export function resolvePlaceCocons(
  place: BookingPlace,
  coconId?: string | null
): BookingCocon[] {
  const active = getActiveCocons(place);
  if (!coconId) return active;
  const one = active.find((c) => c.id === coconId);
  return one ? [one] : [];
}

export function isKnownCoconId(place: BookingPlace, coconId: string): boolean {
  return place.cocons.some((c) => c.id === coconId);
}
