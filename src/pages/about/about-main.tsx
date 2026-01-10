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
        
        /* Style pour "Ils nous soutiennent" - override GSAP animations */
        .ils-nous-soutiennent-title {
          font-size: clamp(60px, 10vw, 150px) !important;
          line-height: 1.1 !important;
          max-width: 100% !important;
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

                      {/* Logo Superbon */}
                      <a 
                        href="https://superbon.brussels/fr" 
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

                      {/* Logo Habeebee */}
                      <a 
                        href="https://habeebee.be/" 
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
                          id="Calque_2" 
                          data-name="Calque 2" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 1019.44 846.71"
                          width="100%"
                          height="auto"
                          style={{ display: 'block' }}
                        >
                          <g id="Calque_1-2" data-name="Calque 1">
                            <g>
                              <path fill="#005E86" d="M349.5.31c-22,3.1-33.6,6.4-50,14.4-15.5,7.5-28.2,16.7-42.5,30.7-25.8,25.2-40.2,50.8-47.2,83.8-2,9.7-2.3,13.6-2.2,33,0,20.1.3,23.1,2.8,34.5,10.9,49.7,39.2,102.1,88.9,164,4.4,5.5,15.2,18.6,15.6,19,.4.3,3.8,4.1,7.6,8.5,26.2,29.8,63,66.8,99.1,99.5,17.7,16.1,19.3,17.5,30.9,27.5,3.8,3.3,8.3,7.2,10,8.7,1.6,1.5,9,7.8,16.4,14s13.7,11.9,13.9,12.6c.6,1.8-5.6,7.4-29.7,27.1-11.2,9.1-23.4,19.1-27,22.1-3.7,3-8.5,6.8-10.6,8.5-17.5,13.7-20,16-20.3,19.6-.2,2.5.3,4,1.8,5.4,3.2,2.9,6.9,2.2,13.5-2.3,17.5-12.1,50.3-36.7,73.2-54.9,7.8-6.2,15.1-11.3,16.2-11.3,1,0,4.3,1.9,7.3,4.3,2.9,2.4,8.2,6.6,11.8,9.3,3.6,2.8,9,7,12,9.3,26.3,20.4,61.8,46.2,65.3,47.4,2.6,1,6.6-.9,7.8-3.7,2.1-4.6.4-7-11.8-16.8-54.3-43.3-74.8-60.7-74.8-63.4,0-1.4,4.2-5.6,13.5-13.4,106.2-89.2,180.5-168.7,225.7-241.5,42.3-68.3,55.4-127.2,40.1-180-2.4-8-7.9-21.8-10.9-27.3-4.7-8.4-11.4-19.4-12.9-21-.8-.9-3.1-3.8-5-6.4-4.1-5.4-21.2-22.5-28.5-28.5-19.1-15.5-44.3-27.1-68.5-31.4-9.5-1.7-37.9-1.7-48.5,0-35.3,5.5-72.4,22.7-108.3,50-6.3,4.7-12,9-12.8,9.6-1.6,1.1-.7,1.7-13.6-8.1-37-28-72.1-44.7-107.3-50.9-8.7-1.6-34.9-2.8-41-1.9ZM376.5,45.71c27.3,3.1,57.9,16.5,87.1,38.1,17.4,12.8,41,34.6,40.2,36.9-.2.5-6.3,6.9-13.5,14.3-20.7,20.9-23.5,25.1-20.1,28.5,1.6,1.6,75.9,1.7,78.9.2,3.8-2.1,2.2-5.3-8-16.6-5.4-6-13.3-14.3-17.5-18.4s-7.6-8-7.6-8.6c0-1.7,18.3-18.9,30.5-28.8,41.7-33.4,84.8-49.8,120.1-45.7,24.4,2.8,44.6,12.8,64.2,31.5,28.1,26.9,39.7,57.7,36.3,96.4-2.5,28-10,55.8-24.4,89.7-7.9,18.6-27.1,53.2-41.7,75-11.8,17.5-32.7,45.6-40.5,54.1-.5.7-1.9,2.2-2.9,3.5-4.2,5.3-14.2,16.7-18.5,21.1l-4.5,4.8h-249.4l-5-5.3c-9.7-10.1-28.4-32.7-40.8-49.2-8.5-11.2-21.4-30-28.4-41-48-76.7-68.4-150.4-54.5-197.5,10.5-35.7,42.9-68.5,78.5-79.4,13.8-4.2,26.2-5.3,41.5-3.6Z"/>
                              <path fill="#005E86" d="M429.4,212.11c-3.7,2.6-23.4,37.4-23.4,41.3,0,1.1.8,2.7,1.8,3.6,1.7,1.6,9.9,1.7,102.7,1.5l100.9-.3,1.5-2.5c1.2-2.3,1.2-3-.7-7-6.4-13.6-19.6-35.6-22.2-37-1.2-.6-30-1-80.2-1-66.8,0-78.7.2-80.4,1.4Z"/>
                              <path fill="#005E86" d="M386,311.11c-2.5,3.1-6.9,28.6-7,40.2,0,10.4-14.4,9.4,131.3,9.4h127.7l1.6-2.5c1.4-2.2,1.6-4.1,1.1-11.4-.4-4.8-1.1-11-1.6-13.7s-1.4-8.1-2.1-11.9c-.7-3.9-1.9-8-2.6-9.3l-1.4-2.2h-122.9c-105.8,0-123,.2-124.1,1.4Z"/>
                              <path fill="#005E86" d="M2.5,740.21l-2.5,2.4v99.8l2.3,2.1c3.1,2.9,7.2,2.8,10.2-.3q2.5-2.4,2.5-23.5v-21h48v21q0,21.1,2.5,23.5c3.1,3.2,7.4,3.3,10.3.2,2.2-2.3,2.2-2.4,2.2-52.1v-49.7l-2.5-2.4c-1.3-1.4-3.6-2.5-5-2.5s-3.7,1.1-5,2.5q-2.5,2.4-2.5,23.5v21H15v-21q0-21.1-2.5-23.5c-1.3-1.4-3.6-2.5-5-2.5s-3.7,1.1-5,2.5Z"/>
                              <path fill="#005E86" d="M290.7,739.71l-2.7,2.1v50.5c0,49.6,0,50.4,2.1,52.5s2.9,2,23.2,1.7l21.2-.3,6.3-3.4c11.5-6.2,17.4-15.9,17.5-28.6,0-6.4-.4-8.3-3.2-13.9-2.1-4.3-4.9-8.1-8-10.7l-4.8-4.2,2.8-5.4c5.7-10.8,3.2-25.4-5.8-34-7.1-6.7-10.7-7.7-29.3-8.1-15.7-.3-16.7-.2-19.3,1.8ZM326.6,755.31c7.1,5.2,8.9,13.1,4.5,19.3-3.6,5-6.8,6.1-18.1,6.1h-10v-28.2l10.4.4c8.7.2,10.9.7,13.2,2.4ZM333.9,798.21c4.1,2.1,7.9,6.9,9.2,11.8,1.3,5,0,10.4-3.8,15.3-3.9,5.1-8.5,6.4-23.3,6.4h-13v-35h14c10.4,0,14.8.4,16.9,1.5Z"/>
                              <path fill="#005E86" d="M427.6,739.81l-2.6,2v100.8l2.6,2c2.6,2,3.9,2.1,30.8,2.1,32,0,32.6-.1,32.6-6.8,0-7.8-1.5-8.2-28.4-8.2h-22.6v-32h20.4c22.4,0,23.8-.3,25.2-6.2.5-2.2,0-3.3-2.4-5.8l-3-3h-40.2v-32h23.4c20.8,0,23.6-.2,25.4-1.8,3.3-2.7,3.3-8.1,0-11.2-2.1-1.9-3.4-2-30.4-2s-28.2.1-30.8,2.1Z"/>
                              <path fill="#005E86" d="M558.5,740.21l-2.5,2.4v99.8l2.3,2.1c2.3,2.2,3,2.2,30.4,2.2,15.5,0,28.9-.3,29.8-.6,2.2-.9,4.7-6.1,4-8.4-.3-1.1-1.8-2.9-3.2-4-2.4-1.9-4-2-25.4-2h-22.9v-32h20.3c19.1,0,20.5-.1,22.5-2,3.2-3,3-8.2-.4-10.9-2.5-2-4-2.1-22.5-2.1h-19.9v-32h22.9c12.6,0,23.7-.3,24.6-.6,1.5-.6,4.5-5.4,4.5-7.3,0-.5-1.2-2.3-2.6-4l-2.6-3.1h-56.9l-2.4,2.5Z"/>
                              <path fill="#005E86" d="M691.7,739.71l-2.7,2.1v50.5c0,49.6,0,50.4,2.1,52.5s2.9,2,23.2,1.7l21.2-.3,6.3-3.4c11.6-6.3,17.3-15.8,17.4-28.7,0-6.5-.4-8.5-3.2-14-2-4.1-4.9-7.9-7.9-10.5l-4.8-4.2,2.8-5.4c5.6-10.7,3.1-25.5-5.6-33.8-7.3-6.8-11.1-7.9-29.5-8.3-15.7-.3-16.7-.3-19.3,1.8ZM724.7,753.81c4.3,1.6,8.2,5.9,9.4,10.1.8,3.2.6,4.6-1,8.3-3.1,6.9-6.5,8.5-18.8,8.5h-10.3v-28h8.9c4.9,0,10.2.5,11.8,1.1ZM735.7,798.71c3.8,2.3,7.8,8.2,8.8,12.7.8,4-.9,9.6-4.2,14-3.9,5-8.5,6.3-23.3,6.3h-13v-35h14.3c12.3,0,14.6.3,17.4,2Z"/>
                              <path fill="#005E86" d="M824.6,740.21l-2.6,2.4v99.2l2.5,2.4,2.4,2.5h57.2l2.4-2.5c3-2.9,3.2-6.4.6-9.6-1.9-2.4-2.1-2.4-26-2.7l-24.1-.3v-31.9h41.1l2.6-2.6c2-2,2.4-3.1,1.9-5.7-1.2-6.1-1.6-6.2-24.6-6.5l-21-.3v-31.9h47.9l2-2.6c2.8-3.5,2.6-6.9-.4-9.9l-2.4-2.5h-56.8l-2.7,2.5Z"/>
                              <path fill="#005E86" d="M955.5,740.21l-2.5,2.4v100l2.6,2c2.6,2,3.9,2.1,30.9,2.1s28.5-.1,30.6-1.9c2.8-2.3,3.2-8.3.6-10.9-1.6-1.5-4.6-1.7-25.7-2l-24-.3v-31.9h20.5c20.5,0,20.6,0,23-2.5,1.4-1.3,2.5-3.6,2.5-5s-1.1-3.7-2.5-5c-2.4-2.5-2.5-2.5-23-2.5h-20.5v-32h23.4c21.4,0,23.6-.2,25.7-1.9,1.7-1.3,2.3-2.9,2.3-5.6s-.6-4.3-2.3-5.6c-2.1-1.8-4.5-1.9-30.8-1.9h-28.4l-2.4,2.5Z"/>
                              <path fill="#005E86" d="M176.7,740.51c-.9,1-3.5,6.2-5.8,11.7-2.2,5.5-7.4,17.6-11.4,27-4,9.3-11.1,26.1-15.9,37.2-4.7,11.1-8.6,21.6-8.6,23.2,0,6.3,7.7,9.5,11.9,5,1-1.1,4.2-7.6,7.1-14.5l5.2-12.4,22.6.2,22.6.3,5.3,12.5c5.4,12.9,7.8,16,12,16,2.8,0,7.3-4.1,7.3-6.8,0-2-5.5-15.7-13.8-34.2-1.1-2.5-4.3-10.2-7.2-17-2.8-6.9-6.6-15.9-8.5-20-1.8-4.1-4.9-11.6-7-16.5-2.1-5-4.7-10-5.8-11.3-2.5-2.7-7.7-3-10-.4ZM190.1,784.51l7.6,17.7-15.5.3c-8.5.1-15.7.1-15.9-.2-.6-.6,15-36.6,15.7-36,.3.3,3.9,8.5,8.1,18.2Z"/>
                            </g>
                          </g>
                        </svg>
                      </a>

                      {/* Logo Priche */}
                      <a 
                        href="https://www.priche.be/" 
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
