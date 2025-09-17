'use client';

import React from 'react';

const LodgifySearchBar: React.FC = () => {
  return (
    <div className="not-prose">
      <div
        id="lodgify-search-bar"
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
};

export default LodgifySearchBar;
