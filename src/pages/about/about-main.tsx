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

            {/* Section StartLab.Brussels */}
            <div className="showcase-details-2-area pb-120" style={{marginTop: '120px'}}>
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Ils nous accompagnent</h4>
                    </div>
                  </div>
                </div>
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
              </div>
            </div>

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
