# Inventaire i18n — Pages restantes (Lot 4A)

> **Objectif :** recenser les textes FR hardcodés, proposer les namespaces `next-intl`, et préparer le Lot 4B sans traduire massivement le site.
>
> **Source NL validée :** `IBU-Experience-en-NL.md` (accueil + shell global). Les traductions absentes de ce fichier sont marquées **Draft — à valider client**.
>
> **Page pilote Lot 4A :** `/contact` — implémentée (voir section 7).

---

## Légende colonnes

| Colonne | Signification |
| --- | --- |
| **Texte FR (source)** | Texte actuellement visible en production FR |
| **NL validé** | Traduction présente dans `IBU-Experience-en-NL.md` ou déjà en prod (shell) |
| **Draft — à valider client** | Proposition de travail, **non** à considérer comme définitive |

---

## Namespaces proposés (Lot 4B+)

| Route | Namespace(s) `messages/*.json` | Priorité |
| --- | --- | --- |
| `/experiences` | `seo.experiences`, `experiences` | **Lot 4E — fait** |
| `/experiences/ibu-bien-etre` | `seo.experienceDetails.ibuBienEtre`, `experienceDetails.ibuBienEtre`, réutilise `experiences.hero.lodgingsLink`, `experiences.cta` | **Lot 4F — fait** |
| `/experiences/ibu-signature` | `seo.experienceDetails.ibuSignature`, `experienceDetails.ibuSignature`, réutilise `experiences.cta` | **Lot 4F — fait** |
| `/reservations` | `seo.reservations`, `reservations.*` | **Lot 4B — fait** |
| `/a-propos` | `seo.about`, `about.*`, réutilise `home.press`, `home.reviews`, `experiences.cta` | **Lot 4G — fait** |
| `/devenir-partenaire` | `seo.partner`, `partner` | Lot 4B |
| `/contact` | `seo.contact`, `contact` | **Lot 4A — fait** |
| `/domaine-de-mehaignoul` | `seo.domaineMehaignoul`, `domaineMehaignoul.*`, réutilise `experiences.services`, `experiences.options`, `experiences.cocons.features` | **Lot 5A — fait** |
| `/gift-card` | `seo.giftCard`, `giftCard` | Lot 4B |
| `/faq` | `seo.faq`, `faq` | Lot 4B — placeholder minimal |
| `/blog` | `seo.blog`, `blog` | Lot 4B — placeholder minimal |

---

## 1. `/experiences` — **LOT 4E (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page App Router | `src/app/[locale]/experiences/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View principale | `src/views/experiences/experiences-main.tsx` | Traduit, `key={locale}` |
| Composants enfants | `experience-services-inclus-section.tsx`, `petit-dejeuner-option-row.tsx` | Prop `localize={true}` opt-in depuis le hub |
| Données | Aucune dans `src/data` — textes inline dans la view |
| Formulaires | Aucun |
| Lodgify | Aucun sur cette page |
| SEO actuel | Metadata statique FR dans `page.tsx` |

### Textes FR clés (extrait)

| Clé proposée | Texte FR (source) | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `experiences.hero.title` | L'expérience IBÙ | — | De IBÙ-ervaring |
| `experiences.hero.subtitle` | Harmonie & Sérénité | — | Harmonie & sereniteit |
| `experiences.cta.discoverIbu` | DÉCOUVRIR IBÙ | — | ONTDEK IBÙ |
| `experiences.section.experienceTitle` | L'expérience IBÙ | — | De IBÙ-ervaring |
| `experiences.section.intro` | Niché au cœur de la nature, IBÙ vous invite à une parenthèse de sérénité… | — | *(paragraphe complet à traduire)* |
| `experiences.options.title` | Les options | — | De opties |
| `experiences.options.vinification` | Découvrez les coulisses de la vinification… | — | *(paragraphe)* |
| `experiences.signature.*` | Section IBÙ Signature (titres, paragraphes, CTA) | — | *(voir view lignes 350–700)* |

> **Note :** Dupliquer la logique GSAP/ScrollTrigger. Prévoir `key={locale}` sur `#smooth-content` comme accueil/contact.

---

## 2. `/experiences/ibu-bien-etre` — **LOT 4F (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page | `src/app/[locale]/experiences/ibu-bien-etre/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View | `src/views/experiences/ibu-bien-etre/ibu-bien-etre-main.tsx` | `key={locale}`, GSAP `[locale]` |
| Composant détail | `src/components/portfolio/details/portfolio-details-ibu-bien-etre.tsx` | Namespace `experienceDetails.ibuBienEtre` ; CTA + lien logements via `experiences.*` |
| Composant services | `src/components/experience/experience-services-inclus-section.tsx` |
| Données services | Tableau `services_data` inline dans `experience-services-inclus-section.tsx` |
| Lodgify | Non |
| SEO | Metadata statique FR |

### Textes FR clés (extrait)

| Clé proposée | Texte FR (source) | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `experienceDetails.ibuBienEtre.hero.title` | IBÙ Bien-être | — | IBÙ Welzijn |
| `experienceDetails.ibuBienEtre.hero.subtitle` | Harmonie & Sérénité | — | Harmonie & sereniteit |
| `experienceDetails.ibuBienEtre.cta` | DÉCOUVRIR IBÙ BIEN-ÊTRE | — | ONTDEK IBÙ WELZIJN |
| `experienceDetails.ibuBienEtre.section.title` | L'expérience IBÙ Bien-être | — | De IBÙ Welzijn-ervaring |
| `experienceDetails.ibuBienEtre.included.title` | CE QUE COMPREND IBÙ BIEN-ÊTRE | — | WAT IBÙ WELZIJN INHOUDT |
| `experienceServices.checkIn.title` | Check-in, Check-out | — | Check-in, Check-out |
| `experienceServices.checkIn.desc` | Votre séjour commence à 17h00… | — | *(paragraphe)* |
| `experienceServices.welcomeBottle.title` | Bouteille de bienvenue | — | Welkomstfles |
| `experienceServices.sauna.title` | Sauna | Sauna | — |
| `experienceServices.nordicBath.title` | Bain nordique extérieur | — | Buiten-Noords bad |
| `experienceServices.relaxKit.title` | Kit de relaxation | — | Relaxatiekit |
| `experienceDetails.ibuBienEtre.food.desc` | Découvrez les options food disponibles… | — | *(paragraphe)* |

---

## 3. `/experiences/ibu-signature` — **LOT 4F (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page | `src/app/[locale]/experiences/ibu-signature/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View | `src/views/experiences/ibu-signature/ibu-signature-main.tsx` | `key={locale}`, GSAP `[locale]` |
| Composant détail | `src/components/portfolio/details/portfolio-details-ibu-signature.tsx` | Namespace `experienceDetails.ibuSignature` ; CTA via `experiences.cta` |
| Données | Inline |
| Lodgify | Non |

### Textes FR clés (extrait)

| Clé proposée | Texte FR (source) | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `experienceDetails.ibuSignature.hero.title` | IBÙ Signature | — | IBÙ Signature |
| `experienceDetails.ibuSignature.hero.subtitle` | *(voir composant)* | — | — |
| `experienceDetails.ibuSignature.cta` | DÉCOUVRIR IBÙ SIGNATURE | — | ONTDEK IBÙ SIGNATURE |

> Audit complet du composant détail requis en Lot 4B (structure similaire à Bien-être).

---

## 4. `/reservations` — **LOT 4B (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page serveur | `src/app/[locale]/reservations/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View client | `src/views/reservations/reservations-main.tsx` | Hero traduit, `key={locale}` |
| Grille portfolio | `src/components/portfolio/portfolio-grid-col-3-area.tsx` | Filtres, cartes, CTA, cursor traduits ; `Link` i18n |
| Lodgify | Aucun widget sur cette page | Liens externes inchangés (Lot 5) |

### Textes — statut traduction

| Clé | Texte FR | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `reservations.hero.eyebrow` | IBÙ EXPERIENCE | IBÙ EXPERIENCE | — |
| `reservations.hero.title` | Réservez votre Expérience Unique | — | Reserveer uw unieke ervaring |
| `reservations.hero.intro` | Planifiez votre aventure immersive… | — | Plan uw meeslepende avontuur… |
| `reservations.filters.vignoble` | VIGNOBLE | WIJNGAARD | — |
| `reservations.filters.chateau` | CHÂTEAU | KASTEEL | — |
| `reservations.filters.domaine` | DOMAINE | DOMEIN | — |
| `reservations.filters.all` | VOIR TOUT | — | ALLES BEKIJKEN |
| `reservations.grid.categories.*` | Vignoble, Château, Domaine | WIJNGAARD, KASTEEL, DOMEIN (accueil) | — |
| `reservations.grid.titles.domaineMehaignoul` | Domaine de Mehaignoul | — | Domein de Mehaignoul |
| `reservations.grid.titles.comingSoon` | Coming Soon | — | Binnenkort |
| `reservations.cursor.availability` | Voir les disponibilités | — | Bekijk de beschikbaarheid |
| `reservations.cta.*` | Voir les / disponibilités | — | Bekijk de / beschikbaarheid |
| `seo.reservations.*` | Métadonnées FR | — | Draft NL complet |

> **Limite Lot 4B :** pas de URLs Lodgify NL sur cette page (CTA décoratif sans lien externe). Les liens vers `/domaine-de-mehaignoul` utilisent le routing i18n interne.

---

## 5. `/a-propos` — **LOT 4G (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page | `src/app/[locale]/a-propos/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View | `src/views/about/about-main.tsx` | Traduit, `key={locale}`, GSAP `[locale]` |
| Composants | `src/components/video/video-two.tsx` | `localize={true}` sur À propos ; accueil reste FR par défaut |
| Données avis | `home.reviews.items` | Remplace `IBU_REVIEWS` sur la page |
| Lodgify | Non |

### Textes FR clés (extrait)

| Clé proposée | Texte FR (source) | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `about.family.title` | UNE HISTOIRE DE FAMILLE | — | EEN FAMILIEverhaal |
| `about.family.p1` | IBÙ Experience a été créé par Mallen… | — | *(paragraphe)* |
| `about.universe.title` | Notre Univers | — | Ons universum |
| `about.universe.desc` | Plongez dans l'univers IBÙ Experience… | — | *(paragraphe)* |
| `about.partners.title` | Nos partenaires | — | Onze partners |
| `about.support.title` | Ils nous soutiennent | — | Zij steunen ons |
| `about.reviews.*` | `home.reviews` (Lot 4G) | Réutiliser `home.reviews` (validé accueil) | — |

> **Cleanup (Lot 4G+) :** `src/data/ibu-reviews.ts` — supprimé Lot 6.
| `about.press.*` | Via `VideoTwo` + `PRESS_COPY_FR` | Réutiliser `home.press` (validé accueil) | — |

---

## 6. `/devenir-partenaire` — **LOT 4D (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page serveur | `src/app/[locale]/devenir-partenaire/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View client | `src/views/become-partner/become-partner-main.tsx` | Hero, avantages, timeline, formulaires ; `key={locale}` |
| Typeform | Liens FR + EN inchangés | **Pas de Typeform NL** — voir limite ci-dessous |

### Limite Typeform

- FR : `https://form.typeform.com/to/JqIvbztX`
- EN : `https://form.typeform.com/to/kxv6Z2di`
- **Aucun formulaire NL** — à créer ou valider côté client avant d’ajouter un 3e bouton.

### Textes — statut traduction

| Clé | NL validé | Draft — à valider client |
| --- | --- | --- |
| `partner.hero.title` | PARTNER WORDEN | — |
| `partner.hero.subtitle` | — | Draft complet |
| `partner.benefits.*` | — | Draft complet (5 items) |
| `partner.timeline.*` | — | Draft complet (7 étapes) |
| `partner.forms.fr/en` | — | Formulier FR / EN |
| `seo.partner.*` | — | Draft NL complet |

---

## 7. `/contact` — **PILOTE LOT 4A (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page serveur | `src/app/[locale]/contact/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View client | `src/views/contact/contact-main.tsx` | Hero traduit, `key={locale}` |
| Section contact | `src/components/contact/contact-two.tsx` | Traduit |
| Formulaire | `src/components/form/contact-form.tsx` | Traduit (labels, placeholders, succès, mailto) |
| Social | `src/components/social/social.tsx` | Pas de texte visible |
| Lodgify | Non | — |

### Textes — statut traduction

| Clé | Texte FR | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `contact.hero.eyebrow` | IBÙ EXPERIENCE | IBÙ EXPERIENCE | — |
| `contact.hero.title` | Une question? | Een vraag? | — |
| `contact.section.followUs` | Follow us | Volg ons | — |
| `contact.section.headingLine1` | Envoyez | — | Stuur ons |
| `contact.section.headingLine2` | un message | — | een bericht |
| `contact.form.fields.name` | Nom | — | Naam |
| `contact.form.fields.email` | Email | — | E-mail |
| `contact.form.fields.message` | Message | — | Bericht |
| `contact.form.placeholders.name` | Votre nom | — | Uw naam |
| `contact.form.placeholders.email` | Votre@email.com | — | Uw@email.com |
| `contact.form.placeholders.message` | Votre message | — | Uw bericht |
| `contact.form.submit` | Envoyer | — | Verzenden |
| `contact.form.success` | ✓ Votre message a été préparé… | — | ✓ Uw bericht is klaargemaakt… |
| `contact.form.mailto.subject` | Contact IBÙ Experience | Contact IBÙ Experience | — |

> **Note :** le champ `email` est validé côté Yup (required + format email). Objet mailto générique sans interpolation.

---

## 8. `/domaine-de-mehaignoul` — **LOT 5A (implémenté)**

### Fichiers

| Rôle | Chemin | Statut i18n |
| --- | --- | --- |
| Page | `src/app/[locale]/domaine-de-mehaignoul/page.tsx` | `generateMetadata` + `setRequestLocale` |
| View | `src/views/domaine-de-mehaignoul/domaine-de-mehaignoul-main.tsx` | Traduit, `key={locale}`, GSAP `[locale]` |
| Composants partagés | `experience-services-inclus-section`, `petit-dejeuner-option-row` | `localize={true}` opt-in sur cette page uniquement |
| Lodgify | `src/config/lodgify.ts` (Lot 5B) | URLs FR centralisées ; nl-BE → FR tant que NL non confirmé |

### Configuration Lodgify — **LOT 5B (implémenté)**

| Fichier | Rôle |
| --- | --- |
| `src/config/lodgify.ts` | Source unique URLs FR + placeholders NL + `getLodgifyLanguageCode()` |
| `src/components/AvailabilitySearch.tsx` | Redirect locale-aware via `getLodgifyAllPropertiesSearchUrl()` |
| `src/views/domaine-de-mehaignoul/domaine-de-mehaignoul-main.tsx` | Liens cocons via getters config |
| `src/components/LodgifySearchBar.tsx` | Test — `data-language-code` + URL legacy locale-aware |
| `src/components/BookNowBox.tsx` | Non monté prod — `data-language-code` locale-aware |
| `src/app/[locale]/layout.tsx` | Scripts `LODGIFY_SCRIPTS.*` |

### Inventaire URLs Lodgify (Lot 5B)

| ID | URL FR (confirmée prod) | Consommateur | FR | nl-BE (actuel) | NL officiel |
| --- | --- | --- | --- | --- | --- |
| `allProperties` | `https://ibu-experience.lodgify.com/fr/toutes-les-proprietes/` | `AvailabilitySearch` (accueil) | ✅ | ⚠️ URL FR (fallback) | **À obtenir client/Lodgify** |
| `mehaignoulCocon1` | `https://ibu-experience.lodgify.com/fr/...cocon-1...` | `/domaine-de-mehaignoul` | ✅ | ⚠️ URL FR | **À obtenir client/Lodgify** |
| `mehaignoulCocon2Preview` | `https://npreview-ibu-experience.lodgify.com/fr/...cocon-2...` | `/domaine-de-mehaignoul` | ✅ preview | ⚠️ preview FR | **Prod + NL à valider** |
| `legacyPortableSearch` | `https://mallen-jallow.lodgify.com/fr/toutes-les-proprietes` | `LodgifySearchBar` (test) | ✅ | ⚠️ URL FR | **À obtenir client/Lodgify** |
| Scripts widgets | `app.lodgify.com/.../renderPortableSearchBar.js`, `renderBookNowBox.js` | Layout global | ✅ | ✅ (neutres) | — |
| `data-language-code` | `fr` (nl si URLs NL renseignées dans config) | SearchBar, BookNowBox | `fr` | `fr` (TODO) | Basculer `nl` quand URLs NL confirmées |

> **Pour activer le NL :** renseigner `LODGIFY_URLS_NL_PENDING` dans `src/config/lodgify.ts` — les getters basculent automatiquement pour `nl-BE`.

> **Cleanup :** `src/data/ibu-reviews.ts` — **supprimé (Lot 6)** après grep 0 import.

### Lot 6 — SEO production + finitions i18n **(implémenté)**

| Élément | Fichier(s) | Statut |
| --- | --- | --- |
| `metadataBase` global | `src/app/layout.tsx`, `src/config/site.ts` | ✅ `https://ibu-experience.be` |
| Helpers SEO | `src/lib/seo.ts` | ✅ canonical, hreflang, `x-default`, `PUBLIC_PATHS` |
| Sitemap | `src/app/sitemap.ts` | ✅ 12 chemins × 2 locales, hreflang |
| Robots | `src/app/robots.ts` | ✅ allow `/`, disallow `/api/` |
| 404 locale | `src/app/[locale]/not-found.tsx`, `not-found-main.tsx` | ✅ FR/NL via messages |
| 404 global fallback | `src/app/not-found.tsx` | ✅ minimal FR |
| Newsletter popup | `newsletter-popup.tsx` + `newsletterPopup.*` | ✅ i18n (popup désactivé) |
| Footer newsletter | `footer-three.tsx` | ✅ déjà i18n (formulaire décoratif) |
| API subscribe | `api/subscribe/route.ts` | ✅ messages FR stables (contrat inchangé) |

**Stratégie hreflang :** clés `fr`, `nl-BE`, `x-default` → FR ; URLs sans préfixe pour FR (`localePrefix: as-needed`).

**Textes FR hardcodés restants (non bloquants) :** fallbacks `localize=false` dans `video-two.tsx`, `experience-services-inclus-section.tsx` ; `BookNowBox` (non monté prod) ; footers legacy (`footer-two`, etc.).

---

## 9. `/gift-card`

### Fichiers

| Rôle | Chemin |
| --- | --- |
| Page | `src/app/[locale]/gift-card/page.tsx` (client, ~157 lignes) |
| Données | `GIFT_CARD_OPTIONS` inline (montants Stripe) |
| Lodgify | Non |

### Textes FR clés

| Clé proposée | Texte FR (source) | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `giftCard.title` | Carte cadeau IBÙ | Cadeaubon | — |
| `giftCard.instructions` | Sélectionnez le montant de votre carte cadeau | — | Selecteer het bedrag van uw cadeaubon |
| `giftCard.cta` | Commander | — | Bestellen |
| `giftCard.options.weekStay` | Séjour IBÙ semaine | — | IBÙ-weekverblijf |
| `giftCard.options.weekendStay` | Séjour IBÙ week-end | — | IBÙ-weekendverblijf |
| `giftCard.imageAlt` | Carte cadeau IBÙ | — | Cadeaubon IBÙ |

---

## 10. `/faq` et `/blog`

### Fichiers

| Route | Page | Contenu |
| --- | --- | --- |
| `/faq` | `src/app/[locale]/faq/page.tsx` | Hero « FAQ » + « Page en construction » |
| `/blog` | `src/app/[locale]/blog/page.tsx` | Hero « Blog » + « Page en construction » |

### Textes FR

| Clé proposée | Texte FR | NL validé | Draft — à valider client |
| --- | --- | --- | --- |
| `faq.title` | FAQ | FAQ | — |
| `faq.underConstruction` | Page en construction | — | Pagina in opbouw |
| `blog.title` | Blog | Blog | — |
| `blog.underConstruction` | Page en construction | — | Pagina in opbouw |

---

## Hors scope — traité Lot 6

- ~~Sitemap / robots~~ → `src/app/sitemap.ts`, `src/app/robots.ts`
- ~~404 globale~~ → 404 locale + fallback global
- ~~Popup newsletter~~ → i18n préparé (`NEWSLETTER_POPUP_ENABLED = false`)

## Hors scope restant

- URLs Lodgify NL (Lot 5B — en attente client)
- Layout metadata fallback FR statique (pages ont `generateMetadata` localisé)
- Footers legacy anglais (non utilisés sur pages IBÙ)

---

## Plan d'extraction recommandé (Lot 4B)

| Ordre | Page | Effort | Raison |
| --- | --- | --- | --- |
| 1 | `/gift-card` | Faible | Page autonome, peu de GSAP |
| 2 | `/faq` + `/blog` | Minimal | Placeholders |
| 4 | `/devenir-partenaire` | Moyen-lourd | Typeform NL à décider |
| 5 | `/experiences` | Lourd | Hub principal |
| 6 | Détails expériences | Très lourd | Composants partagés `experience-services-inclus-section` |
| 7 | `/domaine-de-mehaignoul` | Lourd + Lodgify | Couplé au lot URLs NL |
| 8 | `/a-propos` | Très lourd | Réutiliser namespaces accueil où possible |

---

## Traductions à valider client avant Lot 4B

### Contact (pilote) — drafts restants

- `contact.section.headingLine1` / `headingLine2` (« Stuur ons / een bericht »)
- Message succès NL, SEO contact NL (`seo.contact.*`)
- `contact.form.errors.invalidEmail` (draft NL)

### Réservations (Lot 4B) — drafts restants

- `reservations.hero.title` et `intro`
- `reservations.filters.all` (ALLES BEKIJKEN)
- `reservations.grid.titles.domaineMehaignoul`, `comingSoon`
- `reservations.cursor.availability`, `reservations.cta.*`
- `seo.reservations.*` (métadonnées NL complètes)

### Pages non traitées — 100 % à valider

- Tout le corps de `/experiences`, détails expériences
- `/a-propos`, `/devenir-partenaire`, `/domaine-de-mehaignoul`, `/gift-card`
- Placeholders FAQ/Blog
- URLs et libellés Lodgify NL

---

*Généré le Lot 4A — audit + pilote `/contact`.*
