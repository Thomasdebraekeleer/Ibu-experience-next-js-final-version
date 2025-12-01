"use client";

export default function LodgifySearchBar() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --ldg-psb-background: #ffffff !important;
          --ldg-psb-border-radius: 0.42em !important;
          --ldg-psb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1) !important;
          --ldg-psb-padding: 14px !important;
          --ldg-psb-input-background: #ffffff !important;
          --ldg-psb-button-border-radius: 0px !important;
          --ldg-psb-color-primary: #053701 !important;
          --ldg-psb-color-primary-lighter: #829b80 !important;
          --ldg-psb-color-primary-darker: #031c01 !important;
          --ldg-psb-color-primary-contrast: #ffffff !important;
          --ldg-semantic-color-primary: #053701 !important;
          --ldg-semantic-color-primary-lighter: #829b80 !important;
          --ldg-semantic-color-primary-darker: #031c01 !important;
          --ldg-semantic-color-primary-contrast: #ffffff !important;
          --ldg-component-modal-z-index: 999 !important;
        }
        #lodgify-search-bar {
          width: 100% !important;
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
        data-new-tab="true"
        data-version="stable"
      />
    </>
  );
}