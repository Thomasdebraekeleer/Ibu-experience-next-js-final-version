# Analyse du scroll mobile — 18 novembre 2026

## Constats

- Deux implémentations de ScrollTrigger étaient chargées : le fichier local 3.11.4 via `@/plugins`, et le paquet npm 3.12.5 via des imports directs dans la galerie, la FAQ et la presse. Chacune possède ses événements et son cycle de recalcul.
- Le hook commun désactivait ScrollSmoother sous 992 px. Son option `ignoreMobileResize` ne protégeait donc pas ScrollTrigger sur téléphone.
- Dans Chromium avec émulation tactile 390 px, avant correction, alterner la hauteur entre 740 et 810 px déclenchait des `window.scrollTo(..., 0)` provenant de `_refreshAll` dans `src/plugins/gsap-scroll-trigger.js`. La position était restaurée dans ce test : le retour durable signalé sur téléphone n'a pas été reproduit à l'identique. Ces appels temporaires sont normaux pendant un recalcul GSAP, mais inutiles et perturbateurs pendant les changements de hauteur dus aux barres du navigateur.
- Le commit `78a1463`, qui modifiait notamment « L'instant IBÙ », ajoutait aussi un `ScrollTrigger.refresh()` après chargement des huit images de la galerie Évasion PC, sans condition mobile. Le lien chronologique est réel, mais ne prouve pas que le carrousel soit la cause unique. La correction suivante `a781c50` ne traitait que le carrousel et ses styles.
- Le hook rechargeait entièrement la page lors du passage de moins de 992 px à une largeur desktop. C'est un second mécanisme indésirable, distinct du changement de hauteur des barres mobiles.

## Correction

1. Point d'entrée unique `src/plugins/scroll-trigger.ts`, utilisant le paquet GSAP déjà installé, sans nouvelle dépendance. L'ancien fichier local n'est plus importé.
2. Configuration `ignoreMobileResize` partagée. Le hook filtre également explicitement les redimensionnements mobiles : pas de recalcul pour une variation de hauteur seule, recalcul pour un changement de largeur. Ce filtrage était nécessaire dans le test de la page Expériences, où l'option GSAP seule laissait passer des recalculs.
3. Changements de mode gérés par media queries, sans `location.reload()`, avec conservation de la position lors de la création/destruction de ScrollSmoother. Écouteurs et temporisations nettoyés au démontage.
4. Recalcul de la galerie Évasion réservé au desktop, une fois les huit images chargées, via l'instance commune et `refresh(true)`.
5. Adaptations de typage des cibles DOM et d'un identifiant optionnel, désormais vérifiés par les types du paquet officiel.

## Vérifications

- Chromium, émulation mobile tactile 390 px : accueil, expériences, devenir partenaire ; huit cycles scroll + changement de hauteur par page. Les 24 cycles conservent une position non nulle et ne produisent aucun appel à zéro pendant le redimensionnement.
- Accueil : 7,5 secondes d'autoplay du carrousel ; position 2302 px avant et après.
- Quatre passages mobile/desktop : pas de navigation/rechargement, position conservée hors du haut de page.
- Chromium desktop 1440 px : les trois pages défilent à 1200 px, avec transformation ScrollSmoother correspondante.
- Préférence de mouvement réduit : passage au scroll natif, puis réactivation du scroll animé.
- Navigation via le menu mobile de la page partenaire vers Expériences : scroll maintenu après changement de hauteur. Rotations à 844/390 px et passages à 1100/390 px : aucun rechargement, aucun retour au sommet, aucune erreur JavaScript de page.
- ESLint sur les fichiers modifiés : aucune erreur ni avertissement.
- TypeScript global : initialement bloqué par `src/server/gift-cards/locale.test.ts:19` (conversion d'un objet partiel en `Stripe.Checkout.Session`). Lors de la préparation du déploiement demandé, conversion explicitée via `unknown` dans ce test uniquement : contrôle TypeScript et quatre tests de locale réussis, sans modification du comportement applicatif.

## Limites

Tests locaux dans Chromium, sans validation sur Safari iOS ou appareil physique. Le mécanisme de recalcul inutile est reproduit puis supprimé ; le retour durable observé par l'utilisateur reste à confirmer sur son téléphone après déploiement. Aucun déploiement effectué.

Référence : [configuration officielle ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.config()/), notamment les limites de `ignoreMobileResize` et les événements de recalcul automatique.
