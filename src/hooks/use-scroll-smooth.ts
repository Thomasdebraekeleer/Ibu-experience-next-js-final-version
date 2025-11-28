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
    // Vérifier si on est sur mobile ou en mode DevTools mobile
    const isMobile = window.innerWidth < 992;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Détecter si on est en mode DevTools (simulation mobile sur desktop)
    const isDevToolsMobile = isMobile && !('ontouchstart' in window) && navigator.maxTouchPoints === 0;

    // Ne pas activer le smooth scroll sur mobile/tablette ou si reduced motion
    // OU si on est en mode DevTools mobile (pour permettre le scroll dans l'inspecteur)
    if (isMobile || isTablet || prefersReducedMotion) {
      console.log('Smooth scroll désactivé:', { 
        isMobile, 
        isTablet, 
        prefersReducedMotion,
        isDevToolsMobile,
        reason: isDevToolsMobile ? 'DevTools mobile mode' : 'Mobile/Tablet device'
      });
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

  // Gérer le resize dynamique (important pour DevTools responsive mode)
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    let lastWidth = window.innerWidth;
    let wasDesktop = window.innerWidth >= 992;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const isNowDesktop = currentWidth >= 992;
        const isNowMobile = currentWidth < 992;
        
        // Si on passe de desktop à mobile (ex: ouverture DevTools en mode mobile)
        if (wasDesktop && isNowMobile) {
          console.log('🔄 Passage en mode mobile détecté - Désactivation du ScrollSmoother');
          const smoother = (ScrollSmoother as any).get();
          if (smoother) {
            smoother.kill();
            // Restaurer le scroll natif
            document.body.style.overflow = '';
            const wrapper = document.getElementById("smooth-wrapper");
            const content = document.getElementById("smooth-content");
            if (wrapper) wrapper.style.overflow = '';
            if (content) content.style.transform = '';
          }
        }
        
        // Si on passe de mobile à desktop (ex: fermeture DevTools)
        if (!wasDesktop && isNowDesktop) {
          console.log('🔄 Passage en mode desktop détecté - Réinitialisation du ScrollSmoother');
          const smoother = (ScrollSmoother as any).get();
          if (smoother) {
            smoother.refresh();
          } else {
            // Réinitialiser si nécessaire
            window.location.reload();
          }
        }
        
        // Si on reste en desktop, juste refresh
        if (wasDesktop && isNowDesktop) {
          const smoother = (ScrollSmoother as any).get();
          if (smoother) {
            smoother.refresh();
          }
        }
        
        lastWidth = currentWidth;
        wasDesktop = isNowDesktop;
      }, 250);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize as any);
      clearTimeout(resizeTimer);
    };
  }, []);
}
