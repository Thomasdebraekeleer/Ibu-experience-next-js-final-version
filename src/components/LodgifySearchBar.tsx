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
        #lodgify-search-bar { 
          width:100%;
          max-width: 600px !important;
          margin: 0 auto !important;
        }
        
        /* Layout compact : dates côte à côte, compteur adultes sur une ligne, bouton en dessous */
        #lodgify-search-bar > div,
        #lodgify-search-bar form {
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }
        
        /* Container des dates : Arrivée et Départ côte à côte */
        #lodgify-search-bar [class*="dates"],
        #lodgify-search-bar [class*="date-picker"],
        #lodgify-search-bar > div > div:first-child,
        #lodgify-search-bar form > div:first-child {
          display: flex !important;
          flex-direction: row !important;
          gap: 10px !important;
          width: 100% !important;
        }
        
        /* Chaque champ de date prend 50% */
        #lodgify-search-bar [class*="date"]:not([class*="dates"]) input,
        #lodgify-search-bar [class*="check-in"],
        #lodgify-search-bar [class*="check-out"],
        #lodgify-search-bar [class*="arrival"],
        #lodgify-search-bar [class*="departure"] {
          flex: 1 !important;
          width: 50% !important;
          min-width: 0 !important;
        }
        
        /* Container du compteur adultes : tout sur une ligne */
        #lodgify-search-bar [class*="guest"],
        #lodgify-search-bar [class*="counter"],
        #lodgify-search-bar [class*="stepper"] {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          width: 100% !important;
        }
        
        /* Bouton Rechercher : pleine largeur */
        #lodgify-search-bar button[type="submit"],
        #lodgify-search-bar [class*="submit"],
        #lodgify-search-bar [class*="search-button"] {
          width: 100% !important;
          flex: 0 0 100% !important;
        }
        
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