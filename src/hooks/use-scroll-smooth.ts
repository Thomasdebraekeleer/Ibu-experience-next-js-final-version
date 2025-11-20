"use client";
import { gsap } from "gsap";
import { useEffect } from "react";
import { ScrollSmoother } from '@/plugins';
import useIsomorphicLayoutEffect from './use-isomorphic-layout-effect';

/**
 * Hook pour activer le smooth scroll (scroll fluide)
 * Optimisé pour la performance et désactivé sur mobile pour éviter les saccades
 * 
 * IMPORTANT: Désactiver sur mobile améliore considérablement les performances
 */
export default function useScrollSmooth() {
  useIsomorphicLayoutEffect(() => {
    // Vérifier si on est sur mobile
    const isMobile = window.innerWidth < 992;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ne pas activer le smooth scroll sur mobile/tablette ou si reduced motion
    if (isMobile || isTablet || prefersReducedMotion) {
      console.log('Smooth scroll désactivé sur mobile/tablette pour meilleures performances');
      return;
    }

    const smoothWrapper = document.getElementById("smooth-wrapper");
    const smoothContent = document.getElementById("smooth-content");

    if (!smoothWrapper || !smoothContent) {
      console.warn('smooth-wrapper ou smooth-content introuvable');
      return;
    }

    gsap.config({
      nullTargetWarn: false,
    });

    let smoother: any;

    try {
      smoother = ScrollSmoother.create({
        wrapper: smoothWrapper,
        content: smoothContent,
        smooth: 1.5, // Réduit de 2 à 1.5 pour plus de réactivité
        effects: true,
        smoothTouch: false, // Désactivé complètement sur touch pour éviter conflits
        normalizeScroll: false,
        ignoreMobileResize: true,
      });

      console.log('ScrollSmoother initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de ScrollSmoother:', error);
    }

    // Cleanup
    return () => {
      if (smoother) {
        try {
          smoother.kill();
        } catch (e) {
          console.warn('Erreur lors du cleanup de ScrollSmoother:', e);
        }
      }
    };
  }, []);

  // Désactiver le smooth scroll temporairement pendant le resize sur desktop
  useEffect(() => {
    const isMobile = window.innerWidth < 992;
    if (isMobile) return;

    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Refresh ScrollSmoother après resize
        const smoother = (ScrollSmoother as any).get();
        if (smoother) {
          smoother.refresh();
        }
      }, 250);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize as any);
      clearTimeout(resizeTimer);
    };
  }, []);
}
