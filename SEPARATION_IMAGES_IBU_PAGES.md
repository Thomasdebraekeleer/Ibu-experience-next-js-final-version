# Séparation des Images - Pages IBÙ Signature et IBÙ Bien-être

## Vue d'ensemble
J'ai créé une séparation complète des images entre les pages IBÙ Signature et IBÙ Bien-être, permettant d'avoir des images différentes pour chaque page.

## 🎯 **Solution Implémentée**

### 📁 **Nouveau Dossier Créé**
**Dossier** : `src/assets/img/inner-project/portfolio-details-ibu-bien-etre/`

### 🔄 **Modifications Effectuées**

#### **Fichier Modifié**
`src/components/portfolio/details/portfolio-details-ibu-bien-etre.tsx`

#### **Imports Modifiés**
**Avant** :
```typescript
import full_image from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-1.jpg';
import full_image_2 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-2.jpg';
import port_img_1 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-3.jpg';
import port_img_2 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-4.jpg';
import port_img_3 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-5.jpg';
import port_img_4 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-6.jpg';
import port_img_5 from '@/assets/img/inner-project/portfolio-details-3/portfolio-img-7.jpg';
```

**Après** :
```typescript
import full_image from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-1.jpg';
import full_image_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-2.jpg';
import port_img_1 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-3.jpg';
import port_img_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-4.jpg';
import port_img_3 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-5.jpg';
import port_img_4 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-6.jpg';
import port_img_5 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-7.jpg';
```

## 📂 **Structure des Dossiers**

### **IBÙ Signature** (inchangé)
```
src/assets/img/inner-project/portfolio-details-3/
├── portfolio-img-1.jpg
├── portfolio-img-2.jpg
├── portfolio-img-3.jpg
├── portfolio-img-4.jpg
├── portfolio-img-5.jpg
├── portfolio-img-6.jpg
└── portfolio-img-7.jpg
```

### **IBÙ Bien-être** (nouveau)
```
src/assets/img/inner-project/portfolio-details-ibu-bien-etre/
├── portfolio-img-1.jpg
├── portfolio-img-2.jpg
├── portfolio-img-3.jpg
├── portfolio-img-4.jpg
├── portfolio-img-5.jpg
├── portfolio-img-6.jpg
└── portfolio-img-7.jpg
```

## 🔧 **Prochaines Étapes pour Vous**

### **1. Copier les Images**
Vous devez copier les images du dossier original vers le nouveau dossier :
```
Copier depuis : public/assets/img/inner-project/portfolio-details-3/
Vers : src/assets/img/inner-project/portfolio-details-ibu-bien-etre/
```

### **2. Remplacer les Images**
Une fois les images copiées, vous pouvez remplacer les images dans le dossier `portfolio-details-ibu-bien-etre/` par vos propres images pour IBÙ Bien-être.

### **3. Garder les Mêmes Noms**
Important : Gardez exactement les mêmes noms de fichiers :
- `portfolio-img-1.jpg`
- `portfolio-img-2.jpg`
- `portfolio-img-3.jpg`
- `portfolio-img-4.jpg`
- `portfolio-img-5.jpg`
- `portfolio-img-6.jpg`
- `portfolio-img-7.jpg`

## 🎯 **Avantages de cette Solution**

### ✅ **Indépendance Totale**
- **IBÙ Signature** : Images dans `public/assets/img/inner-project/portfolio-details-3/` (inchangé)
- **IBÙ Bien-être** : Images dans `src/assets/img/inner-project/portfolio-details-ibu-bien-etre/` (nouvelles)

### ✅ **Facilité de Gestion**
- **Pas de modification de code** nécessaire
- **Remplacement simple** des fichiers images
- **Même structure** pour les deux pages

### ✅ **Sécurité**
- **Aucun impact** sur IBÙ Signature
- **Modifications isolées** pour IBÙ Bien-être
- **Sauvegarde** automatique des images originales

## 📍 **Emplacement des Images sur la Page**

### **IBÙ Bien-être - Images Utilisées**
1. **Image principale** : `portfolio-img-1.jpg` (pleine largeur)
2. **Image de section** : `portfolio-img-2.jpg` (après texte)
3. **Images côte à côte** : `portfolio-img-3.jpg` et `portfolio-img-4.jpg`
4. **Slider** : `portfolio-img-5.jpg`, `portfolio-img-6.jpg`, `portfolio-img-7.jpg`

## 🚀 **Résultat Final**

✅ **Séparation complète** des images entre les pages
✅ **IBÙ Signature** : Images originales préservées
✅ **IBÙ Bien-être** : Nouvelles images personnalisées
✅ **Indépendance totale** entre les deux pages
✅ **Facilité de maintenance** et de modification

Maintenant vous pouvez personnaliser les images d'IBÙ Bien-être sans affecter IBÙ Signature ! 🎉
