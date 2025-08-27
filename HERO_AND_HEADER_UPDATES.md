# Mise à Jour du Héro et du Header - VBU Experience

## Vue d'ensemble
J'ai modifié votre site pour intégrer l'effet de diaporama de la page home-6 et appliquer le style du menu de home-6 à toutes vos pages.

## Modifications Apportées

### 1. Nouveau Composant Héro VBU
- **Fichier créé**: `src/components/hero-banner/hero-banner-vbu.tsx`
- **Fonctionnalités**:
  - Diaporama automatique avec effet de transition fade
  - Navigation avec flèches gauche/droite
  - Pagination personnalisée avec numérotation
  - Barre de progression pour l'autoplay
  - Effet de zoom sur les images de fond
  - Animations d'apparition du contenu

### 2. Nouveau Header VBU
- **Fichier créé**: `src/layouts/headers/header-vbu.tsx`
- **Style**: Basé sur le header de home-6 avec un design épuré et moderne
- **Fonctionnalités**:
  - Logo centré
  - Menu de navigation principal
  - Bouton de menu mobile
  - Design transparent qui s'adapte au contenu

### 3. Styles CSS Personnalisés
- **Fichier créé**: `public/assets/scss/components/_vbu-hero.scss`
- **Intégré dans**: `public/assets/scss/components/index.scss`
- **Styles inclus**:
  - Animations de transition pour le diaporama
  - Styles responsifs pour tous les écrans
  - Effets de survol et d'interaction
  - Typographie personnalisée

### 4. Pages Mises à Jour
Toutes les pages utilisent maintenant le nouveau header VBU :
- ✅ Page Home (`/home`)
- ✅ Page Expériences (`/experiences`)
- ✅ Page Réservations (`/reservations`)
- ✅ Page About (`/about`)
- ✅ Page Become a Partner (`/become-partner`)
- ✅ Page Contact (`/contact`)

## Contenu du Diaporama

### Slides Configurées
1. **Slide 1**: "DÉCOUVREZ - Des Expériences Uniques"
2. **Slide 2**: "AVENTURES - Voyages Mémorables"
3. **Slide 3**: "IMMERSION - Expériences Authentiques"

### Images Utilisées
- Utilise les images existantes du template : `slider-1.jpg`, `slider-2.jpg`, `slider-3.jpg`
- Vous pouvez remplacer ces images par vos propres photos dans le dossier `public/assets/img/inner-shop/home/`

## Personnalisation

### Modifier le Contenu du Diaporama
Éditez le fichier `src/components/hero-banner/hero-banner-vbu.tsx` :
```javascript
const hero_data = [
  {
    id: 1,
    bg: "/votre-image-1.jpg",
    subtitle: "VOTRE SOUS-TITRE",
    title: "Votre Titre <br/> Principal",
  },
  // Ajoutez plus de slides...
];
```

### Modifier les Images
1. Placez vos images dans `public/assets/img/`
2. Mettez à jour les chemins dans `hero_data`
3. Assurez-vous que les images sont optimisées pour le web

### Ajuster les Animations
Modifiez le fichier `public/assets/scss/components/_vbu-hero.scss` pour :
- Changer la vitesse des transitions
- Modifier les effets d'animation
- Ajuster la typographie
- Personnaliser les couleurs

## Fonctionnalités Techniques

### Diaporama
- **Autoplay**: 2.5 secondes par slide
- **Transition**: Effet fade avec zoom sur l'image
- **Navigation**: Flèches et pagination
- **Responsive**: S'adapte à tous les écrans

### Header
- **Transparent**: S'adapte au contenu en arrière-plan
- **Sticky**: Reste visible lors du défilement
- **Mobile**: Menu hamburger pour les petits écrans
- **Logo**: Lien vers la page d'accueil

## Prochaines Étapes

1. **Images**: Remplacez les images du diaporama par vos propres photos
2. **Contenu**: Personnalisez les textes et sous-titres
3. **Couleurs**: Ajustez les couleurs selon votre charte graphique
4. **Logo**: Remplacez le logo par votre logo VBU Experience

## Fichiers Modifiés

```
src/
├── components/
│   └── hero-banner/
│       └── hero-banner-vbu.tsx (NOUVEAU)
├── layouts/
│   └── headers/
│       └── header-vbu.tsx (NOUVEAU)
└── pages/
    ├── homes/
    │   └── home-1.tsx (MODIFIÉ)
    ├── experiences/
    │   └── experiences-main.tsx (MODIFIÉ)
    ├── reservations/
    │   └── reservations-main.tsx (MODIFIÉ)
    ├── about/
    │   └── about-main.tsx (MODIFIÉ)
    ├── become-partner/
    │   └── become-partner-main.tsx (MODIFIÉ)
    └── contact/
        └── contact-main.tsx (MODIFIÉ)

public/assets/scss/
├── components/
│   ├── _vbu-hero.scss (NOUVEAU)
│   └── index.scss (MODIFIÉ)
```

Votre site a maintenant un héro moderne avec diaporama et un header cohérent sur toutes les pages !
