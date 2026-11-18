/** Domaines / lieux éditoriaux (fiches « domaine »). */
export const DOMAIN_PAGES: Record<
  string,
  { place_id: string; place_name: string }
> = {
  "/domaine-de-mehaignoul": {
    place_id: "domaine_mehaignoul",
    place_name: "Domaine de Mehaignoul",
  },
};

/** Hébergements (cocons) — identifiants stables. */
export const ACCOMMODATION_BY_COCON: Record<
  string,
  { accommodation_id: string; accommodation_name: string; place_id: string }
> = {
  "cocon-1": {
    accommodation_id: "mehaignoul_cocon_1",
    accommodation_name: "Cocon 1 — Domaine de Mehaignoul",
    place_id: "domaine_mehaignoul",
  },
  "cocon-2": {
    accommodation_id: "mehaignoul_cocon_2",
    accommodation_name: "Cocon 2 — Domaine de Mehaignoul",
    place_id: "domaine_mehaignoul",
  },
};

const LODGIFY_ACCOMMODATION_HINTS: Array<{
  pattern: RegExp;
  accommodation_id: string;
  accommodation_name: string;
  place_id: string;
}> = [
  {
    pattern: /cocon-1---domaine-de-mehaignoul/i,
    accommodation_id: "mehaignoul_cocon_1",
    accommodation_name: "Cocon 1 — Domaine de Mehaignoul",
    place_id: "domaine_mehaignoul",
  },
  {
    pattern: /cocon-2---domaine-de-mehaignoul/i,
    accommodation_id: "mehaignoul_cocon_2",
    accommodation_name: "Cocon 2 — Domaine de Mehaignoul",
    place_id: "domaine_mehaignoul",
  },
];

/** @deprecated Utiliser DOMAIN_PAGES — conservé pour compatibilité interne. */
export const ACCOMMODATION_PAGES: Record<
  string,
  { accommodation_id: string; accommodation_name: string }
> = Object.fromEntries(
  Object.entries(DOMAIN_PAGES).map(([path, d]) => [
    path,
    { accommodation_id: d.place_id, accommodation_name: d.place_name },
  ])
);

export function resolveAccommodationFromLodgifyUrl(href: string):
  | { accommodation_id: string; accommodation_name: string; place_id?: string }
  | undefined {
  for (const hint of LODGIFY_ACCOMMODATION_HINTS) {
    if (hint.pattern.test(href)) {
      return {
        accommodation_id: hint.accommodation_id,
        accommodation_name: hint.accommodation_name,
        place_id: hint.place_id,
      };
    }
  }
  return undefined;
}

export function getDomainForPath(pathname: string) {
  const normalized = pathname.split("?")[0] || "/";
  const path = normalized.replace(/^\/nl-BE/, "") || "/";
  return DOMAIN_PAGES[path];
}

export function getAccommodationForPath(pathname: string) {
  return getDomainForPath(pathname);
}

export function getAccommodationByCoconId(coconId: string | undefined) {
  if (!coconId) return undefined;
  return ACCOMMODATION_BY_COCON[coconId];
}

/** Liste des hébergements affichés sur la page Réservations (état actuel). */
export const RESERVATIONS_LIST_ITEMS = [
  {
    item_id: "domaine_mehaignoul",
    item_name: "Domaine de Mehaignoul",
    item_category: "domain",
  },
] as const;