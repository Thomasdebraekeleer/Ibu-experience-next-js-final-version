"use client";

export default function LodgifySearchBar() {
  return (
    <div className="lodgify-glass not-prose">
      <div
        id="lodgify-search-bar"
        /* Sécurité : redéfinir en inline les variables critiques (priorité max) */
        style={{
          ['--ldg-psb-background' as any]: 'transparent',
          ['--ldg-psb-box-shadow' as any]: 'none',
          ['--ldg-psb-padding' as any]: '0px',
          ['--ldg-psb-border-radius' as any]: '10px',
          ['--ldg-psb-button-border-radius' as any]: '10px',
          ['--ldg-psb-input-background' as any]: '#ffffff',
          ['--ldg-psb-color-primary' as any]: '#053725',
          ['--ldg-psb-color-primary-lighter' as any]: '#7aa293',
          ['--ldg-psb-color-primary-darker' as any]: '#032017',
          ['--ldg-psb-color-primary-contrast' as any]: '#ffffff',
          ['--ldg-component-modal-z-index' as any]: 999,
        } as React.CSSProperties}

        data-website-id="607668"
        data-language-code="fr"
        data-checkout-page-url="https://checkout.lodgify.com/mallen-jallow/fr/#/710587"

        data-dates-check-in-label="Arrivée"
        data-dates-check-out-label="Départ"
        data-guests-counter-label="Invités"
        data-guests-input-singular-label='{{NumberOfGuests}} invité'
        data-guests-input-plural-label='{{NumberOfGuests}} invités'
        data-location-input-label="Emplacement"
        data-search-button-label="Rechercher"
        data-dates-input-min-stay-tooltip-text='{"one":"Minimum {minStay} nuit","other":"Minimum de {minStay} nuits"}'
        data-guests-breakdown-label="Invités"
        data-adults-label='{"one":"adulte","other":"adultes"}'
        data-adults-description='Âges {minAge} ou plus'
        data-children-label='{"one":"enfant","other":"enfants"}'
        data-children-description='Âges {minAge} - {maxAge}'
        data-children-not-allowed-label="Non adapté aux enfants"
        data-infants-label='{"one":"bébé","other":"bébés"}'
        data-infants-description="Moins de {maxAge}"
        data-infants-not-allowed-label="Non adapté aux bébés"
        data-pets-label='{"one":"animal de compagnie","other":"animaux de compagnie"}'
        data-pets-not-allowed-label="Non autorisé"
        data-done-label="Terminé"

        data-new-tab="true"
        data-version="stable"
      />
    </div>
  );
}