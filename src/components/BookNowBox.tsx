"use client";

import { useLocale } from "next-intl";
import { getLodgifyLanguageCode, LODGIFY_WIDGET_IDS } from "@/config/lodgify";
import type { Locale } from "@/i18n/routing";

/**
 * Widget Lodgify Book Now Box — non monté en production (script chargé dans layout).
 * Libellés data-* restent FR ; basculer via config Lodgify NL (Lot 5B+) quand URLs confirmées.
 */
export default function BookNowBox() {
  const locale = useLocale() as Locale;
  const languageCode = getLodgifyLanguageCode(locale);

  return (
    <div className="lodgify-glass not-prose">
      <div
        id="lodgify-book-now-box"
        style={{
          ["--ldg-bnb-background" as string]: "transparent",
          ["--ldg-bnb-box-shadow" as string]: "none",
          ["--ldg-bnb-padding" as string]: "0px",
          ["--ldg-bnb-border-radius" as string]: "10px",
          ["--ldg-bnb-button-border-radius" as string]: "10px",
          ["--ldg-bnb-input-background" as string]: "#ffffff",
          ["--ldg-bnb-color-primary" as string]: "#053725",
          ["--ldg-bnb-color-primary-lighter" as string]: "#7aa293",
          ["--ldg-bnb-color-primary-darker" as string]: "#032017",
          ["--ldg-bnb-color-primary-contrast" as string]: "#ffffff",
          ["--ldg-component-calendar-cell-selection-bg-color" as string]: "#053725",
          ["--ldg-component-calendar-cell-selection-color" as string]: "#ffffff",
          ["--ldg-component-calendar-cell-selected-bg-color" as string]: "#7aa293",
          ["--ldg-component-calendar-cell-selected-color" as string]: "#ffffff",
          ["--ldg-bnb-font-family" as string]: "inherit",
          ["--ldg-component-modal-z-index" as string]: "999",
        }}
        data-rental-id={LODGIFY_WIDGET_IDS.rentalId}
        data-website-id={LODGIFY_WIDGET_IDS.websiteId}
        data-slug={LODGIFY_WIDGET_IDS.slug}
        data-language-code={languageCode}
        data-new-tab="true"
        data-version="stable"
        data-hide-minimum-price
        data-check-in-label="Arrivée"
        data-check-out-label="Départ"
        data-guests-label="Invités"
        data-guests-singular-label="{{NumberOfGuests}} invité"
        data-guests-plural-label="{{NumberOfGuests}} invités"
        data-location-input-label="Emplacement"
        data-total-price-label="Prix total :"
        data-select-dates-to-see-price-label="Sélectionnez les dates pour voir le prix total"
        data-minimum-price-per-night-first-label="À partir de"
        data-minimum-price-per-night-second-label="par nuit"
        data-book-button-label="Réservez maintenant"
        data-guests-breakdown-label="Invités"
        data-adults-label='{"one":"adulte","other":"adultes"}'
        data-adults-description="Âges {minAge} ou plus"
        data-children-label='{"one":"enfant","other":"enfants"}'
        data-children-description="Âges {minAge} - {maxAge}"
        data-children-not-allowed-label="Non adapté aux enfants"
        data-infants-label='{"one":"bébé","other":"bébés"}'
        data-infants-description="Moins de {maxAge}"
        data-infants-not-allowed-label="Non adapté aux bébés"
        data-pets-label='{"one":"animal de compagnie","other":"animaux de compagnie"}'
        data-pets-not-allowed-label="Non autorisé"
        data-done-label="Terminé"
      />
    </div>
  );
}
