'use client';
import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from '@/plugins';
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Leaf, RightArrowOutline, LitDoubleIcon, BathroomIcon, KitchenetteIcon, GardeRobeIcon } from '@/components/svg';

// image imports
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';
import cocons_img_1 from '@/assets/img/inner-project/experiences-cocons/cocons-1.jpg';
import cocons_img_2 from '@/assets/img/inner-project/experiences-cocons/cocons-2.jpg';
import cocons_img_3 from '@/assets/img/inner-project/experiences-cocons/cocons-3.jpg';
import cocons_img_4 from '@/assets/img/inner-project/experiences-cocons/cocons-4.jpg';

// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";

const ExperiencesMain = () => {
  const bienEtreRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  useScrollSmooth();
  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    }
  }, []);

  // Effet de scroll pour mobile sur les photos des formules
  useEffect(() => {
    const handleMobileScroll = () => {
      if (window.innerWidth >= 992) return; // PC seulement
      
      const bienEtreElement = bienEtreRef.current;
      const signatureElement = signatureRef.current;
      
      if (!bienEtreElement || !signatureElement) return;
      
      const bienEtreRect = bienEtreElement.getBoundingClientRect();
      const signatureRect = signatureElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Activer l'effet hover pour IBÙ Bien-être
      if (bienEtreRect.top < windowHeight * 0.8 && bienEtreRect.bottom > windowHeight * 0.2) {
        bienEtreElement.classList.add('mobile-hover-active');
      } else {
        bienEtreElement.classList.remove('mobile-hover-active');
      }
      
      // Activer l'effet hover pour IBÙ Signature
      if (signatureRect.top < windowHeight * 0.8 && signatureRect.bottom > windowHeight * 0.2) {
        signatureElement.classList.add('mobile-hover-active');
      } else {
        signatureElement.classList.remove('mobile-hover-active');
      }
    };

    window.addEventListener('scroll', handleMobileScroll);
    window.addEventListener('resize', handleMobileScroll);
    handleMobileScroll(); // Appel initial
    
    return () => {
      window.removeEventListener('scroll', handleMobileScroll);
      window.removeEventListener('resize', handleMobileScroll);
    };
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined' && document.querySelector('.tp-magic-cursor')) {
      cursorAnimation();
    }
  },[]);

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
          <main>
            
            {/* Section fusionnée : NOS COCONS + NOS FORMULES */}
            <div className="showcase-details-2-area pb-120 pt-120">
              <div className="container">
                {/* Section NOS COCONS */}
                <div className="row">
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
                
                {/* Section NOS FORMULES */}
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box">
                        <h4 className="showcase-details-2-section-title tp-char-animation">Nos Formules</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-3">
                    <div className="showcase-details-2-section-left">
                        <span className="ab-inner-subtitle mb-25">
                          <Leaf/>
                          Les deux formules IBÙ
                        </span>
                    </div>
                  </div>
                </div>
                <div className="row" style={{marginTop: '20px'}}>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-content-right tp_title_anim mb-30">
                      <p>Avec <strong>IBÙ Bien-Être</strong>, plongez dans une bulle de sérénité grâce à un sauna privatif, un bain nordique extérieur et un kit de relaxation, pour un séjour où détente et confort s&apos;entrelacent harmonieusement.</p>
                    </div>
                    <div ref={bienEtreRef} className="showcase-details-2-grid-img mb-30 showcase-hover-container">
                        <a href="/experiences/ibu-bien-etre" className="showcase-image-link">
                            <Image className="img-left" src={showcase_img_14} alt="showcase-img-14" style={{height:'auto'}}/>
                            <div className="showcase-hover-text">
                                <span className="showcase-hover-title">IBÙ Bien-être</span>
                            </div>
                        </a>
                    </div>
                    <div className="showcase-details-2-link-text" style={{
                      marginBottom: 'clamp(40px, 8vw, 60px)'
                    }}>
                        <a href="/experiences/ibu-bien-etre" className="showcase-link-with-arrow" style={{
                          fontSize: 'clamp(16px, 4vw, 18px)',
                          fontWeight: '500'
                        }}>
                            Découvrir IBÙ Bien-être
                            <span className="arrow-right">
                                <RightArrowOutline/>
                            </span>
                        </a>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-content-right tp_title_anim mb-30">
                      <p>Avec <strong>IBÙ Signature</strong>, vivez une parenthèse gastronomique intimiste : un menu raffiné en trois services, imaginé par notre chef privé à partir de produits locaux, dans l&apos;atmosphère apaisante de votre cocon niché en pleine nature.</p>
                    </div>
                    <div ref={signatureRef} className="showcase-details-2-grid-img mb-30 showcase-hover-container">
                        <a href="/experiences/ibu-signature" className="showcase-image-link">
                            <Image className="img-right" src={showcase_img_15} alt="showcase-img-15" style={{height:'auto'}}/>
                            <div className="showcase-hover-text">
                                <span className="showcase-hover-title">IBÙ Signature</span>
                            </div>
                        </a>
                    </div>
                    <div className="showcase-details-2-link-text" style={{
                      marginBottom: 'clamp(40px, 8vw, 60px)'
                    }}>
                        <a href="/experiences/ibu-signature" className="showcase-link-with-arrow" style={{
                          fontSize: 'clamp(16px, 4vw, 18px)',
                          fontWeight: '500'
                        }}>
                            Découvrir IBÙ Signature
                            <span className="arrow-right">
                                <RightArrowOutline/>
                            </span>
                        </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* details title 5 */}


            {/* footer area start */}
            <FooterThree />
            {/* footer area end */}

          </main>
        </div>
      </div>

      {/* Styles pour l'effet de scroll mobile sur les formules et pagination des cocons */}
      <style jsx>{`
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
        
        .cocons-mobile-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #ccc !important;
          opacity: 0.5 !important;
          margin: 0 4px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .cocons-mobile-bullet-active {
          background: #053725 !important;
          opacity: 1 !important;
          transform: scale(1.2) !important;
        }
      `}</style>
    </Wrapper>
  );
};

export default ExperiencesMain;
