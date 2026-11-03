/** Fiches d'hébergement identifiables (pathname next-intl, sans préfixe locale). */
export const ACCOMMODATION_PAGES: Record<
  string,
  { accommodation_id: string; accommodation_name: string }
> = {
  "/domaine-de-mehaignoul": {
    accommodation_id: "domaine_mehaignoul",
    accommodation_name: "Domaine de Mehaignoul",
  },
};

const LODGIFY_ACCOMMODATION_HINTS: Array<{
  pattern: RegExp;
  accommodation_id: string;
  accommodation_name: string;
}> = [
  {
    pattern: /cocon-1---domaine-de-mehaignoul/i,
    accommodation_id: "mehaignoul_cocon_1",
    accommodation_name: "Cocon 1 — Domaine de Mehaignoul",
  },
  {
    pattern: /cocon-2---domaine-de-mehaignoul/i,
    accommodation_id: "mehaignoul_cocon_2",
    accommodation_name: "Cocon 2 — Domaine de Mehaignoul",
  },
];

export function resolveAccommodationFromLodgifyUrl(href: string):
  | { accommodation_id: string; accommodation_name: string }
  | undefined {
  for (const hint of LODGIFY_ACCOMMODATION_HINTS) {
    if (hint.pattern.test(href)) {
      return {
        accommodation_id: hint.accommodation_id,
        accommodation_name: hint.accommodation_name,
      };
    }
  }
  return undefined;
}

export function getAccommodationForPath(pathname: string) {
  const normalized = pathname.split("?")[0] || "/";
  return ACCOMMODATION_PAGES[normalized];
}
