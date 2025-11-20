"use client";
import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger, SplitText } from '@/plugins';

/**
 * Hook pour animer du texte caractère par caractère ou ligne par ligne
 * Avec fallback si SplitText échoue
 * 
 * @example
 * const ref = useSplitTextReveal<HTMLHeadingElement>({ type: 'chars' });
 * return <h1 ref={ref}>Titre animé</h1>
 */

interface UseSplitTextRevealOptions {
  type?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  once?: boolean;
  y?: number;
}

export default function useSplitTextReveal<T extends HTMLElement>(
  options: UseSplitTextRevealOptions = {}
): RefObject<T> {
  const {
    type = 'chars',
    stagger = 0.03,
    duration = 1,
    delay = 0.1,
    ease = 'circ.out',
    once = true,
    y = 100,
  } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Si reduced motion ou mobile, simple fade sans split
    if (prefersReducedMotion || isMobile) {
      const animation = gsap.from(element, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });

      return () => {
        animation.kill();
      };
    }

    // SplitText animation
    let split: any;
    let animation: gsap.core.Tween;

    try {
      split = new SplitText(element, {
        type: `${type}, lines`,
        linesClass: 'tp-split-line',
      });

      const targets = type === 'chars' ? split.chars : type === 'words' ? split.words : split.lines;

      gsap.set(element, { perspective: 400 });

      animation = gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        ease,
        stagger,
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          markers: false,
        },
      });
    } catch (error) {
      // Fallback si SplitText échoue
      console.warn('SplitText failed, using simple fade animation', error);
      animation = gsap.from(element, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }

    return () => {
      if (animation) animation.kill();
      if (split && split.revert) split.revert();
    };
  }, [type, stagger, duration, delay, ease, once, y]);

  return elementRef;
}

