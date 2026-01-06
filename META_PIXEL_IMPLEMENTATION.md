# Implémentation du Meta Pixel (Facebook Pixel)

## 📋 Résumé de l'implémentation

Le Meta Pixel (ID: `850620137569894`) a été intégré dans le projet Next.js avec App Router en suivant les meilleures pratiques.

---

## 📁 Fichiers créés / modifiés

### Nouveaux fichiers créés :

1. **`src/lib/metaPixel.ts`**
   - Fonctions helper pour le tracking d'événements
   - Fonctions : `pageview()`, `track()`, `trackCustom()`
   - Types TypeScript pour les événements Meta Pixel

2. **`src/components/MetaPixel.tsx`**
   - Composant qui charge et initialise le script Meta Pixel
   - Utilise `next/script` avec `strategy="afterInteractive"`
   - Inclut le fallback `<noscript>` pour les navigateurs sans JavaScript
   - Ne charge pas le pixel en développement (NODE_ENV !== 'production')

3. **`src/components/MetaPixelRouteChange.tsx`**
   - Composant client (`'use client'`) pour l'App Router
   - Écoute les changements de route avec `usePathname()` et `useSearchParams()`
   - Envoie automatiquement un événement PageView à chaque navigation SPA
   - Protection contre les appels en développement

4. **`src/types/global.d.ts`**
   - Déclarations TypeScript pour `window.fbq`
   - Évite les erreurs TypeScript lors de l'utilisation du Meta Pixel

### Fichiers modifiés :

1. **`src/app/layout.tsx`**
   - Ajout des imports pour `MetaPixel` et `MetaPixelRouteChange`
   - Intégration des composants dans le `<body>` du layout
   - Les composants sont placés avant le ThemeProvider

2. **`README.md`**
   - Ajout d'une section "Configuration des variables d'environnement"
   - Instructions pour créer `.env.local`
   - Note importante pour ajouter la variable dans Vercel

---

## 🔧 Configuration requise

### 1. Variables d'environnement locales

Créez un fichier `.env.local` à la racine du projet :

```bash
# Meta Pixel Configuration
NEXT_PUBLIC_META_PIXEL_ID=850620137569894
```

### 2. Variables d'environnement Vercel

**IMPORTANT** : Pour que le Meta Pixel fonctionne en production sur Vercel :

1. Allez sur [Vercel Dashboard](https://vercel.com/)
2. Sélectionnez votre projet
3. Allez dans **Settings > Environment Variables**
4. Ajoutez la variable :
   - **Key** : `NEXT_PUBLIC_META_PIXEL_ID`
   - **Value** : `850620137569894`
   - **Environments** : Cochez Production, Preview, et Development

---

## 🚀 Fonctionnalités implémentées

### ✅ Chargement du script Meta Pixel
- Script chargé avec `next/script` et `strategy="afterInteractive"`
- Évite les doubles initialisations
- Fallback `<noscript>` pour les navigateurs sans JS

### ✅ Tracking automatique des PageView
- PageView initial au chargement de la page
- PageView automatique à chaque changement de route (navigation SPA)
- Protection contre les appels en développement

### ✅ Fonctions helper pour événements personnalisés
Vous pouvez tracker des événements personnalisés depuis n'importe quel composant :

```typescript
import { track, trackCustom } from '@/lib/metaPixel';

// Événements standard Meta
track('AddToCart', { value: 29.99, currency: 'EUR' });
track('Purchase', { value: 99.99, currency: 'EUR' });

// Événements personnalisés
trackCustom('BookingStarted', { property: 'Domaine de Mehaignoul' });
```

### ✅ TypeScript
- Types complets pour les événements Meta Pixel
- Déclarations globales pour `window.fbq`
- Autocomplétion dans l'IDE

### ✅ Bonnes pratiques
- Pixel chargé uniquement en production
- Protection contre les erreurs
- Code modulaire et maintenable

---

## 🧪 Checklist de test

### Tests locaux (développement)

1. **Vérifier que le pixel ne se charge PAS en dev :**
   ```bash
   npm run dev
   ```
   - Ouvrez http://localhost:3000
   - Ouvrez les DevTools (F12) > Console
   - Vous ne devriez PAS voir de logs Meta Pixel
   - C'est normal ! Le pixel ne se charge qu'en production

2. **Test en mode production local :**
   ```bash
   npm run build
   npm run start
   ```
   - Ouvrez http://localhost:3000
   - Ouvrez les DevTools (F12) > Console
   - Vous devriez voir : `fbq('init', '850620137569894')`

### Tests en production (après déploiement)

1. **Vérifier le chargement du script :**
   - Allez sur votre site en production
   - Ouvrez les DevTools (F12) > Onglet Network
   - Filtrez par "fbevents"
   - Vous devriez voir le fichier `fbevents.js` chargé

2. **Vérifier les événements PageView :**
   - Ouvrez les DevTools > Console
   - Tapez `fbq` et appuyez sur Entrée
   - Vous devriez voir la fonction fbq définie
   - Naviguez entre plusieurs pages du site
   - Chaque navigation devrait déclencher un nouveau PageView

3. **Vérifier dans Meta Events Manager :**
   - Allez sur [Meta Events Manager](https://business.facebook.com/events_manager2)
   - Sélectionnez votre Pixel (ID: 850620137569894)
   - Allez dans **Test Events**
   - Visitez votre site
   - Vous devriez voir les événements apparaître en temps réel :
     - PageView (au chargement initial)
     - PageView (à chaque changement de page)

4. **Utiliser Meta Pixel Helper (Extension Chrome) :**
   - Installez l'extension [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
   - Visitez votre site
   - Cliquez sur l'icône de l'extension
   - Vous devriez voir :
     - ✅ Pixel Found: 850620137569894
     - ✅ PageView événement détecté

### Tests des événements personnalisés (optionnel)

Si vous ajoutez des événements personnalisés dans vos composants :

```typescript
// Exemple dans un composant de réservation
import { track } from '@/lib/metaPixel';

const handleBooking = () => {
  track('InitiateCheckout', { 
    value: totalPrice, 
    currency: 'EUR' 
  });
};
```

Vérifiez ces événements dans Meta Events Manager > Test Events.

---

## 📊 Événements Meta Pixel disponibles

### Événements standard (pour e-commerce) :
- `PageView` - Visite de page (automatique)
- `ViewContent` - Vue d'un contenu spécifique
- `Search` - Recherche effectuée
- `AddToCart` - Ajout au panier
- `InitiateCheckout` - Début du processus de commande
- `Purchase` - Achat complété
- `Lead` - Lead généré (formulaire de contact)
- `CompleteRegistration` - Inscription complétée

### Exemple d'utilisation :

```typescript
import { track } from '@/lib/metaPixel';

// Dans un composant de réservation
track('InitiateCheckout', {
  content_name: 'Réservation - Domaine de Mehaignoul',
  value: 199.99,
  currency: 'EUR'
});

// Dans un formulaire de contact
track('Lead', {
  content_name: 'Contact Form Submission'
});
```

---

## 🔍 Debugging

### Le pixel ne se charge pas en production

1. Vérifiez que `NEXT_PUBLIC_META_PIXEL_ID` est défini dans Vercel
2. Vérifiez que `NODE_ENV` est bien "production"
3. Regardez les erreurs dans la console du navigateur
4. Vérifiez le réseau (Network tab) pour voir si `fbevents.js` est chargé

### Les PageView ne sont pas trackés

1. Vérifiez la console : `typeof window.fbq` devrait retourner "function"
2. Vérifiez que vous êtes en production (pas en dev)
3. Utilisez Meta Pixel Helper pour voir les événements en temps réel

### Erreurs TypeScript

Si vous voyez des erreurs TypeScript liées à `window.fbq` :
- Vérifiez que `src/types/global.d.ts` existe
- Redémarrez le serveur TypeScript dans VS Code (Cmd+Shift+P > "TypeScript: Restart TS Server")

---

## 📝 Notes importantes

1. **Développement vs Production :**
   - Le pixel ne se charge PAS en développement pour éviter de polluer vos données analytics
   - Utilisez `npm run build && npm run start` pour tester localement en mode production

2. **RGPD / Consentement :**
   - ⚠️ Ce code charge le pixel automatiquement
   - Si vous devez respecter le RGPD, ajoutez une bannière de cookies
   - Ne chargez MetaPixel que si l'utilisateur a donné son consentement

3. **Performance :**
   - Le script est chargé avec `strategy="afterInteractive"` pour ne pas bloquer le rendu initial
   - Impact minimal sur les Core Web Vitals

---

## 🎯 Prochaines étapes (optionnel)

1. **Ajouter des événements personnalisés** pour tracker les actions importantes :
   - Réservations commencées
   - Formulaires de contact soumis
   - Téléchargements de brochures

2. **Configurer les Conversions** dans Meta Events Manager :
   - Allez dans Events Manager > Pixel > Configure Web Events
   - Définissez quels événements sont des "conversions"
   - Utilisez ces conversions pour optimiser vos campagnes publicitaires

3. **Implémenter le consentement RGPD** si nécessaire :
   - Utilisez une librairie comme `react-cookie-consent`
   - Ne chargez MetaPixel que si consentement accordé

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez la [documentation officielle Meta Pixel](https://developers.facebook.com/docs/meta-pixel)
2. Utilisez [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
3. Vérifiez les logs dans Meta Events Manager

---

**✅ Implémentation terminée avec succès !**

