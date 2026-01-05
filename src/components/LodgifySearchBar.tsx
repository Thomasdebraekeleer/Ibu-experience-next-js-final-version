"use client";

export default function LodgifySearchBar() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --ldg-psb-background: #ffffff;
          --ldg-psb-border-radius: 0.42em;
          --ldg-psb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1);
          --ldg-psb-padding: 14px;
          --ldg-psb-input-background: #ffffff;
          --ldg-psb-button-border-radius: 0px;
          --ldg-psb-color-primary: #053725;
          --ldg-psb-color-primary-lighter: #829b92;
          --ldg-psb-color-primary-darker: #031c13;
          --ldg-psb-color-primary-contrast: #ffffff;
          --ldg-semantic-color-primary: #053725;
          --ldg-semantic-color-primary-lighter: #829b92;
          --ldg-semantic-color-primary-darker: #031c13;
          --ldg-semantic-color-primary-contrast: #ffffff;
          --ldg-component-modal-z-index: 999;
        }
        #lodgify-search-bar {
          width: 100%;
        }
      `}} />
      <div
        id="lodgify-search-bar"
        data-website-id="607668"
        data-language-code="fr"
        data-search-page-url="https://mallen-jallow.lodgify.com/fr/toutes-les-proprietes"
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
        data-new-tab="true"
        data-version="stable"
        data-has-guests-breakdown
      />
    </>
  );
}