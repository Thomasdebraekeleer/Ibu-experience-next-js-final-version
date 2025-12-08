'use client';
import { gsap } from "gsap";
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from '@/plugins';
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";
import Image from "next/image";
import { Leaf } from '@/components/svg';
import KultKefirLogo from '@/components/svg/KultKefirLogo';
import SupernovaLogo from '@/components/svg/SupernovaLogo';

// image imports
import histoire_famille_img from '@/assets/img/inner-project/A propos/Une histoire de famille.jpg';


// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";
import VideoTwo from "@/components/video/video-two";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import startlab_logo from "@/assets/img/inner-project/Press/Logo StarLab Brussels.png";
import parallax_img from "@/assets/img/inner-project/A propos/A propos parrallax image.jpg";
import { UpArrow } from '@/components/svg';


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

const AboutMain = () => {
  useScrollSmooth();
  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    }
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined' && document.querySelector('.tp-magic-cursor')) {
      cursorAnimation();
    }
  },[]);

  // Correction du problème de taille du titre lors de la navigation
  useEffect(() => {
    const fixTitleSize = () => {
      const titleElement = document.querySelector('h4.showcase-details-2-section-title') as HTMLElement;
      if (titleElement && titleElement.textContent?.includes('UNE HISTOIRE DE FAMILLE')) {
        const style = titleElement.style;
        style.setProperty('font-size', 'clamp(3.5rem, 7vw, 5.5rem)', 'important');
        style.setProperty('line-height', '1.2', 'important');
        style.setProperty('max-width', 'none', 'important');
        style.setProperty('width', '100%', 'important');
      }
    };

    // Appliquer immédiatement
    fixTitleSize();
    
    // Appliquer après un délai court pour s'assurer que les animations GSAP sont terminées
    const timer = setTimeout(fixTitleSize, 100);
    const timer2 = setTimeout(fixTitleSize, 500);
    const timer3 = setTimeout(fixTitleSize, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      titleAnimation();
      imageRevealAnimation();
      hoverBtn();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper showBackToTop={false}>
      {/* Style fix pour le titre "UNE HISTOIRE DE FAMILLE" et alignement photo */}
      <style jsx global>{`
        .showcase-details-2-section-title:has-text("UNE HISTOIRE DE FAMILLE"),
        h4.showcase-details-2-section-title {
          font-size: clamp(3.5rem, 7vw, 5.5rem) !important;
          line-height: 1.2 !important;
          max-width: none !important;
          width: 100% !important;
        }
        
        /* Spécifique pour éviter les conflits avec les animations GSAP */
        .about-page .showcase-details-2-section-title {
          font-size: clamp(3.5rem, 7vw, 5.5rem) !important;
          line-height: 1.2 !important;
          max-width: none !important;
          width: 100% !important;
        }

        /* Espacement entre les lettres sur mobile uniquement - compensation pour l'effet GSAP */
        @media (max-width: 991px) {
          .showcase-details-2-section-title:not(:has-text("UNE HISTOIRE DE FAMILLE")) {
            letter-spacing: 0.08em !important;
          }
          .showcase-details-2-area.pb-120 {
            margin-top: 20px !important;
            padding-bottom: 40px !important;
          }
          /* Réduire drastiquement l'espace entre la vidéo et "Ils nous accompagnent" avec marge négative TRÈS agressive */
          .ils-nous-accompagnent-section {
            margin-top: -350px !important; /* Marge négative très forte pour compenser l'espacement automatique entre sections */
          }
          /* Styles responsifs pour la section partenaires */
          .partner-logo-container {
            padding: 20px 10px !important;
          }
          .partner-logo-container a {
            max-width: 250px !important;
          }
          /* Styles mobile pour la section Une histoire de famille */
          .histoire-famille-row {
            flex-direction: column !important;
          }
          .histoire-famille-image-col {
            order: 2 !important;
            margin-top: 30px !important;
          }
          .histoire-famille-content-col {
            order: 1 !important;
          }
          .histoire-famille-image {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .histoire-famille-image img {
            max-width: 80% !important;
            height: auto !important;
            object-fit: contain !important;
          }
        }

        /* Styles pour l'alignement de la section Une histoire de famille */
        .histoire-famille-row {
          display: flex;
          align-items: stretch;
          min-height: 100%;
        }
        .histoire-famille-image-col {
          display: flex;
          align-items: stretch;
        }
        .histoire-famille-content-col {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 992px) {
          .histoire-famille-row {
            min-height: 600px;
          }
        }
        @media (min-width: 1200px) {
          .histoire-famille-row {
            min-height: 650px;
          }
        }
        @media (min-width: 1400px) {
          .histoire-famille-row {
            min-height: 700px;
          }
        }
      `}</style>
      
      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}

      {/* header area start */}
      <HeaderVBU />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className="about-page">
            
            {/* Section Une histoire de famille */}
            <div className="showcase-details-2-area pb-120 pt-120">
              <div className="container">
                <div className="row histoire-famille-row">
                  {/* Image à gauche */}
                  <div className="col-xl-5 col-lg-5 histoire-famille-image-col">
                    <div className="histoire-famille-image" style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'stretch'
                    }}>
                      <Image 
                        src={histoire_famille_img} 
                        alt="Une histoire de famille" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center center'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Contenu à droite */}
                  <div className="col-xl-7 col-lg-7 histoire-famille-content-col">
                    {/* Section Une histoire de famille */}
                    <div className="row">
                        <div className="col-xl-12">
                          <div className="showcase-details-2-section-box">
                              <h4 className="showcase-details-2-section-title tp-char-animation" style={{fontSize: 'clamp(3.5rem, 7vw, 5.5rem) !important', lineHeight: '1.2 !important', maxWidth: 'none !important', width: '100% !important'}}>UNE HISTOIRE DE FAMILLE</h4>
                          </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                          <div className="showcase-details-2-section-left mb-30">
                              <span className="ab-inner-subtitle">
                                <Leaf/>
                                Héritage et passion
                              </span>
                          </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                          <div className="showcase-details-2-content-right tp_title_anim">
                              <p style={{marginBottom: '20px'}}>IBÙ Experience a été créé par Mallen en hommage à son père qu&apos;on surnommait &quot;Ibou&quot;, figure rayonnante de l&apos;hospitalité originaire de Gambie, qui avait comme projet de construire des lodges éco-chic pour les voyageurs.</p>
                              <p style={{marginBottom: '50px'}}>Aujourd&apos;hui, ce rêve reprend vie en Belgique grâce à sa fille à travers des expériences immersives au sein de domaines prestigieux, où nature, bien-être et gastronomie s&apos;unissent dans des tiny houses élégamment designées.</p>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section Une histoire de famille end */}

            {/* Section On parle de nous */}
            <VideoTwo />
            {/* Section On parle de nous end */}

            {/* Gallery Section with scroll effect */}
            <div className="showcase-details-2-area pt-60 pb-60">
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Notre Univers</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-3">
                    <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Découverte
                      </span>
                    </div>
                  </div>
                  <div className="col-xl-9">
                    <div className="showcase-details-2-section-right tp_title_anim">
                      <p style={{color: '#333333'}}>Plongez dans l&apos;univers IBÙ Experience à travers ces moments captés au cœur de nos domaines d&apos;exception, où chaque détail raconte une histoire d&apos;authenticité et d&apos;évasion.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video YouTube section */}
              <div className="video-section" style={{marginTop: '80px'}}>
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-xl-10">
                      <div className="video-wrapper" style={{
                        position: 'relative',
                        paddingBottom: '56.25%', // 16:9 aspect ratio
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }}>
                        <iframe
                          src="https://www.youtube.com/embed/S92vBO7Isj4?rel=0&showinfo=0&modestbranding=1"
                          title="IBÙ Experience - Notre Univers"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '12px'
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Gallery Section end */}

            {/* Section Ils nous accompagnent et Nos partenaires (fusionnées) */}
            <div className="showcase-details-2-area pb-120 ils-nous-accompagnent-section" style={{marginTop: '120px'}}>
              <div className="container">
                {/* Titre principal Ils nous accompagnent */}
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Ils nous accompagnent</h4>
                    </div>
                  </div>
                </div>
                
                {/* Contenu StartLab */}
                <div className="row">
                  <div className="col-xl-3">
                    <div className="showcase-details-2-section-left">
                      <div className="powered-by-container" style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px'}}>
                        <span className="ab-inner-subtitle" style={{marginBottom: '0'}}>
                          <Leaf/>
                          Powered by
                        </span>
                        <div className="startlab-logo-container">
                          <Image 
                            src={startlab_logo} 
                            alt="StartLab Brussels Logo" 
                            style={{
                              width: 'auto',
                              height: '40px',
                              maxWidth: '160px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-9">
                    <div className="showcase-details-2-content-right tp_title_anim">
                      <p className="pb-25" style={{opacity: 1, color: 'inherit'}}>
                        IBU Experience est accompagné par{' '}
                        <a 
                          href="https://www.startlab.brussels/fr" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: '#053725',
                            textDecoration: 'underline',
                            fontWeight: '500',
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = '#031c13';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = '#053725';
                          }}
                        >
                          StartLab.Brussels
                        </a>
                        , l&apos;incubateur early-stage de Bruxelles qui coach, forme et connecte des primo-entrepreneurs et des profils académiques pour transformer des idées audacieuses en startups à impact, au sein d&apos;une communauté trilingue (FR/NL/EN).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Nos partenaires (maintenant dans la même div container) */}
                <div className="row" style={{marginTop: '80px'}}>
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-box mb-60">
                      <h4 className="showcase-details-2-section-title tp-char-animation" style={{color: '#053725'}}>Nos partenaires</h4>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-xl-12">
                    <div className="partner-logo-container" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '40px',
                      padding: '40px 20px',
                      flexWrap: 'wrap'
                    }}>
                      {/* Logo Kult Kefir */}
                      <a 
                        href="https://www.kultkefir.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          maxWidth: '150px',
                          width: '100%',
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                          (e.currentTarget as HTMLElement).style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                        }}
                      >
                        <KultKefirLogo color="#E8772E" width="100%" height="auto" />
                      </a>

                      {/* Logo Supernova */}
                      <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          maxWidth: '150px',
                          width: '100%',
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                          (e.currentTarget as HTMLElement).style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                        }}
                      >
                        <SupernovaLogo width="100%" height="auto" />
                      </a>

                      {/* Nouveau logo partenaire */}
                      <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          maxWidth: '150px',
                          width: '100%',
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                          (e.currentTarget as HTMLElement).style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                        }}
                      >
                        <svg 
                          version="1.0" 
                          xmlns="http://www.w3.org/2000/svg"
                          width="100%" 
                          height="auto"
                          viewBox="0 0 600.000000 248.000000"
                          preserveAspectRatio="xMidYMid meet"
                          style={{ display: 'block' }}
                        >
                          <g 
                            transform="translate(0.000000,248.000000) scale(0.100000,-0.100000)"
                            fill="#000000" 
                            stroke="none"
                          >
                            <path d="M3948 2371 c-75 -24 -171 -116 -188 -180 -22 -86 -49 -431 -70 -911
-15 -349 -1 -428 90 -500 113 -90 267 -79 377 26 52 50 58 82 73 364 5 118 20
387 31 598 21 368 21 384 4 429 -45 117 -211 208 -317 174z"/>
                            <path d="M3243 2350 c-127 -51 -170 -175 -192 -565 -22 -375 -33 -664 -30
-765 5 -128 28 -183 102 -241 59 -47 112 -62 193 -57 75 5 142 42 190 105 44
58 51 110 69 538 9 198 20 423 25 500 19 280 13 332 -44 408 -64 84 -207 119
-313 77z"/>
                            <path d="M415 1938 c-16 -6 -42 -20 -58 -30 -58 -41 -177 -343 -232 -592 -65
-296 -55 -472 32 -534 101 -71 185 -81 268 -33 66 38 174 152 342 363 76 95
158 193 183 218 41 42 44 43 48 23 2 -12 -4 -60 -12 -106 -20 -106 -20 -284
-1 -378 34 -159 124 -319 255 -450 216 -216 467 -318 864 -349 227 -18 432 6
650 77 237 76 335 133 375 218 23 49 28 126 10 172 -18 47 -79 120 -123 144
-70 40 -145 32 -296 -29 -152 -61 -251 -82 -436 -89 -332 -14 -562 52 -709
201 -39 39 -85 99 -103 133 -55 104 -62 160 -62 509 0 344 -5 379 -60 447
-112 134 -281 119 -431 -41 -35 -37 -112 -130 -170 -207 -102 -134 -139 -177
-139 -160 0 5 18 64 40 131 46 143 51 210 20 262 -31 50 -69 80 -124 97 -57
17 -88 18 -131 3z"/>
                            <path d="M1983 1779 c-69 -9 -200 -66 -275 -121 -119 -86 -178 -221 -178 -407
1 -241 116 -401 349 -485 144 -52 455 -59 628 -16 262 67 403 246 403 512 0
244 -159 452 -380 497 -128 26 -418 37 -547 20z m489 -236 c49 -44 -6 -190
-131 -344 -110 -136 -260 -259 -316 -259 -33 0 -64 28 -71 64 -17 91 72 243
241 411 148 149 218 181 277 128z"/>
                            <path d="M4787 1781 c-50 -6 -91 -19 -162 -55 -79 -39 -103 -57 -145 -107 -86
-103 -119 -189 -127 -329 -6 -105 4 -175 37 -264 29 -75 137 -188 225 -232
114 -59 170 -69 375 -68 193 1 222 6 367 65 29 12 35 11 72 -15 119 -83 277
-73 372 23 54 54 65 86 79 226 31 321 37 503 19 586 -22 102 -127 179 -245
179 -73 0 -112 -12 -180 -57 -28 -18 -56 -33 -61 -33 -6 0 -39 13 -74 29 -35
15 -86 33 -114 39 -64 14 -350 23 -438 13z m495 -241 c26 -27 29 -35 23 -68
-25 -132 -146 -310 -305 -447 -112 -96 -170 -106 -217 -36 -28 41 -24 60 28
159 88 166 250 350 349 396 71 33 85 32 122 -4z"/>
                          </g>
                        </svg>
                      </a>

                      {/* Logo partenaire avec couleur verte */}
                      <a 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          maxWidth: '150px',
                          width: '100%',
                          transition: 'transform 0.3s ease, opacity 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                          (e.currentTarget as HTMLElement).style.opacity = '0.8';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          (e.currentTarget as HTMLElement).style.opacity = '1';
                        }}
                      >
                        <svg 
                          width="100%" 
                          height="auto" 
                          viewBox="0 0 2200 607" 
                          version="1.1" 
                          xmlns="http://www.w3.org/2000/svg" 
                          xmlnsXlink="http://www.w3.org/1999/xlink" 
                          xmlSpace="preserve"
                          style={{ 
                            fillRule: 'evenodd',
                            clipRule: 'evenodd',
                            strokeLinejoin: 'round',
                            strokeMiterlimit: 2,
                            display: 'block'
                          }}
                        >
                          <g transform="matrix(1,0,0,1,-9911.53,-8921.32)">
                            <g transform="matrix(4.16667,0,0,4.16667,7500,8437.5)">
                              <g transform="matrix(1.12237,0,0,1,-62.505,0)">
                                <path 
                                  d="M628.162,125.089C617.172,125.089 606.181,125.409 595.334,125.89C592.479,126.05 589.339,126.21 586.199,126.21C581.06,126.21 575.779,125.89 571.354,125.089L571.354,127.652C575.494,127.652 578.777,132.138 578.777,143.672L578.777,243.156C578.777,254.691 575.494,259.176 571.354,259.176L571.354,261.739C577.206,260.938 583.059,260.458 589.053,260.458C594.905,260.458 600.757,260.938 606.61,261.739L606.61,259.176C602.47,259.176 599.045,254.691 599.045,243.156L599.045,201.024L625.165,201.024C653.141,201.024 665.844,184.523 665.844,161.935C665.844,141.109 650.429,125.089 628.448,125.089L628.162,125.089ZM645.576,163.056C645.576,182.601 631.445,198.46 614.032,198.46L599.045,198.46L599.045,143.672C599.045,132.138 602.898,127.652 610.035,127.652L614.032,127.652C631.445,127.652 645.576,143.512 645.576,163.056Z" 
                                  style={{ fill: 'rgb(0,57,37)', fillRule: 'nonzero' }}
                                />
                                <path 
                                  d="M734.353,195.256L741.917,174.751C737.921,172.188 733.068,170.906 728.215,170.906C713.371,170.906 703.95,187.246 700.525,199.902L700.525,171.707C692.96,176.994 681.398,179.877 674.833,179.877C674.119,179.877 673.263,179.877 672.692,179.717L672.692,182.12C674.833,182.12 676.688,183.402 677.973,185.965C679.4,188.528 680.257,192.533 680.257,198.14L680.257,243.156C680.257,254.53 676.831,259.176 672.692,259.176L672.692,261.739C678.544,260.938 684.539,260.458 690.391,260.458C696.243,260.458 702.095,260.938 707.947,261.739L707.947,259.176C705.949,259.176 704.093,258.055 702.666,255.492C701.381,252.928 700.525,248.923 700.525,243.156L700.525,205.029C703.95,190.13 711.087,181.8 719.508,181.8C726.93,181.8 731.212,187.887 732.782,194.616L734.353,195.256Z" 
                                  style={{ fill: 'rgb(0,57,37)', fillRule: 'nonzero' }}
                                />
                                <path 
                                  d="M781.023,255.492C779.738,252.928 778.882,248.923 778.882,243.156L778.882,171.707C771.317,176.994 759.756,179.877 753.19,179.877C752.476,179.877 751.62,179.877 751.049,179.717L751.049,182.28C753.19,182.28 755.045,183.402 756.33,185.965C757.757,188.528 758.614,192.533 758.614,198.14L758.614,243.156C758.614,254.53 755.188,259.176 751.049,259.176L751.049,261.739C756.901,260.938 762.896,260.458 768.748,260.458C774.6,260.458 780.452,260.938 786.304,261.739L786.304,259.176C784.306,259.176 782.45,258.055 781.023,255.492ZM768.748,157.93C776.027,157.93 781.879,151.201 781.879,143.031C781.879,134.861 776.027,128.293 768.748,128.293C761.468,128.293 755.474,134.861 755.474,143.031C755.474,151.201 761.468,157.93 768.748,157.93Z" 
                                  style={{ fill: 'rgb(0,57,37)', fillRule: 'nonzero' }}
                                />
                                <path 
                                  d="M897.918,255.492C896.491,252.928 895.777,248.923 895.777,243.156L895.777,202.145C895.777,202.145 887.784,216.082 881.504,227.296C879.077,231.622 876.794,235.627 875.366,238.19L875.366,243.156C875.366,254.53 872.083,259.176 867.944,259.176L867.944,261.739C873.796,260.938 879.648,260.458 885.643,260.458C891.495,260.458 897.347,260.938 903.199,261.739L903.199,259.176C901.201,259.176 899.203,258.055 897.918,255.492ZM954.012,255.492C952.728,252.928 951.871,248.923 951.871,243.156L951.871,198.3C951.871,179.877 940.167,171.707 927.607,171.707C921.897,171.707 916.616,173.149 911.763,175.872C911.621,175.872 911.478,176.032 911.335,176.032C911.192,176.193 911.05,176.193 910.907,176.353C905.055,179.717 900.202,184.843 895.777,191.091L895.777,116.118C888.212,121.404 876.651,124.288 870.085,124.288C869.371,124.288 868.515,124.288 867.944,124.128L867.944,126.531C870.085,126.531 871.941,127.812 873.225,130.375C874.653,132.939 875.366,136.944 875.366,142.551L875.366,226.335C875.223,226.656 875.081,226.976 874.795,227.296C871.084,234.345 859.095,249.724 846.962,251.487C845.535,251.647 844.108,251.807 842.68,251.807C828.55,251.807 812.706,240.753 810.708,212.238C810.565,210.475 810.565,208.713 810.565,207.111C810.565,188.368 817.702,176.673 827.693,174.751C828.55,174.591 829.263,174.591 830.12,174.591C839.255,174.591 847.961,183.722 848.96,198.3C848.96,198.3 850.388,199.422 850.673,199.582L862.377,184.683C855.526,176.673 845.535,171.707 833.117,171.707C807.996,171.707 793.009,191.892 793.009,216.723C793.009,241.554 807.996,261.739 833.117,261.739C859.38,261.739 876.223,229.699 877.507,227.296C882.503,218.485 894.064,197.659 895.777,195.417C901.915,186.445 909.194,179.236 917.758,179.236C926.75,179.236 931.603,185.644 931.603,199.742L931.603,243.156C931.603,254.53 928.178,259.176 924.038,259.176L924.038,261.739C929.89,260.938 935.885,260.458 941.737,260.458C947.589,260.458 953.441,260.938 959.294,261.739L959.294,259.176C957.295,259.176 955.44,258.055 954.012,255.492Z" 
                                  style={{ fill: 'rgb(0,57,37)', fillRule: 'nonzero' }}
                                />
                                <path 
                                  d="M1040.51,241.875C1037.94,245.079 1033.23,249.885 1022.81,251.487C1021.38,251.807 1019.81,251.807 1018.38,251.807C1004.11,251.807 988.122,240.593 986.552,212.238C986.552,210.636 986.409,209.034 986.409,207.432L1041.65,207.432C1039.79,182.28 1021.24,171.707 1006.53,171.707C982.413,171.707 968.853,191.892 968.853,216.723C968.853,241.554 983.84,261.739 1008.96,261.739C1023.66,261.739 1036.22,253.249 1041.65,243.156L1040.51,241.875ZM1001.83,174.591C1002.54,174.43 1003.25,174.43 1003.82,174.43C1012.82,174.43 1021.52,185.004 1022.38,204.868L986.409,204.868C986.838,187.246 992.261,176.353 1001.83,174.591Z" 
                                  style={{ fill: 'rgb(0,57,37)', fillRule: 'nonzero' }}
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </a>

                      {/* Emplacements "coming soon" */}
                      {[1, 2, 3].map((index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            maxWidth: '150px',
                            width: '100%',
                            height: '80px',
                            textAlign: 'center'
                          }}
                        >
                          <span style={{
                            fontSize: '18px',
                            color: '#999',
                            fontWeight: '400',
                            lineHeight: '1.2',
                            display: 'block'
                          }}>
                            coming
                          </span>
                          <span style={{
                            fontSize: '18px',
                            color: '#999',
                            fontWeight: '400',
                            lineHeight: '1.2',
                            display: 'block'
                          }}>
                            soon
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section fusionnée end */}

            {/* Image parallax */}
            <div className="tp-project-details-3-full-width-thumb mb-120" style={{width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)'}}>
              <Image 
                data-speed=".8" 
                src={parallax_img} 
                alt="IBÙ Experience - À propos" 
                style={{ 
                  height: 'auto', 
                  width: '100%', 
                  display: 'block',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Section Témoignages */}
            <div className="tp-testimonial-area pb-120">
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

            {/* Bouton Lieux et Disponibilités */}
            <div className="tp-projct-5-2-btn-box d-flex justify-content-center pb-120">
              <div className="tp-hover-btn-wrapper">
                <a href="/reservations" className="tp-btn-circle style-2 tp-hover-btn-item tp-hover-btn not-hide-cursor" data-cursor="Lieux et Disponibilités">
                  <span className="tp-btn-circle-text">
                    Lieux et <br /> Disponibilités
                  </span>
                  <span className="tp-btn-circle-icon">
                    <UpArrow />
                  </span>
                  <i className="tp-btn-circle-dot"></i>
                </a>
              </div>
            </div>

            {/* footer area start */}
            <FooterThree />
            {/* footer area end */}

          </main>
        </div>
      </div>

    </Wrapper>
  );
};

export default AboutMain;
