/**
 * Helpers d'animation centralisés et optimisés
 * Ces fonctions sont des utilitaires purs qui peuvent être appelés depuis n'importe où
 * Utilisez les hooks (use-reveal-on-scroll, etc.) quand possible pour une meilleure intégration React
 */

import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "@/plugins";

/**
 * Vérifie si l'appareil est mobile
 */
export function isMobileDevice(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

/**
 * Vérifie si l'utilisateur préfère des animations réduites
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Applique une animation de fade simple sur un élément
 * Utilisé comme fallback si des animations plus complexes échouent
 */
export function simpleFadeIn(element: HTMLElement, duration: number = 0.8) {
  if (!element) return null;

  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration,
    ease: 'power2.out',
  });
}

/**
 * Animation de "character reveal" avec SplitText
 * Avec fallback automatique si SplitText échoue
 */
export function animateCharacters(
  element: HTMLElement | string,
  options: {
    scrollTrigger?: boolean;
    stagger?: number;
    duration?: number;
    delay?: number;
    y?: number;
  } = {}
) {
  const {
    scrollTrigger = true,
    stagger = 0.03,
    duration = 1,
    delay = 0.1,
    y = 100,
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return null;

  // Si mobile ou reduced motion, simple fade
  if (isMobileDevice() || prefersReducedMotion()) {
    return simpleFadeIn(el as HTMLElement, 0.8);
  }

  try {
    const split = new SplitText(el, {
      type: 'chars, words',
      linesClass: 'tp-reveal-line',
    });

    gsap.set(el, { perspective: 300 });

    const animation = gsap.from(split.chars, {
      duration,
      delay,
      y,
      autoAlpha: 0,
      stagger,
      ease: 'circ.out',
      ...(scrollTrigger && {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          markers: false,
        },
      }),
    });

    return animation;
  } catch (error) {
    console.warn('Character animation failed, using simple fade', error);
    return simpleFadeIn(el as HTMLElement);
  }
}

/**
 * Animation de "title reveal" par lignes avec SplitText
 */
export function animateTitleLines(
  element: HTMLElement | string,
  options: {
    scrollTrigger?: boolean;
    stagger?: number;
    duration?: number;
    delay?: number;
  } = {}
) {
  const {
    scrollTrigger = true,
    stagger = 0.1,
    duration = 1,
    delay = 0.3,
  } = options;

  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return null;

  if (isMobileDevice() || prefersReducedMotion()) {
    return simpleFadeIn(el as HTMLElement);
  }

  try {
    const split = new SplitText(el, {
      type: 'words, lines',
    });

    gsap.set(el, { perspective: 400 });

    const animation = gsap.from(split.lines, {
      duration,
      delay,
      opacity: 0,
      rotationX: -80,
      force3D: true,
      transformOrigin: 'top center -50',
      stagger,
      ease: 'power2.out',
      ...(scrollTrigger && {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          markers: false,
        },
      }),
    });

    return animation;
  } catch (error) {
    console.warn('Title animation failed, using simple fade', error);
    return simpleFadeIn(el as HTMLElement);
  }
}

/**
 * Animation de fade avec direction personnalisée
 * Version robuste qui marche toujours
 */
export function fadeAnimation(
  elements: HTMLElement[] | NodeListOf<Element> | string,
  options: {
    direction?: 'top' | 'bottom' | 'left' | 'right' | 'in';
    distance?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    scrollTrigger?: boolean;
    startOffset?: string;
  } = {}
) {
  const {
    direction = 'bottom',
    distance = 50,
    duration = 1.5,
    delay = 0,
    ease = 'power2.out',
    scrollTrigger = true,
    startOffset = 'top center+=400',
  } = options;

  let els: HTMLElement[];
  
  if (typeof elements === 'string') {
    els = Array.from(document.querySelectorAll(elements)) as HTMLElement[];
  } else if (elements instanceof NodeList) {
    els = Array.from(elements) as HTMLElement[];
  } else {
    els = elements;
  }

  if (els.length === 0) return [];

  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();

  const animations = els.map((item) => {
    // Configuration de base
    const fromVars: gsap.TweenVars = {
      opacity: 0,
      ease,
      duration: reducedMotion ? 0.5 : (isMobile ? duration * 0.7 : duration),
      delay: reducedMotion ? 0 : delay,
    };

    // Ajouter direction si pas reduced motion
    if (!reducedMotion) {
      switch (direction) {
        case 'top':
          fromVars.y = -distance;
          break;
        case 'bottom':
          fromVars.y = distance;
          break;
        case 'left':
          fromVars.x = -distance;
          break;
        case 'right':
          fromVars.x = distance;
          break;
        case 'in':
          // Seulement opacity
          break;
      }
    }

    // Ajouter ScrollTrigger si demandé
    if (scrollTrigger) {
      fromVars.scrollTrigger = {
        trigger: item,
        start: startOffset,
        markers: false,
        toggleActions: 'play none none none',
      };
    }

    return gsap.from(item, fromVars);
  });

  return animations;
}

/**
 * Recalcule tous les ScrollTriggers
 * Utile après un changement de layout
 */
export function refreshScrollTriggers() {
  if (typeof window !== 'undefined' && ScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

/**
 * Tue tous les ScrollTriggers et animations GSAP
 * Utile pour le cleanup
 */
export function killAllAnimations() {
  if (typeof window !== 'undefined') {
    gsap.killTweensOf('*');
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
    }
  }
}

