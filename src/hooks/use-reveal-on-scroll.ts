"use client";
import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from '@/plugins';

/**
 * Hook pour animer des éléments au scroll avec IntersectionObserver comme fallback
 * 
 * @example
 * const ref = useRevealOnScroll<HTMLDivElement>({ direction: 'bottom', distance: 80 });
 * return <div ref={ref}>Contenu</div>
 */

interface UseRevealOnScrollOptions {
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'fade';
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  threshold?: number;
  once?: boolean;
}

export default function useRevealOnScroll<T extends HTMLElement>(
  options: UseRevealOnScrollOptions = {}
): RefObject<T> {
  const {
    direction = 'bottom',
    distance = 50,
    duration = 1,
    delay = 0,
    ease = 'power2.out',
    threshold = 0.15,
    once = true,
  } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Vérifier si on est sur mobile (désactiver les animations lourdes)
    const isMobile = window.innerWidth < 768;
    
    // Vérifier prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Si reduced motion, afficher directement sans animation
    if (prefersReducedMotion) {
      gsap.set(element, { opacity: 1, x: 0, y: 0 });
      return;
    }

    // Configuration de l'animation selon la direction
    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: isMobile ? duration * 0.6 : duration,
      delay,
      ease,
    };

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
      case 'fade':
        // Seulement opacity, pas de mouvement
        break;
    }

    // Créer l'animation GSAP avec ScrollTrigger
    const animation = gsap.from(element, {
      ...fromVars,
      scrollTrigger: {
        trigger: element,
        start: `top ${threshold < 0.5 ? '90%' : '80%'}`,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
        markers: false,
      },
    });

    // Cleanup
    return () => {
      animation.kill();
      if (ScrollTrigger.getById) {
        const trigger = ScrollTrigger.getById(animation.scrollTrigger?.vars.id);
        if (trigger) trigger.kill();
      }
    };
  }, [direction, distance, duration, delay, ease, threshold, once]);

  return elementRef;
}

