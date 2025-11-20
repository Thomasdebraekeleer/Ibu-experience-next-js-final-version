"use client";
import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from '@/plugins';

/**
 * Hook pour animer plusieurs enfants avec un effet de stagger (décalage)
 * 
 * @example
 * const ref = useStaggerReveal<HTMLDivElement>({ childSelector: '.item', stagger: 0.1 });
 * return <div ref={ref}><div className="item">1</div><div className="item">2</div></div>
 */

interface UseStaggerRevealOptions {
  childSelector?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  distance?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  once?: boolean;
}

export default function useStaggerReveal<T extends HTMLElement>(
  options: UseStaggerRevealOptions = {}
): RefObject<T> {
  const {
    childSelector = '> *',
    direction = 'bottom',
    distance = 30,
    duration = 0.8,
    stagger = 0.1,
    ease = 'power2.out',
    once = true,
  } = options;

  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const children = container.querySelectorAll(childSelector);
      gsap.set(children, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: isMobile ? duration * 0.6 : duration,
      ease,
      stagger: isMobile ? stagger * 0.5 : stagger,
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
    }

    const children = container.querySelectorAll(childSelector);
    
    const animation = gsap.from(children, {
      ...fromVars,
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
        markers: false,
      },
    });

    return () => {
      animation.kill();
    };
  }, [childSelector, direction, distance, duration, stagger, ease, once]);

  return containerRef;
}

