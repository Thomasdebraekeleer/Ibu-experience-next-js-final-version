"use client";

export default function BookNowBox() {
  return (
    <div className="lodgify-glass not-prose">
      <div
        id="lodgify-book-now-box"
        /* Redondance en inline = priorité max, au cas où */
        style={{
          ['--ldg-bnb-background' as any]: 'transparent',
          ['--ldg-bnb-box-shadow' as any]: 'none',
          ['--ldg-bnb-padding' as any]: '0px',
          ['--ldg-bnb-border-radius' as any]: '10px',
          ['--ldg-bnb-button-border-radius' as any]: '10px',
          ['--ldg-bnb-input-background' as any]: '#ffffff',
          ['--ldg-bnb-color-primary' as any]: '#053725',
          ['--ldg-bnb-color-primary-lighter' as any]: '#7aa293',
          ['--ldg-bnb-color-primary-darker' as any]: '#032017',
          ['--ldg-bnb-color-primary-contrast' as any]: '#ffffff',
          ['--ldg-component-calendar-cell-selection-bg-color' as any]: '#053725',
          ['--ldg-component-calendar-cell-selection-color' as any]: '#ffffff',
          ['--ldg-component-calendar-cell-selected-bg-color' as any]: '#7aa293',
          ['--ldg-component-calendar-cell-selected-color' as any]: '#ffffff',
          ['--ldg-bnb-font-family' as any]: 'inherit',
          ['--ldg-component-modal-z-index' as any]: 999,
        } as React.CSSProperties}

        data-rental-id="710587"
        data-website-id="607668"
        data-slug="mallen-jallow"
        data-language-code="fr"
        data-new-tab="true"
        data-version="stable"

        data-hide-minimum-price

        data-check-in-label="Arrivée"
        data-check-out-label="Départ"
        data-guests-label="Invités"
        data-guests-singular-label='{{NumberOfGuests}} invité'
        data-guests-plural-label='{{NumberOfGuests}} invités'
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
