/** Coordonnées pdf-lib (origine bas-gauche) — modèle Canva 419.25 × 297.75 pt, page 2. */
export const CANVA_VERSO_LAYOUT = {
  pageIndex: 1,
  valueX: 78,
  fontSize: 9.5,
  codeFontSize: 7,
  /** Bas de page, sous le logo (centré au rendu). */
  codeY: 11,
  lineBaselines: {
    gift: 118,
    validity: 93,
  },
  /** Réservé si champs AcroForm réintroduits (fond transparent requis). */
  fillableFields: [
    { name: "gift_card_to", y: 196, height: 18 },
    { name: "gift_card_from", y: 173, height: 18 },
    { name: "gift_card_message", y: 150, height: 22 },
  ] as const,
};
