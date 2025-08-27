# Guide de Modification des Textes - IBÙ Signature

## Vue d'ensemble
Ce guide vous indique exactement où se trouvent tous les textes de la page IBÙ Signature pour que vous puissiez les modifier facilement.

## 📁 Fichier à Modifier
**Fichier** : `src/components/portfolio/details/portfolio-details-ibu-signature.tsx`

## 📍 Emplacement de Tous les Textes

### 🎯 **1. Titre Principal (Ligne 58)**
```typescript
<h2 className="tp-section-title-160 mb-50 tp-char-animation">IBÙ Signature - Expériences Exclusives</h2>
```
**Texte actuel** : "IBÙ Signature - Expériences Exclusives"
**Usage** : Titre principal de la page

---

### 🔗 **2. Bouton de Navigation (Ligne 67)**
```typescript
<a onClick={scrollTo} className="pointer">
  <span>
      <ScrollDownTwo/>
  </span>
  Découvrir nos Expériences
</a>
```
**Texte actuel** : "Découvrir nos Expériences"
**Usage** : Bouton de scroll vers le contenu

---

### 🔗 **3. Bouton de Réservation (Ligne 75)**
```typescript
<a href="/reservations">
  Réserver une Expérience
  <span>
      <UpArrowFour/>
  </span>
</a>
```
**Texte actuel** : "Réserver une Expérience"
**Usage** : Lien vers la page réservations

---

### 🎯 **4. Titre de Section 1 (Ligne 95)**
```typescript
<h4 className="showcase-details-2-section-title tp-char-animation">Expériences Signature</h4>
```
**Texte actuel** : "Expériences Signature"
**Usage** : Titre de la première section

---

### 🍃 **5. Sous-titre 1 (Ligne 102)**
```typescript
<span className="ab-inner-subtitle mb-25">
  <Leaf/>
  Une introduction
</span>
```
**Texte actuel** : "Une introduction"
**Usage** : Sous-titre avec icône feuille

---

### 📝 **6. Paragraphe 1 (Lignes 107-108)**
```typescript
<p className="pb-25">Nos expériences signature représentent l'excellence absolue en matière de service personnalisé. Chaque détail est méticuleusement orchestré pour créer des moments inoubliables qui dépassent toutes les attentes.</p>
<p>De l'Expérience VIP à la Collection Privée, en passant par nos créations Sur Mesure, chaque expérience est unique et conçue pour offrir une immersion totale dans le luxe et l'exclusivité.</p>
```
**Texte actuel** : 
- "Nos expériences signature représentent l'excellence absolue..."
- "De l'Expérience VIP à la Collection Privée..."

**Usage** : Description principale des expériences signature

---

### 🎯 **7. Titre de Section 2 (Ligne 125)**
```typescript
<h4 className="showcase-details-2-section-title tp-char-animation">Notre Mission</h4>
```
**Texte actuel** : "Notre Mission"
**Usage** : Titre de la deuxième section

---

### 🍃 **8. Sous-titre 2 (Ligne 132)**
```typescript
<span className="ab-inner-subtitle mb-25">
  <Leaf/>
  Notre approche
</span>
```
**Texte actuel** : "Notre approche"
**Usage** : Sous-titre avec icône feuille

---

### 📝 **9. Paragraphe 2 (Lignes 137-138)**
```typescript
<p className="pb-25">Notre mission est de créer des expériences qui transcendent le simple service pour devenir de véritables œuvres d'art vivantes. Chaque expérience signature est conçue avec une attention particulière aux détails.</p>
<p>Nous collaborons avec les meilleurs artisans, chefs et experts pour offrir des moments qui restent gravés dans la mémoire de nos clients privilégiés.</p>
```
**Texte actuel** :
- "Notre mission est de créer des expériences..."
- "Nous collaborons avec les meilleurs artisans..."

**Usage** : Description de la mission

---

### 🎯 **10. Titre de Section 3 (Ligne 165)**
```typescript
<h4 className="showcase-details-2-section-title tp-char-animation">L'Excellence</h4>
```
**Texte actuel** : "L'Excellence"
**Usage** : Titre de la troisième section

---

### 🍃 **11. Sous-titre 3 (Ligne 172)**
```typescript
<span className="ab-inner-subtitle mb-25">
  <Leaf/>
  Notre engagement
</span>
```
**Texte actuel** : "Notre engagement"
**Usage** : Sous-titre avec icône feuille

---

### 📝 **12. Paragraphe 3 (Lignes 177-178)**
```typescript
<p className="pb-25">L'excellence n'est pas un objectif, c'est notre standard quotidien. Chaque expérience signature est le fruit d'une collaboration étroite entre nos experts et nos clients pour créer quelque chose de véritablement extraordinaire.</p>
<p>Nous nous engageons à maintenir les plus hauts standards de qualité et d'innovation pour offrir des expériences qui définissent de nouveaux repères dans le domaine du luxe personnalisé.</p>
```
**Texte actuel** :
- "L'excellence n'est pas un objectif..."
- "Nous nous engageons à maintenir..."

**Usage** : Description de l'excellence

---

### 🖼️ **13. Alt Text des Images (Lignes 85, 140, 175, 180)**
```typescript
alt="IBÙ Signature Experience"        // Ligne 85
alt="IBÙ Signature Collection"        // Ligne 140
alt="Expérience VIP"                  // Ligne 175
alt="Collection Privée"               // Ligne 180
alt="IBÙ Signature Gallery"           // Ligne 230
```
**Usage** : Textes alternatifs des images (accessibilité)

## 🔄 Comment Modifier les Textes

### Méthode Simple
1. **Ouvrez** le fichier `portfolio-details-ibu-signature.tsx`
2. **Localisez** la ligne correspondante dans le guide ci-dessus
3. **Remplacez** le texte entre les guillemets
4. **Sauvegardez** le fichier
5. **Vérifiez** le résultat sur votre site

### Exemple de Modification
```typescript
// Avant
<h2 className="tp-section-title-160 mb-50 tp-char-animation">IBÙ Signature - Expériences Exclusives</h2>

// Après
<h2 className="tp-section-title-160 mb-50 tp-char-animation">IBÙ Signature - Expériences Premium</h2>
```

## ⚠️ Points Importants

### ✅ Bonnes Pratiques
- **Sauvegardez** une copie avant modification
- **Testez** après chaque modification
- **Gardez** la même longueur de texte si possible
- **Vérifiez** l'orthographe et la grammaire

### ❌ À Éviter
- **Ne supprimez pas** les balises HTML
- **Ne changez pas** les noms de classes CSS
- **N'oubliez pas** les guillemets
- **Ne cassez pas** la structure du code

## 🎯 Résumé des Sections

### Section 1 : Introduction
- **Titre** : "Expériences Signature"
- **Sous-titre** : "Une introduction"
- **Contenu** : Description générale

### Section 2 : Mission
- **Titre** : "Notre Mission"
- **Sous-titre** : "Notre approche"
- **Contenu** : Description de la mission

### Section 3 : Excellence
- **Titre** : "L'Excellence"
- **Sous-titre** : "Notre engagement"
- **Contenu** : Description de l'excellence

## 🚀 Résultat

Après modification, votre page IBÙ Signature affichera vos nouveaux textes tout en conservant :
- ✅ **Animations GSAP** intactes
- ✅ **Design responsive** maintenu
- ✅ **Structure HTML** préservée
- ✅ **Performance** optimisée

Votre page IBÙ Signature sera maintenant personnalisée avec vos propres textes ! 🎉
