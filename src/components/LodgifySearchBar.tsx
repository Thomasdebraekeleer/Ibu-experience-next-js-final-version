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
          --ldg-psb-color-primary-lighter:#829b92;
          --ldg-psb-color-primary-darker: #031c13;
          --ldg-psb-color-primary-contrast: #ffffff;
          --ldg-semantic-color-primary:  #053725;
          --ldg-semantic-color-primary-lighter: #829b92;
          --ldg-semantic-color-primary-darker: #031c13;
          --ldg-semantic-color-primary-contrast: #ffffff;
          --ldg-component-modal-z-index: 999;
        }
        #lodgify-search-bar { width:100%; }
        
        /* Fix pour rendre visible le compteur d'adultes (stepper) */
        #lodgify-search-bar input[type="number"],
        #lodgify-search-bar input[type="text"]:not([type="button"]),
        #lodgify-search-bar [class*="stepper"] input,
        #lodgify-search-bar [class*="counter"] input,
        #lodgify-search-bar [class*="quantity"] input {
          color: #053725 !important;
          -webkit-text-fill-color: #053725 !important;
          opacity: 1 !important;
          font-size: 16px !important;
          text-align: center !important;
          min-width: 1.5ch !important;
        }
        
        /* S'assurer que les boutons +/- et "Rechercher" gardent leur style */
        #lodgify-search-bar button {
          color: inherit !important;
          -webkit-text-fill-color: inherit !important;
        }
      `}} />
      <div
        id="lodgify-search-bar"
        data-website-id="607668"
        data-language-code="fr"
        data-search-page-url="https://mallen-jallow.lodgify.com/fr/toutes-les-proprietes"
        data-dates-check-in-label="Arrivée"
        data-dates-check-out-label="Départ"
        data-guests-counter-label="Adultes"
        data-guests-input-singular-label="{{NumberOfGuests}} adulte"
        data-guests-input-plural-label="{{NumberOfGuests}} adultes"
        data-location-input-label="Emplacement"
        data-search-button-label="Rechercher"
        data-dates-input-min-stay-tooltip-text='{"one":"Minimum {minStay} nuit","other":"Minimum de {minStay} nuits"}'
        data-new-tab="true"
        data-version="stable"
      />
    </>
  );
}