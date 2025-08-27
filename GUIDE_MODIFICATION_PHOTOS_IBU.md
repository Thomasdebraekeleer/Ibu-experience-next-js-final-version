# Guide de Modification des Photos - Pages IBÙ

## Vue d'ensemble
Ce guide vous explique comment modifier les photos des pages "IBÙ Signature" et "IBÙ Bien-être" de manière simple et sécurisée.

## 📁 Structure des Fichiers

### Fichiers à Modifier
1. **IBÙ Signature** : `src/components/portfolio/details/portfolio-details-ibu-signature.tsx`
2. **IBÙ Bien-être** : `src/components/portfolio/details/portfolio-details-ibu-bien-etre.tsx`

### Dossier des Images
**Emplacement** : `src/assets/img/inner-project/portfolio-details-3/`

## 🖼️ Images Utilisées dans IBÙ Signature

### Images Principales (Lignes 12-18)
```typescript
// images
import full_image from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-1.jpg';
import full_image_2 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-2.jpg';
import port_img_1 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-3.jpg';
import port_img_2 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-4.jpg';
import port_img_3 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-5.jpg';
import port_img_4 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-6.jpg';
import port_img_5 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-7.jpg';
```

### Images du Slider (Ligne 20)
```typescript
const slider_images = [port_img_3,port_img_4,port_img_5,port_img_4];
```

## 📍 Emplacement des Images sur la Page

### 1. **Image Pleine Largeur** (Ligne 85)
```typescript
<Image data-speed=".8" src={full_image} alt="IBÙ Signature Experience" style={{ height: 'auto' }}/>
```
- **Fichier** : `portfolio-img-1.jpg`
- **Usage** : Image principale en pleine largeur

### 2. **Image de Section** (Ligne 140)
```typescript
<Image data-speed=".8" src={full_image_2} alt="IBÙ Signature Collection" style={{ height: 'auto' }}/>
```
- **Fichier** : `portfolio-img-2.jpg`
- **Usage** : Image de section après le texte

### 3. **Images Côte à Côte** (Lignes 175-180)
```typescript
<Image className="w-100" src={port_img_1} alt="Expérience VIP" style={{height:'auto'}}/>
<Image className="w-100" src={port_img_2} alt="Collection Privée" style={{height:'auto'}}/>
```
- **Fichiers** : `portfolio-img-3.jpg` et `portfolio-img-4.jpg`
- **Usage** : Deux images côte à côte

### 4. **Slider d'Images** (Lignes 220-230)
```typescript
const slider_images = [port_img_3,port_img_4,port_img_5,port_img_4];
```
- **Fichiers** : `portfolio-img-5.jpg`, `portfolio-img-6.jpg`, `portfolio-img-7.jpg`
- **Usage** : Carrousel automatique

## 🔄 Comment Modifier les Photos

### Méthode 1 : Remplacer les Images Existantes (Recommandée)

#### Étape 1 : Préparer vos Nouvelles Images
1. **Format** : JPG ou PNG
2. **Nom** : Gardez les mêmes noms de fichiers
3. **Taille** : Recommandé 1920x1080px minimum
4. **Poids** : Optimisez pour le web (< 500KB par image)

#### Étape 2 : Remplacer les Fichiers
1. Allez dans `src/assets/img/inner-project/portfolio-details-3/`
2. Remplacez les fichiers existants par vos nouvelles images
3. Gardez exactement les mêmes noms :
   - `portfolio-img-1.jpg`
   - `portfolio-img-2.jpg`
   - `portfolio-img-3.jpg`
   - `portfolio-img-4.jpg`
   - `portfolio-img-5.jpg`
   - `portfolio-img-6.jpg`
   - `portfolio-img-7.jpg`

#### Étape 3 : Vérifier
1. Redémarrez votre serveur de développement
2. Vérifiez que les nouvelles images s'affichent

### Méthode 2 : Utiliser de Nouvelles Images

#### Étape 1 : Ajouter vos Images
1. Placez vos nouvelles images dans `src/assets/img/inner-project/portfolio-details-3/`
2. Donnez-leur des noms uniques (ex: `ibu-signature-1.jpg`)

#### Étape 2 : Modifier les Imports
Dans `portfolio-details-ibu-signature.tsx`, remplacez les imports :

```typescript
// Remplacer cette ligne :
import full_image from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-1.jpg';

// Par celle-ci :
import full_image from '@/assets/img/inner-project/portfolio-details-3/votre-nouvelle-image.jpg';
```

#### Étape 3 : Modifier le Slider
```typescript
// Remplacer cette ligne :
const slider_images = [port_img_3,port_img_4,port_img_5,port_img_4];

// Par celle-ci :
const slider_images = [votre_image_1, votre_image_2, votre_image_3, votre_image_4];
```

## 🎯 Conseils pour les Images

### 📐 Dimensions Recommandées
- **Images pleine largeur** : 1920x1080px
- **Images côte à côte** : 800x600px
- **Images slider** : 600x400px
- **Ratio** : 16:9 ou 4:3

### 🎨 Qualité et Optimisation
- **Format** : JPG pour les photos, PNG pour les graphiques
- **Compression** : Optimisez pour le web
- **Poids** : Maximum 500KB par image
- **Résolution** : 72 DPI pour le web

### 📱 Responsive Design
- **Mobile** : Les images s'adaptent automatiquement
- **Tablet** : Layout optimisé
- **Desktop** : Affichage optimal

## 🔧 Modification pour IBÙ Bien-être

### Fichier à Modifier
`src/components/portfolio/details/portfolio-details-ibu-bien-etre.tsx`

### Procédure Identique
1. Suivez les mêmes étapes que pour IBÙ Signature
2. Les images sont dans le même dossier
3. Vous pouvez utiliser des images différentes pour chaque page

## ⚠️ Points Importants

### ✅ Bonnes Pratiques
- **Sauvegardez** vos images originales
- **Testez** sur différents écrans
- **Optimisez** les images pour le web
- **Vérifiez** que les alt text sont appropriés

### ❌ À Éviter
- **Ne supprimez pas** les fichiers sans les remplacer
- **Ne changez pas** les noms de variables dans le code
- **N'utilisez pas** des images trop lourdes
- **N'oubliez pas** de redémarrer le serveur après modification

## 🚀 Résultat

Après modification, vos pages IBÙ afficheront vos nouvelles images tout en conservant :
- ✅ **Animations GSAP** intactes
- ✅ **Responsive design** maintenu
- ✅ **Performance** optimisée
- ✅ **Navigation** fluide

Vos pages IBÙ seront maintenant personnalisées avec vos propres images ! 🎉
