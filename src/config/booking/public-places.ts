/**
 * Configuration réservation utilisable côté client — sans identifiants Lodgify.
 */

export type PublicPlaceStatus = "active" | "coming-soon";
export type PublicCoconId = "cocon-1" | "cocon-2";
export type PublicCoconFilter = "all" | PublicCoconId;

export type PublicBookingPlace = {
  id: string;
  status: PublicPlaceStatus;
  categoryKey: "vignoble" | "chateau" | "domaine";
  image: string;
  editorialPath?: string;
  /** Clé sous bookingSearch.places.{nameKey} */
  nameKey: string;
  shortDescriptionKey?: string;
};

export type PublicCocon = {
  id: PublicCoconId;
  capacityAdults: number;
  image: string;
  nameKey: string;
};

/** Lieux alignés sur la page Réservations (1 actif + futurs « Coming Soon »). */
export const PUBLIC_BOOKING_PLACES: PublicBookingPlace[] = [
  {
    id: "domaine-mehaignoul",
    status: "active",
    categoryKey: "vignoble",
    image: "/assets/img/inner-project/portfolio-col-2/port-9.jpg",
    editorialPath: "/domaine-de-mehaignoul",
    nameKey: "domaineMehaignoul",
    shortDescriptionKey: "domaineMehaignoulShort",
  },
  {
    id: "coming-soon-chateau-1",
    status: "coming-soon",
    categoryKey: "chateau",
    image: "/assets/img/inner-project/portfolio-col-2/port-8.jpg",
    nameKey: "comingSoonChateau",
  },
  {
    id: "coming-soon-vignoble-1",
    status: "coming-soon",
    categoryKey: "vignoble",
    image: "/assets/img/inner-project/portfolio-col-2/port-7.jpg",
    nameKey: "comingSoonVignoble1",
  },
  {
    id: "coming-soon-vignoble-2",
    status: "coming-soon",
    categoryKey: "vignoble",
    image: "/assets/img/inner-project/portfolio-col-2/port-6.jpg",
    nameKey: "comingSoonVignoble2",
  },
  {
    id: "coming-soon-chateau-2",
    status: "coming-soon",
    categoryKey: "chateau",
    image: "/assets/img/inner-project/portfolio-col-2/port-5.jpg",
    nameKey: "comingSoonChateau2",
  },
  {
    id: "coming-soon-domaine-1",
    status: "coming-soon",
    categoryKey: "domaine",
    image: "/assets/img/inner-project/portfolio-col-2/port-4.jpg",
    nameKey: "comingSoonDomaine",
  },
];

export const PUBLIC_COCONS: PublicCocon[] = [
  {
    id: "cocon-1",
    capacityAdults: 2,
    image: "/assets/img/inner-project/Cocons/Cocon1.webp",
    nameKey: "cocon1",
  },
  {
    id: "cocon-2",
    capacityAdults: 2,
    image: "/assets/img/inner-project/Cocons/Cocon2.webp",
    nameKey: "cocon2",
  },
];

export function getPublicPlace(id: string): PublicBookingPlace | undefined {
  return PUBLIC_BOOKING_PLACES.find((p) => p.id === id);
}

export function getActivePublicPlaces(): PublicBookingPlace[] {
  return PUBLIC_BOOKING_PLACES.filter((p) => p.status === "active");
}

export function getPublicCocon(id: PublicCoconId): PublicCocon | undefined {
  return PUBLIC_COCONS.find((c) => c.id === id);
}

export function maxAdultsForCoconFilter(filter: PublicCoconFilter): number {
  if (filter === "all") {
    return Math.max(...PUBLIC_COCONS.map((c) => c.capacityAdults));
  }
  return getPublicCocon(filter)?.capacityAdults ?? 1;
}

export function coconsMatchingAdults(adults: number, filter: PublicCoconFilter): PublicCoconId[] {
  const pool =
    filter === "all" ? PUBLIC_COCONS : PUBLIC_COCONS.filter((c) => c.id === filter);
  return pool.filter((c) => adults <= c.capacityAdults).map((c) => c.id);
}
