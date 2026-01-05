import React, { useEffect, useRef, useState } from 'react';
import useIsomorphicLayoutEffect from '@/hooks/use-isomorphic-layout-effect';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { usePathname } from 'next/navigation';
import { Leaf, UpArrow, UpArrowTwo, RightArrowOutline, LitDoubleIcon, BathroomIcon, KitchenetteIcon, GardeRobeIcon } from '@/components/svg';
import AwardOne from '@/components/award/award-one';
// Widget de recherche Lodgify

// images 
import port_d_1 from '@/assets/img/inner-project/showcase/showcase-details-2-2.jpg';
import port_d_2 from '@/assets/img/inner-project/showcase/showcase-details-2-3.jpg';
import port_d_3 from '@/assets/img/inner-project/showcase/showcase-details-2-4.jpg';
import port_d_4 from '@/assets/img/inner-project/showcase/showcase-details-2-5.jpg';
import port_d_5 from '@/assets/img/inner-project/showcase/showcase-details-2-6.jpg';
import port_d_6 from '@/assets/img/inner-project/showcase/showcase-details-2-7.jpg';
import port_d_7 from '@/assets/img/inner-project/showcase/showcase-details-2-8.jpg';
import port_d_8 from '@/assets/img/inner-project/showcase/showcase-details-2-9.jpg';

import fullwidth_img from '@/assets/img/inner-project/showcase/showcase-details-2-10.jpg';
import fullwidth_img_2 from '@/assets/img/inner-project/showcase/showcase-details-2-13.jpg';
import d_g_img_1 from '@/assets/img/inner-project/showcase/showcase-details-2-11.jpg';
import d_g_img_2 from '@/assets/img/inner-project/showcase/showcase-details-2-12.jpg';
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';

// images des cocons
import cocons_img_1 from '@/assets/img/inner-project/experiences-cocons/cocons-1.jpg';
import cocons_img_2 from '@/assets/img/inner-project/experiences-cocons/cocons-2.jpg';
import cocons_img_3 from '@/assets/img/inner-project/experiences-cocons/cocons-3.jpg';
import cocons_img_4 from '@/assets/img/inner-project/experiences-cocons/cocons-4.jpg';


// img data pour version PC
const img_data = [port_d_1, port_d_2, port_d_3, port_d_4, port_d_5, port_d_6, port_d_7, port_d_8];

// img data pour carrousel mobile (section Évasion)
const mobile_carousel_images = [
  '/assets/img/inner-project/Caroussel pictures/Image 1.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 2.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 3.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 4.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 5.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 6.webp',
  '/assets/img/inner-project/Caroussel pictures/Image 7.webp',
];

// Témoignages (mêmes contenus que la page À propos)
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

const testimonial_slider_setting = {
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

export default function PortfolioDetailsShowcaseTwoArea() {
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const bienEtreRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const lodgifyWidgetRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [widgetKey, setWidgetKey] = useState(0);

  // === Parallaxe optimisée: rAF + désactivation mobile ===
  useIsomorphicLayoutEffect(() => {
    const bg = backgroundRef.current;
    const fg = foregroundRef.current;
    if (!bg || !fg) return;

    const isMobile = window.innerWidth < 992;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    // IMPORTANT: Désactiver sur mobile ET si reduced motion
    if (isMobile || prefersReducedMotion) {
      bg.style.backgroundAttachment = 'scroll';
      fg.style.backgroundAttachment = 'scroll';
      bg.style.transform = 'translateY(0)';
      fg.style.transform = 'translateY(0)';
      return;
    }

    // Configuration desktop avec optimisations GPU
    bg.style.backgroundAttachment = 'scroll';
    fg.style.backgroundAttachment = 'scroll';
    bg.style.willChange = 'transform';
    fg.style.willChange = 'transform';
    (bg.style as any).backfaceVisibility = 'hidden';
    (fg.style as any).backfaceVisibility = 'hidden';

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
        
        // Limiter l'effet de parallaxe pour éviter les transformations excessives
        const maxScroll = 2000;
        const clampedScroll = Math.min(scrolled, maxScroll);
        
        const rateBg = clampedScroll * -0.5;
        const rateFg = clampedScroll * -0.3;
        
        bg.style.transform = `translate3d(0, ${rateBg}px, 0)`;
        fg.style.transform = `translate3d(0, ${rateFg}px, 0)`;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll as any);
      // Nettoyer will-change pour libérer les ressources
      bg.style.willChange = 'auto';
      fg.style.willChange = 'auto';
    };
  }, []);

  // === IntersectionObserver pour mobile hover states ===
  useEffect(() => {
    const isDesktop = window.innerWidth >= 992;
    if (isDesktop) return;
    
    const targets = [bienEtreRef.current, signatureRef.current].filter(
      (el): el is HTMLDivElement => Boolean(el)
    );

    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mobile-hover-active');
          } else {
            entry.target.classList.remove('mobile-hover-active');
          }
        });
      },
      { 
        root: null, 
        threshold: 0.25,
        rootMargin: '-50px' // Trigger un peu avant pour une meilleure expérience
      }
    );

    targets.forEach(t => io.observe(t));
    
    return () => {
      io.disconnect();
    };
  }, []);

  // === Fonction utilitaire pour initialiser le widget Lodgify ===
  const initLodgifyWidget = React.useCallback(() => {
    const widgetElement = lodgifyWidgetRef.current;
    if (!widgetElement) return;

    // Vérifier si le script Lodgify est chargé
    const checkScriptLoaded = () => {
      return typeof window !== 'undefined' && 
             (window as any).renderPortableSearchBar !== undefined;
    };

    // Fonction pour forcer le rechargement du widget
    const forceReloadWidget = () => {
      // Supprimer complètement l'ancien contenu
      widgetElement.innerHTML = '';
      
      // Supprimer tous les attributs data existants
      Array.from(widgetElement.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          widgetElement.removeAttribute(attr.name);
        }
      });
      
      // Réinitialiser les attributs data pour le widget de recherche
      const dataAttributes = {
        'data-website-id': '607668',
        'data-language-code': 'fr',
        'data-search-page-url': 'https://mallen-jallow.lodgify.com/fr/toutes-les-proprietes',
        'data-dates-check-in-label': 'Arrivée',
        'data-dates-check-out-label': 'Départ',
        'data-guests-counter-label': 'Invités',
        'data-guests-input-singular-label': '{{NumberOfGuests}} invité',
        'data-guests-input-plural-label': '{{NumberOfGuests}} invités',
        'data-location-input-label': 'Emplacement',
        'data-search-button-label': 'Rechercher',
        'data-dates-input-min-stay-tooltip-text': '{"one":"Minimum {minStay} nuit","other":"Minimum de {minStay} nuits"}',
        'data-new-tab': 'true',
        'data-version': 'stable'
      };

      Object.entries(dataAttributes).forEach(([key, value]) => {
        if (value !== '') {
          widgetElement.setAttribute(key, value);
        } else {
          widgetElement.setAttribute(key, '');
        }
      });

      // Attendre que le DOM soit prêt puis appeler le script
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            // Appeler la fonction de rendu Lodgify pour le widget de recherche
            if ((window as any).renderPortableSearchBar) {
              (window as any).renderPortableSearchBar();
            }
          } catch (error) {
            console.warn('Erreur lors du rendu du widget Lodgify:', error);
          }
        }, 150);
      });
    };

    // Attendre que le script soit chargé
    const waitForScript = (retries = 30, delay = 100) => {
      if (checkScriptLoaded()) {
        forceReloadWidget();
      } else if (retries > 0) {
        setTimeout(() => waitForScript(retries - 1, delay), delay);
      } else {
        // Si le script n'est pas chargé après plusieurs tentatives, réessayer périodiquement
        const intervalId = setInterval(() => {
          if (checkScriptLoaded()) {
            clearInterval(intervalId);
            forceReloadWidget();
          }
        }, 500);
        
        // Nettoyer après 10 secondes
        setTimeout(() => clearInterval(intervalId), 10000);
      }
    };

    // Démarrer l'attente du script
    waitForScript();
  }, []);

  // === Réinitialisation du widget Lodgify lors de la navigation ===
  useEffect(() => {
    // Incrémenter la clé pour forcer le remontage du widget
    setWidgetKey(prev => prev + 1);

    // Petit délai pour s'assurer que le DOM est prêt
    const timer = setTimeout(() => {
      initLodgifyWidget();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, initLodgifyWidget]);

  // === Réinitialisation du widget au montage du composant ===
  useEffect(() => {
    // Initialiser le widget au montage
    const timer = setTimeout(() => {
      initLodgifyWidget();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [initLodgifyWidget]);

  // === MutationObserver pour détecter l'ajout du widget au DOM ===
  useEffect(() => {
    const widgetElement = lodgifyWidgetRef.current;
    if (!widgetElement) return;

    // Observer les changements dans le widget
    const observer = new MutationObserver((mutations) => {
      // Si le widget est vide ou n'a pas de contenu, réessayer de le charger
      if (widgetElement.children.length === 0 && widgetElement.innerHTML.trim() === '') {
        // Attendre un peu puis réessayer
        setTimeout(() => {
          initLodgifyWidget();
        }, 500);
      }
    });

    observer.observe(widgetElement, {
      childList: true,
      subtree: true,
      attributes: false
    });

    return () => {
      observer.disconnect();
    };
  }, [initLodgifyWidget, widgetKey]);

  return (
    <>
      {/* portfolio hero avec superposition d'images et parallaxe */}
      <div ref={heroRef} className="showcase-details-2-area showcase-details-2-bg p-relative overflow-hidden">
        {/* Image de fond avec parallaxe - Version PC */}
        <div 
          ref={backgroundRef}
          className="hero-background-image p-absolute w-100 h-100 d-none d-lg-block"
          style={{
            backgroundImage: "url(/assets/img/inner-project/Header%20photo/Header%20image%20PC%20Second%20plan.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1
          }}
        />
        {/* Image de fond avec parallaxe - Version Mobile */}
        <div 
          className="hero-background-image p-absolute w-100 h-100 d-block d-lg-none"
          style={{
            backgroundImage: "url(/assets/img/inner-project/Header%20photo/Header%20image%20mobile%20Second%20plan.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1
          }}
        />
        
        {/* Contenu du hero avec textes */}
        <div 
          className="hero-content-wrapper p-relative" 
          style={{
            zIndex: 2, 
             paddingTop: '0px',
            marginTop: 'clamp(-140px, -16vw, -160px)'
          }}
        >
          <div className="showcase-details-2-wrapper" data-lag="0.2" data-stagger="0.08">
            <div className="container container-1550">
                <div className="row">
                  <div className="col-xl-8">
                      <div className="showcase-details-2-title-box">
                        <h5 className="showcase-details-2-title mb-20 tp-char-animation force-visible" style={{
                          whiteSpace: 'nowrap',
                          fontSize: 'clamp(2.2rem, 11vw, 7.8rem)',
                          lineHeight: '0.8',
                          letterSpacing: '0.08em',
                          fontWeight: '700',
                          width: '100vw',
                          maxWidth: '100vw',
                          textAlign: 'left',
                          transform: 'translateX(0)',
                          position: 'relative',
                          zIndex: '1',
                          color: 'white',
                          textTransform: 'uppercase',
                          overflow: 'visible',
                          marginLeft: '0',
                          paddingLeft: '0'
                        }}>
                          IBÙ EXPERIENCE
                        </h5>
                        <span className="showcase-details-2-subtitle tp_title_anim force-visible" style={{
                          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                          lineHeight: '1.3',
                          fontWeight: '400',
                          marginBottom: '20px',
                          display: 'block'
                        }}>L&apos;art de s&apos;évader dans des lieux d&apos;exception</span>
                        <div className="hero-keywords" style={{
                          fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                          color: 'white',
                          fontWeight: '300',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          opacity: '0.9'
                        }}>
                          VIGNOBLE • CHÂTEAU • DOMAINE
                        </div>
                      </div>
                  </div>
                  
                </div>
            </div>
          </div>
        </div>

        {/* Widget Lodgify Search avec style personnalisé */}
        <div 
          className="lodgify-hero-container p-absolute"
          style={{
            width: 'auto',
            maxWidth: '500px',
            pointerEvents: 'auto',
            minWidth: 0
          }}
        >
          {/* Widget de recherche Lodgify */}
          <div
            ref={lodgifyWidgetRef}
            key={`lodgify-widget-${widgetKey}`}
            id="lodgify-search-bar"
            data-website-id="607668"
            data-language-code="fr"
            data-search-page-url="https://mallen-jallow.lodgify.com/fr/toutes-les-proprietes"
            data-dates-check-in-label="Arrivée"
            data-dates-check-out-label="Départ"
            data-guests-counter-label="Invités"
            data-guests-input-singular-label='{{NumberOfGuests}} invité'
            data-guests-input-plural-label='{{NumberOfGuests}} invités'
            data-location-input-label="Emplacement"
            data-search-button-label="Rechercher"
            data-dates-input-min-stay-tooltip-text='{"one":"Minimum {minStay} nuit","other":"Minimum de {minStay} nuits"}'
            data-new-tab="true"
            data-version="stable"
          ></div>
        </div>

        {/* Image PNG au premier plan avec effet parallaxe - Version PC */}
        <div 
          ref={foregroundRef}
          className="hero-foreground-image p-absolute w-100 h-100 d-none d-lg-block"
          style={{
            backgroundImage: "url(/assets/img/inner-project/Header%20photo/Header%20image%20PC%20premier%20plan.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            zIndex: 3,
            pointerEvents: "none"
          }}
        />
        {/* Image PNG au premier plan avec effet parallaxe - Version Mobile */}
        <div 
          className="hero-foreground-image p-absolute w-100 h-100 d-block d-lg-none"
          style={{
            backgroundImage: "url(/assets/img/inner-project/Header%20photo/Header%20image%20mobile%20premier%20plan.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            zIndex: 3,
            pointerEvents: "none"
          }}
        />


      </div>
      {/* portfolio hero */}

      {/* details title avec galerie intégrée */}
      <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation" style={{
                        whiteSpace: 'nowrap',
                        fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                        lineHeight: '1.1',
                        letterSpacing: 'clamp(0.05em, 0.5vw, 0.08em)'
                      }}>IBÙ EXPERIENCE</h4>
                  </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3">
                  <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Évasion
                      </span>
                  </div>
                </div>
                <div className="col-xl-9">
                  <div className="showcase-details-2-section-right tp_title_anim">
                      <p>Dormez en pleine nature, nichés dans des vignobles, châteaux et autres lieux d&apos;exception, à travers la Belgique. Nos Cocons au design minimaliste et confortable vous accueillent pour une expérience hors du temps, entre élégance, bien-être et gastronomie locale, à vivre avec ceux que vous aimez.</p>
                  </div>
                </div>
            </div>
          </div>
          
          {/* Version PC - moving gallery */}
          <div className="moving-gallery d-none d-lg-block" style={{marginTop: '120px'}}>
            <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-top d-flex align-items-end mb-20">
              {img_data.slice(0,4).map((imgSrc,i) => (
                <div key={i} className="showcase-details-2-slider-item">
                  <Image src={imgSrc} alt="port-img" style={{height:"auto"}}/>
                </div>
              ))}
            </div>
          </div>

          <div className="moving-gallery d-none d-lg-block">
            <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-bottom d-flex align-items-start">
              {img_data.slice(4,8).map((imgSrc,i) => (
                <div key={i} className="showcase-details-2-slider-item">
                  <Image src={imgSrc} alt="port-img" style={{height:"auto"}}/>
                </div>
              ))}
            </div>
          </div>

          {/* Version Mobile - Carrousel pleine largeur */}
          <div className="d-block d-lg-none" style={{
            marginTop: '60px',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            width: '100vw'
          }}>
            <Swiper
              slidesPerView={1}
              centeredSlides={true}
              spaceBetween={0}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet evasion-mobile-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active evasion-mobile-bullet-active',
              }}
              modules={[Autoplay, Pagination]}
              className="evasion-mobile-carousel"
              style={{
                padding: '0 0 40px 0'
              }}
            >
              {mobile_carousel_images.map((imgSrc, i) => (
                <SwiperSlide key={i}>
                  <div className="evasion-mobile-item" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <Image 
                      src={imgSrc} 
                      alt={`Évasion IBÙ - Image ${i + 1}`}
                      width={500}
                      height={400}
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
      </div>
      {/* details title avec galerie intégrée */}

      {/* Awards section - The Program */}
      <div className="tp-award-wrapper">
        <AwardOne cls="pt-120 pb-250" />
      </div>
      {/* Awards section */}

      {/* full width image */}
      <div className="showcase-details-2-fullwidth-img program-photo-spacing">
          <Image data-speed=".8" src={fullwidth_img} alt="fullwidth_img" style={{height:'auto'}}/>
      </div>
      {/* full width image */}

      {/* detail title 3 */}
      <div className="showcase-details-2-area pt-120 pb-120">
          <div className="container">
            <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Notre Approche.</h4>
                  </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3">
                  <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Mission
                      </span>
                  </div>
                </div>
                <div className="col-xl-9">
                  <div className="showcase-details-2-content-right tp_title_anim">
                      <p>IBÙ offre la chance de séjourner au cœur de domaines d&apos;exception en Belgique, en valorisant leur patrimoine, leurs produits et leur savoir-faire.</p>
                      <p>Nous créons des expériences uniques qui allient hébergement raffiné et immersion dans des lieux emblématiques, pour sublimer le terroir local.</p>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* detail title 3 */}

      {/* grid images */}
      <div className="showcase-details-2-grid-area pb-90 grid-before-engagements after-mission-photos">
          <div className="container">
            <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                      <Image className="img-left" src={d_g_img_1} alt="details-img" style={{height:'auto'}}/>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <div className="showcase-details-2-grid-img mb-30">
                      <Image className="img-right" src={d_g_img_2} alt="details-img" style={{height:'auto'}}/>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* grid images */}

             {/* Section fusionnée : Engagements + Nos Formules */}
       <div className="showcase-details-2-area pt-60 pb-120 engagements-section">
           <div className="container">
             {/* Section Engagements */}
             <div className="row">
                 <div className="col-xl-3">
                   <div className="showcase-details-2-section-left">
                       <span className="ab-inner-subtitle mb-25">
                         <Leaf/>
                         Engagements
                       </span>
                   </div>
                 </div>
                 <div className="col-xl-9">
                   <div className="showcase-details-2-content-right tp_title_anim">
                       <p style={{marginBottom: '60px'}}>Nos hébergements allient respect de l&apos;environnement, circuits courts et harmonie avec la nature. Conçus avec des matériaux durables, ils valorisent les producteurs locaux et intègrent des solutions éco-énergétiques pour offrir une expérience authentique et responsable..</p>
                   </div>
                 </div>
             </div>
             
             {/* Section Nos Cocons intégrée */}
             <div className="row" style={{marginTop: '60px'}}>
                 <div className="col-xl-8">
                   <div className="showcase-details-2-section-box">
                       <h4 className="showcase-details-2-section-title tp-char-animation">NOS COCONS</h4>
                   </div>
                 </div>
             </div>
             <div className="row">
                 <div className="col-xl-3">
                   <div className="showcase-details-2-section-left">
                       <span className="ab-inner-subtitle mb-25">
                         <Leaf/>
                         Immersion naturelle
                       </span>
                   </div>
                 </div>
                 <div className="col-xl-9">
                   <div className="showcase-details-2-content-right tp_title_anim">
                       <p>Conçus dans un esprit minimaliste et chaleureux, nos pods offrent une immersion totale dans la nature sans compromis sur le confort : lit double avec baie vitrée panoramique, douche design, et toilettes sèches de nouvelle génération.</p>
                       <p style={{marginBottom: '50px'}}>Pour prolonger l&apos;expérience, profitez d&apos;options bien-être en extérieur : sauna et bain nordique avec vue imprenable sur le domaine, en toute intimité.</p>
                   </div>
                 </div>
             </div>
             
             {/* Images des cocons - Version PC */}
             <div className="row d-none d-lg-flex" style={{marginTop: '40px', marginBottom: '40px'}}>
                 <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_1} alt="cocons-img-1" style={{height:'auto'}}/>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_2} alt="cocons-img-2" style={{height:'auto'}}/>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_3} alt="cocons-img-3" style={{height:'auto'}}/>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3">
                    <div className="showcase-details-2-grid-img mb-30 cocons-hover-container">
                        <Image src={cocons_img_4} alt="cocons-img-4" style={{height:'auto'}}/>
                    </div>
                  </div>
             </div>

             {/* Images des cocons - Version Mobile Carrousel */}
             <div className="d-block d-lg-none" style={{marginTop: '40px', marginBottom: '40px'}}>
               <Swiper
                 slidesPerView={1}
                 centeredSlides={true}
                 spaceBetween={20}
                 loop={true}
                 autoplay={{
                   delay: 4000,
                   disableOnInteraction: false,
                 }}
                 pagination={{
                   clickable: true,
                   bulletClass: 'swiper-pagination-bullet cocons-mobile-bullet',
                   bulletActiveClass: 'swiper-pagination-bullet-active cocons-mobile-bullet-active',
                 }}
                 modules={[Autoplay, Pagination]}
                 className="cocons-mobile-carousel"
                 style={{
                   padding: '0 20px 40px 20px'
                 }}
               >
                 {[cocons_img_1, cocons_img_2, cocons_img_3, cocons_img_4].map((imgSrc, i) => (
                   <SwiperSlide key={i}>
                     <div className="cocons-mobile-item" style={{
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center'
                     }}>
                       <Image 
                         src={imgSrc} 
                         alt="Nos Cocons IBÙ" 
                         style={{
                           width: '100%',
                           maxWidth: '350px',
                           height: '280px',
                           objectFit: 'cover'
                         }}
                       />
                     </div>
                   </SwiperSlide>
                 ))}
               </Swiper>
             </div>
             
             {/* Icônes des cocons - Version PC */}
             <div className="row d-none d-lg-flex" style={{marginTop: '40px', marginBottom: '60px'}}>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <LitDoubleIcon />
                       </div>
                       <h6 className="cocon-feature-title">Lit double</h6>
                   </div>
                 </div>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <BathroomIcon />
                       </div>
                       <h6 className="cocon-feature-title">Salle de bain</h6>
                   </div>
                 </div>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <KitchenetteIcon />
                       </div>
                       <h6 className="cocon-feature-title">Kitchenette</h6>
                   </div>
                 </div>
                 <div className="col-xl-3 col-lg-3">
                   <div className="cocon-feature-item text-center">
                       <div className="cocon-icon-wrapper mb-20">
                           <GardeRobeIcon />
                       </div>
                       <h6 className="cocon-feature-title">Garde robe</h6>
                   </div>
                 </div>
             </div>

             {/* Icônes des cocons - Version Mobile (2x2) */}
             <div className="d-block d-lg-none" style={{marginTop: '40px', marginBottom: '60px'}}>
               <div className="row">
                 {/* Première ligne : Lit double + Salle de bain */}
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <LitDoubleIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Lit double</h6>
                   </div>
                 </div>
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <BathroomIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Salle de bain</h6>
                   </div>
                 </div>
               </div>
               
               <div className="row" style={{marginTop: '30px'}}>
                 {/* Deuxième ligne : Kitchenette + Garde robe */}
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <KitchenetteIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Kitchenette</h6>
                   </div>
                 </div>
                 <div className="col-6">
                   <div className="cocon-feature-item text-center">
                     <div className="cocon-icon-wrapper mb-15">
                       <GardeRobeIcon />
                     </div>
                     <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>Garde robe</h6>
                   </div>
                 </div>
               </div>
             </div>
           </div>
       </div>
       {/* details title 5 */}

      {/* Section Ils nous soutiennent + avis clients (même logique que page À propos) */}
      <div className="tp-testimonial-area pb-120 pt-120 ils-nous-soutiennent-section">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="showcase-details-2-section-box mb-60">
                <h4 className="showcase-details-2-section-title ils-nous-soutiennent-title" style={{
                  fontSize: 'clamp(60px, 10vw, 150px)',
                  lineHeight: '1.1',
                  maxWidth: '100%',
                  width: '100%'
                }}>Ils nous soutiennent</h4>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="tp-testimonial-slider-wrapper p-relative">
                {/* Flèches desktop */}
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

                {/* Flèches mobile */}
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



      {/* Styles consolidés */}
      <style jsx>{`
        /* Optimisations pour les performances du hero */
        .hero-background-image,
        .hero-foreground-image {
          will-change: transform;
          contain: layout paint size;
          transform: translateZ(0);
        }
        
        /* Réduire l'espace entre "Le Programme" et la photo sur mobile */
        @media (max-width: 991px) {
          /* Forcer un espacement au-dessus du titre pour éviter qu'il ne passe sous la section précédente */
          .tp-award-wrapper {
            padding-top: 8px !important;
            margin-top: 0 !important;
          }
          .tp-award-wrapper :global(.tp-award-area) {
            padding-top: 12px !important;
            padding-bottom: 28px !important;
            margin-top: 0 !important;
          }
          /* Décaler le bloc titre pour éviter toute découpe visuelle */
          .tp-award-wrapper :global(.tp-award-title-box) {
            margin-top: 4px !important;
            padding-top: 0 !important;
          }
          /* Garantir que le titre "L'instant IBÙ" s'affiche sur mobile */
          .tp-award-wrapper :global(.tp-award-title-box),
          .tp-award-wrapper :global(.tp-award-title-box h4),
          .tp-award-wrapper :global(.tp-award-title-box .showcase-details-2-section-title) {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-size: clamp(3rem, 9vw, 4.6rem) !important;
            line-height: 1.05 !important;
            letter-spacing: 0.02em !important;
          }
          
          /* Réduire drastiquement le padding-bottom de la section Awards */
          .tp-award-wrapper :global(.tp-award-area) {
            padding-bottom: 28px !important;
            margin-bottom: 0 !important;
          }
          
          /* Garder la photo complète sans découpe - retirer la marge négative */
          .program-photo-spacing {
            margin-top: 0 !important;
            padding-top: 40px !important;
          }
          
          /* Garantir que l'image garde sa taille originale et ne se coupe pas */
          .showcase-details-2-fullwidth-img {
            overflow: visible !important;
          }
          
          .showcase-details-2-fullwidth-img img {
            width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            object-position: center top !important;
            max-height: none !important;
          }
          
          /* Réduire de moitié l'espace entre les photos et "Engagements" */
          .grid-before-engagements {
            padding-bottom: 45px !important; /* 90px / 2 */
          }
          
          .engagements-section {
            padding-top: 30px !important; /* 60px / 2 */
          }
          
          /* Réduire l'espace entre "sublimer le terroir local" et les photos sur mobile */
          .after-mission-photos {
            margin-top: -80px !important;
          }
        }
        
        @media (max-width: 768px) {
          .showcase-details-2-title {
            white-space: normal !important;
          }
          
          /* Encore plus de remontée sur petits mobiles */
          .tp-award-wrapper :global(.tp-award-area) {
            padding-top: 10px !important;
            padding-bottom: 22px !important;
            margin-bottom: 0 !important;
          }
          
          .program-photo-spacing {
            margin-top: 0 !important;
            padding-top: 40px !important;
          }
          
          /* Garantir que l'image garde sa taille originale et ne se coupe pas sur petits écrans */
          .showcase-details-2-fullwidth-img img {
            width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
            object-position: center top !important;
            max-height: none !important;
          }
          
          /* Réduire de moitié l'espace entre les photos et "Engagements" */
          .grid-before-engagements {
            padding-bottom: 45px !important; /* 90px / 2 */
          }
          
          .engagements-section {
            padding-top: 30px !important; /* 60px / 2 */
          }
        }
        
        
        @media (max-width: 991px) {
          .showcase-hover-container.mobile-hover-active .showcase-hover-text {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
          }
          
          .showcase-hover-container.mobile-hover-active .showcase-image-link::before {
            opacity: 0.8 !important;
          }
        }
        
        .cocons-mobile-carousel .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #ccc !important;
          opacity: 0.5 !important;
          margin: 0 4px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .cocons-mobile-carousel .swiper-pagination-bullet-active {
          background: #053725 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        
        .evasion-mobile-carousel .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #ccc !important;
          opacity: 0.5 !important;
          margin: 0 4px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .evasion-mobile-carousel .swiper-pagination-bullet-active {
          background: #053725 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
        
        /* Ajustement mobile pour le hero - descendre le bloc de texte */
        @media (max-width: 991px) {
          .hero-content-wrapper {
            margin-top: clamp(-40px, -5vw, -60px) !important;
            z-index: 100 !important; /* Au-dessus du widget sur mobile */
            position: relative !important;
            pointer-events: none !important; /* Permet les interactions avec le widget en dessous */
          }
          /* S'assurer que le texte est au-dessus du widget mais n'empêche pas les interactions */
          .showcase-details-2-title-box,
          .showcase-details-2-title,
          .showcase-details-2-subtitle,
          .hero-keywords {
            position: relative !important;
            z-index: 101 !important; /* Au-dessus du contenu wrapper */
            pointer-events: none !important; /* Permet les interactions avec le widget en dessous */
          }
          /* Réactiver pointer-events pour les liens si nécessaire */
          .showcase-details-2-title-box a,
          .showcase-details-2-title a {
            pointer-events: auto !important;
          }
          /* Désactiver l'effet parallax sur mobile pour éviter les saccades */
          .showcase-details-2-fullwidth-img img {
            transform: none !important;
            will-change: auto !important;
          }
          .showcase-details-2-fullwidth-img {
            transform: none !important;
            will-change: auto !important;
          }
        }
        
        /* Styles pour le widget Lodgify dans le hero */
        .lodgify-hero-container {
          /* Positionnement par défaut - PC */
          z-index: 10; /* Au-dessus de l'image premier plan (z-index 3) sur PC */
          box-sizing: border-box !important;
        }
        
        /* Empêcher le widget de dépasser à gauche du viewport */
        .lodgify-hero-container #lodgify-search-bar {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        @media (min-width: 769px) {
          .lodgify-hero-container {
            width: auto !important;
            max-width: 600px !important;
            min-width: 0 !important;
            z-index: 10 !important;
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
        }
        
        @media (max-width: 768px) {
          /* Surcharger le fichier ibu-bien-etre-mobile-fix.css avec une spécificité très élevée */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container,
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container {
            top: 60% !important; /* Position ajustée - remonté encore */
            left: 5% !important;
            width: 90% !important;
            max-width: 90% !important;
            right: 5% !important;
            z-index: 4 !important; /* Au-dessus de l'image premier plan (z-index 3) mais en dessous du texte (z-index 100+) */
            pointer-events: auto !important; /* Permet les interactions avec le widget */
          }
          /* S'assurer que le widget lui-même accepte les interactions */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box),
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box) {
            pointer-events: auto !important;
          }
        }
        
        /* Styles CSS pour le widget de booking Lodgify dans le hero - Background blanc réduit */
        .lodgify-hero-container :global(#lodgify-book-now-box) {
          --ldg-bnb-background: #ffffff !important;
          --ldg-bnb-border-radius: 0.42em !important;
          --ldg-bnb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1) !important;
          --ldg-bnb-padding: 14px !important;
          --ldg-bnb-input-background: #ffffff !important;
          --ldg-bnb-button-border-radius: 0px !important;
          --ldg-bnb-color-primary: #053701 !important;
          --ldg-bnb-color-primary-lighter: #829b80 !important;
          --ldg-bnb-color-primary-darker: #031c01 !important;
          --ldg-bnb-color-primary-contrast: #ffffff !important;
          --ldg-component-calendar-cell-selection-bg-color: #053701 !important;
          --ldg-component-calendar-cell-selection-color: #ffffff !important;
          --ldg-component-calendar-cell-selected-bg-color: #829b80 !important;
          --ldg-component-calendar-cell-selected-color: #ffffff !important;
          --ldg-bnb-font-family: inherit !important;
          /* Background blanc mais largeur réduite pour moins d'espace à gauche/droite */
          background: #ffffff !important;
          box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1) !important;
          padding: 14px !important;
          border-radius: 0.42em !important;
          width: fit-content !important;
          min-width: 300px !important;
          max-width: 450px !important;
          box-sizing: border-box !important;
          display: block !important;
          margin: 0 auto !important;
        }
        
        /* S'assurer que le conteneur parent ne crée pas d'espace supplémentaire */
        .lodgify-hero-container {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Sur PC : aligner le widget à gauche avec le texte du conteneur - Descendre pour éviter chevauchement */
        @media (min-width: 1400px) {
          .lodgify-hero-container {
            left: max(30px, calc((100vw - 1550px) / 2 + 15px)) !important;
            top: 60% !important;
            transform: translateY(-50%) !important;
            margin-left: 0 !important;
          }
        }
        
        @media (min-width: 992px) and (max-width: 1399px) {
          .lodgify-hero-container {
            left: max(30px, 3%) !important;
            top: 60% !important;
            transform: translateY(-50%) !important;
            margin-left: 0 !important;
          }
        }
        
        /* Sur mobile : centrer le widget - Position ajustée pour éviter chevauchement */
        @media (max-width: 991px) {
          /* Surcharger le fichier ibu-bien-etre-mobile-fix.css avec une spécificité très élevée */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container,
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container {
            left: 50% !important;
            top: 60% !important; /* Position ajustée - remonté encore */
            z-index: 4 !important; /* Au-dessus de l'image premier plan (z-index 3) mais en dessous du texte (z-index 100+) */
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 450px !important;
            pointer-events: auto !important; /* Permet les interactions avec le widget */
          }
          /* S'assurer que le widget lui-même accepte les interactions */
          .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box),
          body .showcase-details-2-area.showcase-details-2-bg .lodgify-hero-container :global(#lodgify-book-now-box) {
            pointer-events: auto !important;
          }
        }
        
        /* Enlever les marges/paddings des éléments internes qui créent de l'espace */
        .lodgify-hero-container :global(#lodgify-book-now-box) > * {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        
        .lodgify-hero-container :global(#lodgify-book-now-box) > *:first-child {
          margin-top: 0 !important;
        }
        
        .lodgify-hero-container :global(#lodgify-book-now-box) > *:last-child {
          margin-bottom: 0 !important;
        }
        
        /* Annuler les styles globaux qui suppriment les bordures */
        .lodgify-hero-container :global(#lodgify-book-now-box input[type="number"]),
        .lodgify-hero-container :global(#lodgify-book-now-box .number-input),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-counter),
        .lodgify-hero-container :global(#lodgify-book-now-box .price-display),
        .lodgify-hero-container :global(#lodgify-book-now-box .total-price),
        .lodgify-hero-container :global(#lodgify-book-now-box .minimum-price),
        .lodgify-hero-container :global(#lodgify-book-now-box .price-amount),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-count) {
          border: initial !important;
          outline: initial !important;
          box-shadow: initial !important;
          background: initial !important;
        }
        
        /* Annuler les styles globaux pour les champs de dates */
        .lodgify-hero-container :global(#lodgify-book-now-box input[type="text"]),
        .lodgify-hero-container :global(#lodgify-book-now-box input[type="date"]),
        .lodgify-hero-container :global(#lodgify-book-now-box select) {
          background: #ffffff !important;
          border: 1px solid #ddd !important;
          border-radius: 4px !important;
          box-shadow: none !important;
        }
        
        /* Annuler les styles globaux pour les conteneurs d'invités */
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-selector),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-counter-container),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-input-container),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-field),
        .lodgify-hero-container :global(#lodgify-book-now-box .guest-wrapper) {
          border: initial !important;
          box-shadow: initial !important;
          background: initial !important;
        }
        
        /* Annuler les styles globaux pour les conteneurs de dates */
        .lodgify-hero-container :global(#lodgify-book-now-box .date-selector),
        .lodgify-hero-container :global(#lodgify-book-now-box .date-container),
        .lodgify-hero-container :global(#lodgify-book-now-box .date-field),
        .lodgify-hero-container :global(#lodgify-book-now-box .date-wrapper) {
          border: initial !important;
          border-radius: initial !important;
          background: initial !important;
          box-shadow: initial !important;
        }
        
        /* Annuler les styles globaux pour les boutons +/- */
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="plus"]),
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="moins"]),
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="increase"]),
        .lodgify-hero-container :global(#lodgify-book-now-box button[aria-label*="decrease"]),
        .lodgify-hero-container :global(#lodgify-book-now-box .increment-button),
        .lodgify-hero-container :global(#lodgify-book-now-box .decrement-button) {
          border: initial !important;
          outline: initial !important;
          box-shadow: initial !important;
          background: initial !important;
          border-radius: initial !important;
        }
        /* Espacement pour la section Ils nous soutiennent */
        .ils-nous-soutiennent-section {
          background: #ffffff;
          margin-top: 0 !important;
          padding-top: 80px !important;
          padding-bottom: 20px !important;
        }
        
        /* Style responsive pour "Ils nous soutiennent" - override GSAP animations */
        .ils-nous-soutiennent-title {
          font-size: clamp(60px, 10vw, 150px) !important;
          line-height: 1.1 !important;
          max-width: 100% !important;
          width: 100% !important;
          word-wrap: break-word !important;
          hyphens: none !important;
        }
      `}</style>
    </>
  )
}
