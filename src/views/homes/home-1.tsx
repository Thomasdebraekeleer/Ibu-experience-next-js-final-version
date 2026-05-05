'use client';
import { gsap } from "gsap";
import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";

import useScrollSmooth from '@/hooks/use-scroll-smooth';
import useIsomorphicLayoutEffect from '@/hooks/use-isomorphic-layout-effect';
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from '@/plugins';
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderHomepage from "@/layouts/headers/header-homepage";
import PortfolioDetailsShowcaseTwoArea from "@/components/portfolio/details/portfolio-details-showcase-2-area";
import FooterThree from "@/layouts/footers/footer-three";
import NewsletterPopup from "@/components/modal/newsletter-popup";

// animation
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { movingImageSlider } from "@/utils/scroll-marque";

/**
 * Page d'accueil principale
 * OPTIMISATIONS:
 * - Initialisation des animations uniquement après le mount du DOM
 * - Gestion propre du cycle de vie des animations
 * - Nettoyage approprié pour éviter les fuites mémoire
 * - Fallback CSS pour assurer la visibilité du contenu
 */
const HomeMain = () => {
  const [isReady, setIsReady] = useState(false);
  
  // Initialiser le smooth scroll
  useScrollSmooth();

  // Classes de body pour le cursor et le style de page
  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    document.body.classList.add("home-page");
    
    return () => {
      document.body.classList.remove("tp-magic-cursor");
      document.body.classList.remove("home-page");
    };
  }, []);

  // Initialiser le cursor custom (uniquement desktop)
  useEffect(() => {
    const isMobile = window.innerWidth < 992;
    if (!isMobile && document.querySelector('.tp-magic-cursor')) {
      try {
        cursorAnimation();
      } catch (error) {
        console.warn('Cursor animation failed:', error);
      }
    }
  }, []);

  // Marquer comme prêt après le premier render
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Initialiser les animations UNIQUEMENT après que le DOM soit prêt
  useIsomorphicLayoutEffect(() => {
    if (!isReady) return;

    // Attendre que tous les éléments soient dans le DOM
    const initAnimations = () => {
      try {
        // Ordre important: d'abord les animations de texte, puis les interactions
        charAnimation();
        titleAnimation();
        movingImageSlider();
        hoverBtn();
        footerTwoAnimation();

        console.log('✅ Animations initialisées avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation des animations:', error);
        // Les fallbacks CSS garantissent que le contenu reste visible
      }
    };

    // requestAnimationFrame pour s'assurer que le layout est calculé
    const rafId = requestAnimationFrame(() => {
      // Petit délai pour laisser le DOM se stabiliser
      const timerId = setTimeout(initAnimations, 50);
      
      // Cleanup
      return () => {
        clearTimeout(timerId);
      };
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isReady]);


  return (
    <Wrapper showBackToTop={false}>

      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}


      {/* header area start */}
      <HeaderHomepage />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            
            {/* portfolio showcase details area */}
            <PortfolioDetailsShowcaseTwoArea />
            {/* portfolio showcase details area */}

          </main>

          {/* footer area */}
          <FooterThree />
          {/* footer area */}
        </div>
      </div>
      
      {/* Newsletter Popup */}
      <NewsletterPopup />
    </Wrapper>
  );
};

export default HomeMain;