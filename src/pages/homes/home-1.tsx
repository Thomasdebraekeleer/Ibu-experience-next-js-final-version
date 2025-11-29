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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { SwiperOptions } from "swiper/types";

// animation
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { movingImageSlider } from "@/utils/scroll-marque";

// Testimonial data
const testimonial_data = [
  {
    id: 1,
    desc: `"Touchée par votre projet et les valeurs qu'il met en exergue, je vous félicite pour cette initiative ! Bonne chance et beaucoup de succès dans cette aventure !"`,
    name: "Sophie Levecq",
    designation: "",
  },
  {
    id: 2,
    desc: `"Super idée, le début d'une grande aventure! Tout notre soutien"`,
    name: "Evelyne Delmotte",
    designation: "",
  },
  {
    id: 3,
    desc: `"Magnifique initiative et qui porte le nom d'un homme génial qui nous manque."`,
    name: "Veronica Britom",
    designation: "",
  },
  {
    id: 4,
    desc: `"Bravo pour ce super projet"`,
    name: "Justine Raskin",
    designation: "",
  },
  {
    id: 5,
    desc: `"Hâte que ce magnifique projet, prenne 100% vie! Il en vaut largement la peine"`,
    name: "Sophie Ileka",
    designation: "",
  },
  {
    id: 6,
    desc: `"Quel projet magnifique!!!"`,
    name: "Debo Landroux",
    designation: "",
  },
];

// Slider settings
const testimonial_slider_setting: SwiperOptions = {
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  speed: 1000,
  navigation: {
    nextEl: ".tp-testimonial-next",
    prevEl: ".tp-testimonial-prev",
  },
};

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

            {/* Section Témoignages */}
            <div className="tp-testimonial-area pb-120 pt-120">
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box mb-60">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Ils nous soutiennent</h4>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-xl-10">
                    <div className="tp-testimonial-slider-wrapper p-relative">
                      {/* Flèches pour desktop - positionnées sur les côtés */}
                      <div className="tp-testimonial-arrow-box d-none d-lg-block">
                        <button className="tp-testimonial-prev" style={{
                          background: 'transparent',
                          border: '2px solid #053725',
                          color: '#053725',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}>
                          ←
                        </button>
                        <button className="tp-testimonial-next" style={{
                          background: 'transparent',
                          border: '2px solid #053725',
                          color: '#053725',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}>
                          →
                        </button>
                      </div>
                      <Swiper
                        {...testimonial_slider_setting}
                        modules={[Navigation]}
                        className="swiper-container tp-testimonial-slider-active fix"
                      >
                        {testimonial_data.map((item) => (
                          <SwiperSlide key={item.id}>
                            <div className="tp-testimonial-item text-center">
                              <p>{item.desc}</p>
                              <span>
                                <em>{item.name}</em>{item.designation && ` - ${item.designation}`}
                              </span>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {/* Flèches pour mobile - positionnées en dessous */}
                      <div className="tp-testimonial-arrow-box-mobile d-lg-none" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '30px'
                      }}>
                        <button className="tp-testimonial-prev" style={{
                          background: 'transparent',
                          border: '2px solid #053725',
                          color: '#053725',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          position: 'static',
                          transform: 'none'
                        }}>
                          ←
                        </button>
                        <button className="tp-testimonial-next" style={{
                          background: 'transparent',
                          border: '2px solid #053725',
                          color: '#053725',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          position: 'static',
                          transform: 'none'
                        }}>
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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