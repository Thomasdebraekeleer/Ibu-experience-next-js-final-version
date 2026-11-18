# IBÙ Experience — Documentation tracking GA4

Identifiant de mesure : `G-PR8420NGC1`  
Chargement : `gtag.js` après consentement **Mesure d’audience** (Consent Mode v2 Basic).

## Architecture

| Composant | Rôle |
|-----------|------|
| `ConsentDefaultScript.tsx` | Consent default `denied` + restauration `localStorage` |
| `GoogleAnalytics.tsx` | Chargement `gtag.js`, `config`, premier `page_view` |
| `AnalyticsRouteTracker.tsx` | `page_view` sur navigation client |
| `AccommodationViewTracker.tsx` | `view_item` sur fiches domaine |
| `ReservationsListTracker.tsx` | `view_item_list` sur `/reservations` |
| `BookingClickTracker.tsx` | `booking_click` sur liens `*.lodgify.com` |
| `StrategicInteractionTracker.tsx` | `cta_click`, `select_item`, `click_email`, `click_phone`, `gift_card_click` |
| `src/lib/analytics/events.ts` | API centralisée — **ne pas appeler `gtag` ailleurs** |

## Taxonomie des paramètres

Voir `src/lib/analytics/taxonomy.ts` et `page-context.ts` (`page_type` dérivé du pathname).

## Inventaire des événements

### Automatiques GA4 (après consentement)

`page_view`, `session_start`, `first_visit`, `user_engagement`, `scroll`, clics sortants, `file_download` — via mesure améliorée + `page_view` manuel (`send_page_view: false`).

### Événements métier site

| Événement | Déclencheur | Source |
|-----------|-------------|--------|
| `view_item` | Consultation fiche domaine | `AccommodationViewTracker` |
| `view_item_list` | Page Réservations | `ReservationsListTracker` |
| `select_item` | Clic grille vers domaine | `StrategicInteractionTracker` |
| `booking_click` | Clic / redirection Lodgify | `BookingClickTracker` + réservation intégrée |
| `availability_search` | Soumission recherche legacy | `AvailabilitySearch.tsx` |
| `booking_search_*` | Parcours widget accueil | `HeroBookingSearch.tsx` |
| `place_booking_*` | Parcours widget page domaine | `PlaceBookingSection.tsx`, modales |
| `cta_click` | CTA stratégiques (boutons ronds, etc.) | `StrategicInteractionTracker` |
| `click_email` | `mailto:` ou envoi formulaire contact | Tracker + `contact-form.tsx` |
| `click_phone` | `tel:` | `StrategicInteractionTracker` |
| `gift_card_click` | Lien Stripe carte cadeau | `StrategicInteractionTracker` |
| `language_change` | Changement FR/NL | `LanguageSwitcher.tsx` |

### Non implémentés (volontaire)

| Événement | Raison |
|-----------|--------|
| `begin_checkout` | Checkout réel sur Lodgify / Stripe, non observable de façon fiable |
| `purchase` | Confirmation paiement côté Lodgify ou webhook Stripe serveur (hors scope front) |
| `generate_lead` | Pas de formulaire avec accusé serveur — le contact ouvre un client mail |

## Plan de marquage (extrait)

| Zone | Action | Événement | Paramètres clés |
|------|--------|-----------|-----------------|
| Accueil | Ouvrir recherche héros | `booking_search_open` | `page_type=home` |
| Accueil | Valider recherche | `booking_search_submit` | `stay_nights` |
| Accueil | Redir. Lodgify | `booking_click` | `destination_type=lodgify` |
| Réservations | Vue liste | `view_item_list` | `item_list_id=reservations_places` |
| Réservations | Clic domaine | `select_item` | `item_id=domaine_mehaignoul` |
| Domaine | Vue page | `view_item` | `accommodation_id=domaine_mehaignoul` |
| Domaine | Réserver cocon | `place_booking_*`, `booking_click` | `cocon_id`, `accommodation_id` |
| Carte cadeau | Commander | `gift_card_click` | `gift_card_type`, `destination_type=stripe` |
| Global | CTA « Réserver » (bouton) | `cta_click` | `cta_id=*_view_reservations` |
| Footer / contact | E-mail | `click_email` | `destination_type=email` |

Attributs HTML optionnels (sans impact visuel) : `data-analytics-cta`, `data-analytics-location`, `data-analytics-cocon`.

## Configuration GA4 — dimensions personnalisées

À créer ou vérifier dans **Administration → Définitions personnalisées** (détails complets dans le livrable projet / rapport chat).

## Événements clés recommandés

- `booking_click` — intention de réservation
- `availability_search` + `booking_search_submit` — recherche de disponibilité
- `select_item` — intérêt pour un domaine
- `gift_card_click` — intention carte cadeau
- `cta_click` (filtrer `cta_id` contenant `reservations`) — accès page réservation

Ne pas marquer `page_view` ni `language_change` comme conversions commerciales.

## Limitations Lodgify

- Réservation payée, panier et revenus : back-office Lodgify ou intégration GA cross-domain à valider.
- Widgets tiers chargés même après consentement pour réservation ; analytics déclenché uniquement côté site.

## Ajouter un événement

1. Définir une fonction dans `events.ts` avec `canTrackAnalytics()`.
2. Réutiliser `baseContext()` pour `site_language` et `page_type`.
3. Monter l’appel dans le composant **ou** déléguer via attributs `data-analytics-*`.
4. Documenter dans ce fichier.
5. Tester via GA4 DebugView après consentement.

## Validation

1. Navigation privée → refus cookies → aucun hit `collect`.
2. Accepter analytics → `gtag/js?id=G-PR8420NGC1` + `page_view`.
3. Parcours réservation → `booking_click` avec `accommodation_id` si identifiable.
4. Vérifier absence de double `booking_click` (redirections `location.href` ne passent pas par le délégué liens).