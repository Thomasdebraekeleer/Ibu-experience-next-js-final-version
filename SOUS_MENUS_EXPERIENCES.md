# Nouvelles Pages - Sous-menus Expériences

## Vue d'ensemble
J'ai créé deux nouvelles pages pour les sous-menus d'expériences : "IBÙ Signature" et "IBÙ Bien-être".

## Pages Créées

### 1. IBÙ Signature
**URL** : `/experiences/ibu-signature`

**Fichiers créés** :
- `src/app/experiences/ibu-signature/page.tsx`
- `src/pages/experiences/ibu-signature/ibu-signature-main.tsx`

**Contenu** :
- **Hero Section** : "IBÙ Signature" avec description
- **Section Signature** : 3 expériences exclusives
  - Expérience VIP (couronne)
  - Collection Privée (étoile)
  - Sur Mesure (gemme)
- **ServiceOne** : Services du template
- **ProjectOne** : Projets du template
- **TestimonialOne** : Témoignages du template
- **FooterThree** : Même footer que les autres pages

### 2. IBÙ Bien-être
**URL** : `/experiences/ibu-bien-etre`

**Fichiers créés** :
- `src/app/experiences/ibu-bien-etre/page.tsx`
- `src/pages/experiences/ibu-bien-etre/ibu-bien-etre-main.tsx`

**Contenu** :
- **Hero Section** : "IBÙ Bien-être" avec description
- **Section Bien-être** : 3 expériences de relaxation
  - Spa & Massages (icône spa)
  - Retraites Nature (feuille)
  - Méditation & Yoga (cœur)
- **ServiceOne** : Services du template
- **ProjectOne** : Projets du template
- **TestimonialOne** : Témoignages du template
- **FooterThree** : Même footer que les autres pages

## Navigation Mise à Jour

### Menu Principal
**Fichier modifié** : `src/data/menu-data.ts`

**Changements** :
- Ajout de `dropdown_menus` pour "EXPERIENCES"
- Sous-menus :
  - IBÙ Signature → `/experiences/ibu-signature`
  - IBÙ Bien-être → `/experiences/ibu-bien-etre`

### Menu Mobile
- Même structure avec dropdown_menus pour la version mobile

## Structure des Fichiers

```
src/
├── app/
│   └── experiences/
│       ├── ibu-signature/
│       │   └── page.tsx
│       └── ibu-bien-etre/
│           └── page.tsx
└── pages/
    └── experiences/
        ├── ibu-signature/
        │   └── ibu-signature-main.tsx
        └── ibu-bien-etre/
            └── ibu-bien-etre-main.tsx
```

## Fonctionnalités

### Animations GSAP
- **ScrollSmoother** : Défilement fluide
- **ScrollTrigger** : Animations au scroll
- **SplitText** : Animation du texte
- **cursorAnimation** : Curseur personnalisé

### Composants Utilisés
- **HeaderVBU** : Navigation cohérente
- **FooterThree** : Footer uniforme
- **ServiceOne** : Section services
- **ProjectOne** : Galerie de projets
- **TestimonialOne** : Témoignages clients

### Styles
- **Couleur principale** : #053725 (vert foncé)
- **Icônes FontAwesome** : Couronne, étoile, gemme, spa, feuille, cœur
- **Design responsive** : S'adapte à tous les écrans

## Accès aux Pages

### Via Navigation
1. Cliquer sur "EXPERIENCES" dans le menu
2. Sélectionner "IBÙ Signature" ou "IBÙ Bien-être"

### URLs Directes
- `http://localhost:3000/experiences/ibu-signature`
- `http://localhost:3000/experiences/ibu-bien-etre`

## Résultat

✅ **2 nouvelles pages** créées avec contenu personnalisé
✅ **Sous-menus** ajoutés à la navigation
✅ **Design cohérent** avec le reste du site
✅ **Animations** GSAP intégrées
✅ **Responsive** sur tous les appareils

Les pages sont maintenant accessibles via le menu "EXPERIENCES" ! 🚀
