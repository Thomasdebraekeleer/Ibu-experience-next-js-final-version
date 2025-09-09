# Hero avec Superposition d'Images et Effet Parallaxe

## 🎯 Description

Le hero de la page d'accueil a été transformé pour créer un effet de superposition avec 2 images et un effet parallaxe avancé :

1. **Image de fond** : `Image hero 1 Background.webp` - Image d'arrière-plan
2. **Image PNG** : `Image hero 2 pods.webp` - Image au premier plan avec transparence
3. **Textes** : Positionnés entre les deux images pour créer de la profondeur
4. **Effet parallaxe** : Mouvement des images au scroll pour un effet immersif

## 📁 Fichiers modifiés

### Composant principal
- **Fichier** : `src/components/portfolio/details/portfolio-details-showcase-2-area.tsx`
- **Fonctionnalités ajoutées** :
  - Références React pour les éléments DOM
  - Effet parallaxe JavaScript au scroll
  - Structure en couches avec z-index

### Styles CSS
- **Fichier** : `public/assets/css/custom-hero-effects.css`
- **Fonctionnalités** :
  - Effets de superposition
  - Animations d'entrée
  - Responsive design
  - Optimisations de performance

### Import CSS
- **Fichier** : `src/app/globals.scss`
- **Ajout** : Import du fichier CSS personnalisé

## 🎨 Structure des couches (Z-Index)

```
Z-Index 1: Image de fond (Image hero 1 Background.webp)
Z-Index 2: Contenu du hero (textes et informations)
Z-Index 3: Image PNG au premier plan (Image hero 2 pods.webp)
Z-Index 4: Éléments d'interface et effets visuels
```

## 🚀 Effets implémentés

### 1. Parallaxe au scroll
- **Image de fond** : Déplacement rapide (`scrolled * -0.5`)
- **Image PNG** : Déplacement plus lent (`scrolled * -0.3`)
- **Résultat** : Création d'une sensation de profondeur

### 2. Superposition d'images
- L'image de fond couvre toute la zone
- L'image PNG est centrée avec `background-size: contain`
- Effet de transparence avec `opacity: 0.95`
- Mode de fusion `mix-blend-mode: multiply`

### 3. Améliorations visuelles
- Textes avec ombres pour la lisibilité
- Fond semi-transparent pour les informations
- Effet de flou (backdrop-filter)
- Animation d'entrée en fade-in

## 🔧 Personnalisation

### Changer les images
1. **Image de fond** : Ligne 29 dans le composant
   ```tsx
   backgroundImage: "url(/assets/img/inner-project/showcase/Image%20hero%201%20Background.webp)"
   ```

2. **Image PNG** : Ligne 89 dans le composant
   ```tsx
   backgroundImage: "url(/assets/img/inner-project/showcase/Image%20hero%202%20pods.webp)"
   ```

### Ajuster l'effet parallaxe
Modifiez les valeurs dans le composant (lignes 25-26) :
```tsx
const rate = scrolled * -0.5;        // Vitesse de l'image de fond
const rateForeground = scrolled * -0.3; // Vitesse de l'image PNG
```

### Modifier l'opacité
Dans le CSS, ligne 67 :
```css
opacity: 0.95; /* Valeur entre 0 et 1 */
```

## 📱 Responsive Design

- **Desktop** : Effet parallaxe complet avec `background-attachment: fixed`
- **Mobile** : Effet parallaxe désactivé avec `background-attachment: scroll`
- **Tablette** : Adaptation automatique selon la taille d'écran

## ⚡ Optimisations de performance

- `will-change: transform` pour les animations
- `backface-visibility: hidden` pour éviter les problèmes de rendu
- `transform-style: preserve-3d` pour les effets 3D
- Transitions CSS optimisées

## 🎭 Animations disponibles

- **Fade In Up** : Animation d'entrée des textes
- **Parallaxe** : Mouvement des images au scroll
- **Hover effects** : Effets sur les éléments interactifs

## 🔍 Dépannage

### L'effet parallaxe ne fonctionne pas
- Vérifiez que JavaScript est activé
- Assurez-vous que les images sont bien chargées
- Contrôlez la console pour les erreurs

### Les images ne s'affichent pas
- Vérifiez les chemins des images
- Assurez-vous que les fichiers existent dans le dossier `showcase`
- Contrôlez les permissions des fichiers

### Problèmes de performance
- Réduisez la résolution des images
- Ajustez les valeurs de parallaxe
- Désactivez l'effet sur mobile si nécessaire

## 📝 Notes techniques

- Compatible avec Next.js 13+
- Utilise les hooks React modernes (useRef, useEffect)
- CSS avec préfixes automatiques
- Support des navigateurs modernes
- Accessibilité préservée avec `prefers-reduced-motion`
