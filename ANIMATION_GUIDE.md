# Guide du Système d'Animation - IBÙ Experience

> **Version optimisée pour des animations Awwwards-level avec une fiabilité rock-solid**

## 📋 Table des Matières

1. [Principes Fondamentaux](#principes-fondamentaux)
2. [Architecture du Système](#architecture-du-système)
3. [Hooks d'Animation Disponibles](#hooks-danimation-disponibles)
4. [Helpers d'Animation](#helpers-danimation)
5. [Guide d'Utilisation](#guide-dutilisation)
6. [Optimisations Mobile](#optimisations-mobile)
7. [Résolution de Problèmes](#résolution-de-problèmes)

---

## 🎯 Principes Fondamentaux

### Progressive Enhancement

**RÈGLE D'OR**: Le contenu DOIT toujours être visible, même si JavaScript échoue.

✅ **BON** :
```css
/* CSS par défaut - visible */
.hero-title {
  opacity: 1;
  transform: translateY(0);
}
```

```typescript
// JS améliore l'expérience
gsap.from('.hero-title', { opacity: 0, y: 50 });
```

❌ **MAUVAIS** :
```css
/* Invisible par défaut - DANGER */
.hero-title {
  opacity: 0;
  transform: translateY(50px);
}
```

### Fallbacks CSS Automatiques

Le fichier `public/assets/css/animation-fallbacks.css` garantit que **tous** les éléments animés sont visibles par défaut :

```css
.tp_fade_bottom,
.tp-char-animation,
.tp_title_anim {
  opacity: 1 !important;
  transform: translate3d(0, 0, 0) !important;
}
```

### Client-Only Animations

- ✅ Toutes les animations s'exécutent **uniquement côté client**
- ✅ Pas d'appel à `window` ou `document` pendant le SSR
- ✅ Utilisation de `useIsomorphicLayoutEffect` pour éviter les warnings

---

## 🏗️ Architecture du Système

```
src/
├── hooks/
│   ├── use-isomorphic-layout-effect.ts   # Évite warnings SSR
│   ├── use-reveal-on-scroll.ts           # Reveal simple au scroll
│   ├── use-stagger-reveal.ts             # Reveal avec stagger (enfants)
│   ├── use-split-text-reveal.ts          # Animation de texte caractère par caractère
│   └── use-scroll-smooth.ts              # Smooth scroll optimisé
│
├── utils/
│   ├── animation-helpers.ts              # Helpers purs réutilisables
│   └── title-animation.ts                # Animations legacy (refactorisées)
│
└── public/assets/css/
    └── animation-fallbacks.css           # Fallbacks CSS critiques
```

---

## 🪝 Hooks d'Animation Disponibles

### 1. `useRevealOnScroll`

Anime un élément quand il entre dans le viewport.

**Exemple simple** :
```tsx
import useRevealOnScroll from '@/hooks/use-reveal-on-scroll';

export default function MyComponent() {
  const titleRef = useRevealOnScroll<HTMLHeadingElement>({
    direction: 'bottom',
    distance: 80,
    duration: 1.2,
  });

  return <h1 ref={titleRef}>Mon Titre</h1>;
}
```

**Options disponibles** :
```typescript
{
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'fade';  // Défaut: 'bottom'
  distance?: number;        // Défaut: 50
  duration?: number;        // Défaut: 1
  delay?: number;           // Défaut: 0
  ease?: string;            // Défaut: 'power2.out'
  threshold?: number;       // Défaut: 0.15
  once?: boolean;           // Défaut: true
}
```

### 2. `useStaggerReveal`

Anime plusieurs enfants avec un décalage (stagger).

**Exemple** :
```tsx
import useStaggerReveal from '@/hooks/use-stagger-reveal';

export default function ServicesList() {
  const listRef = useStaggerReveal<HTMLUListElement>({
    childSelector: '.service-item',
    stagger: 0.15,
    direction: 'bottom',
  });

  return (
    <ul ref={listRef}>
      <li className="service-item">Service 1</li>
      <li className="service-item">Service 2</li>
      <li className="service-item">Service 3</li>
    </ul>
  );
}
```

**Options** :
```typescript
{
  childSelector?: string;   // Défaut: '> *'
  direction?: 'top' | 'bottom' | 'left' | 'right';
  distance?: number;        // Défaut: 30
  duration?: number;        // Défaut: 0.8
  stagger?: number;         // Défaut: 0.1
  ease?: string;            // Défaut: 'power2.out'
  once?: boolean;           // Défaut: true
}
```

### 3. `useSplitTextReveal`

Anime du texte caractère par caractère ou mot par mot.

**Exemple** :
```tsx
import useSplitTextReveal from '@/hooks/use-split-text-reveal';

export default function HeroTitle() {
  const titleRef = useSplitTextReveal<HTMLHeadingElement>({
    type: 'chars',
    stagger: 0.03,
    duration: 1,
  });

  return <h1 ref={titleRef}>IBÙ Experience</h1>;
}
```

**Options** :
```typescript
{
  type?: 'chars' | 'words' | 'lines';  // Défaut: 'chars'
  stagger?: number;     // Défaut: 0.03
  duration?: number;    // Défaut: 1
  delay?: number;       // Défaut: 0.1
  ease?: string;        // Défaut: 'circ.out'
  once?: boolean;       // Défaut: true
  y?: number;           // Défaut: 100
}
```

---

## 🛠️ Helpers d'Animation

Pour les cas où vous ne pouvez pas utiliser de refs React (animations globales, code legacy), utilisez les helpers :

### `fadeAnimation()`

```typescript
import { fadeAnimation } from '@/utils/animation-helpers';

// Animer tous les éléments avec une classe
fadeAnimation('.tp_fade_bottom', {
  direction: 'bottom',
  distance: 50,
  duration: 1.5,
  scrollTrigger: true,
});
```

### `animateCharacters()`

```typescript
import { animateCharacters } from '@/utils/animation-helpers';

animateCharacters('.my-title', {
  scrollTrigger: true,
  stagger: 0.05,
  duration: 1,
});
```

### `animateTitleLines()`

```typescript
import { animateTitleLines } from '@/utils/animation-helpers';

animateTitleLines('.section-title', {
  scrollTrigger: true,
  stagger: 0.1,
});
```

---

## 📱 Optimisations Mobile

### Smooth Scroll

Le smooth scroll est **automatiquement désactivé** sur mobile/tablette (< 992px) pour éviter les saccades.

### Animations Simplifiées

Sur mobile :
- Durées réduites de 40% (`duration * 0.6`)
- Stagger réduit de 50% (`stagger * 0.5`)
- Animations complexes (SplitText) remplacées par des fades simples

### Prefers Reduced Motion

Toutes les animations sont **automatiquement désactivées** si l'utilisateur a activé "Réduire les mouvements" dans ses préférences système.

---

## 📝 Guide d'Utilisation

### Créer une Nouvelle Section Animée

**Étape 1** : Créer votre composant
```tsx
'use client';
import useRevealOnScroll from '@/hooks/use-reveal-on-scroll';

export default function MySection() {
  const titleRef = useRevealOnScroll<HTMLHeadingElement>({
    direction: 'bottom',
    distance: 60,
  });

  const contentRef = useRevealOnScroll<HTMLDivElement>({
    direction: 'fade',
    delay: 0.3,
  });

  return (
    <section>
      <h2 ref={titleRef}>Mon Titre</h2>
      <div ref={contentRef}>
        <p>Mon contenu</p>
      </div>
    </section>
  );
}
```

**Étape 2** : Le CSS est déjà géré !

Grâce aux fallbacks CSS, votre contenu est visible même sans JavaScript.

### Animer une Liste d'Éléments

```tsx
import useStaggerReveal from '@/hooks/use-stagger-reveal';

export default function ProjectGrid() {
  const gridRef = useStaggerReveal<HTMLDivElement>({
    childSelector: '.project-card',
    stagger: 0.12,
    direction: 'bottom',
  });

  return (
    <div ref={gridRef} className="grid">
      {projects.map(project => (
        <div key={project.id} className="project-card">
          {/* ... */}
        </div>
      ))}
    </div>
  );
}
```

### Animation de Hero

```tsx
import useSplitTextReveal from '@/hooks/use-split-text-reveal';
import useRevealOnScroll from '@/hooks/use-reveal-on-scroll';

export default function Hero() {
  const titleRef = useSplitTextReveal<HTMLHeadingElement>({
    type: 'chars',
    stagger: 0.04,
  });

  const buttonRef = useRevealOnScroll<HTMLDivElement>({
    direction: 'fade',
    delay: 1,
  });

  return (
    <div className="hero">
      <h1 ref={titleRef}>IBÙ Experience</h1>
      <div ref={buttonRef}>
        <button>Découvrir</button>
      </div>
    </div>
  );
}
```

---

## 🔧 Résolution de Problèmes

### Problème : Les animations ne se déclenchent pas

**Solutions** :
1. Vérifier que le composant est marqué `'use client'`
2. Vérifier que GSAP et ScrollTrigger sont enregistrés
3. Ouvrir la console pour voir les erreurs potentielles
4. Vérifier que l'élément n'est pas caché (`display: none`)

### Problème : Le texte n'apparaît pas immédiatement

**Cause** : Problème de fallback CSS

**Solution** : Vérifier que `animation-fallbacks.css` est bien importé dans `layout.tsx`

### Problème : Animations saccadées sur mobile

**Solutions** :
1. Le smooth scroll devrait être désactivé automatiquement sur mobile
2. Vérifier qu'on n'anime que `transform` et `opacity`
3. Éviter d'animer `width`, `height`, `top`, `left`

### Problème : Conflits d'animations

**Solution** : S'assurer qu'un seul système d'animation cible un élément :

```tsx
// ❌ MAUVAIS - Double animation
<div className="tp_fade_bottom" ref={myRef}>

// ✅ BON - Une seule animation
<div ref={myRef}>
```

---

## 🎓 Bonnes Pratiques

### ✅ À FAIRE

1. **Toujours** marquer les composants animés avec `'use client'`
2. **Toujours** utiliser des refs React pour les nouvelles animations
3. **Toujours** nettoyer les animations dans le cleanup (`return () => { ... }`)
4. **Toujours** tester sur mobile
5. **Toujours** tester avec "Prefers Reduced Motion" activé

### ❌ À ÉVITER

1. ❌ Ne jamais rendre du contenu invisible par défaut en CSS
2. ❌ Ne jamais utiliser `setTimeout` pour initialiser des animations
3. ❌ Ne jamais appeler `document.querySelector` pendant le SSR
4. ❌ Ne jamais animer des propriétés de layout (`width`, `height`, etc.)
5. ❌ Ne jamais oublier le cleanup des animations

---

## 🚀 Checklist de Performance

- [ ] Contenu visible sans JavaScript ✓
- [ ] Smooth scroll désactivé sur mobile ✓
- [ ] Animations simplifiées sur mobile ✓
- [ ] Support de Prefers Reduced Motion ✓
- [ ] Cleanup approprié des animations ✓
- [ ] Utilisation de `transform` et `opacity` uniquement ✓
- [ ] Pas de requêtes DOM inutiles ✓
- [ ] Tests sur appareils réels ✓

---

## 📚 Ressources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Documentation](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Web Animation Best Practices](https://web.dev/animations/)

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur
2. Testez avec les animations désactivées
3. Vérifiez que les fallbacks CSS sont chargés
4. Consultez ce guide

---

**Créé avec ❤️ pour IBÙ Experience**

