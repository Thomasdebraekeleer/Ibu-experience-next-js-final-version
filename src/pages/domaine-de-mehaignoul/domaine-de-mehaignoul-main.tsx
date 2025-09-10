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
import { Leaf, RightArrowOutline, LitDoubleIcon, BathroomIcon, KitchenetteIcon, GardeRobeIcon } from '@/components/svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

// image imports
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';
import cocons_img_1 from '@/assets/img/inner-project/experiences-cocons/cocons-1.jpg';
import cocons_img_2 from '@/assets/img/inner-project/experiences-cocons/cocons-2.jpg';
import cocons_img_3 from '@/assets/img/inner-project/experiences-cocons/cocons-3.jpg';
import cocons_img_4 from '@/assets/img/inner-project/experiences-cocons/cocons-4.jpg';

// nouvelles images pour la section Le logement
import logement_img_1 from '@/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine de Mehaignoul img 5.jpg';
import logement_img_2 from '@/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine de Mehaignoul img 6.jpg';

// image pour la section parallax
import parallax_img from '@/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine de Mehaignoul img 7.jpg';

// slider images for Domaine de Mehaignoul
const slider_images = [
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine de Mehaignoul img 1.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine de Mehaignoul img 2.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine de Mehaignoul img 3.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine de Mehaignoul img 4.jpg'
];

// slider setting
const slider_setting: SwiperOptions = {
  slidesPerView: 3,
  loop: true,
  autoplay: true,
  spaceBetween: 20,
  speed: 1000,
  breakpoints: {
    '1400': {
      slidesPerView: 3,
    },
    '1200': {
      slidesPerView: 3,
    },
    '992': {
      slidesPerView: 2,
    },
    '768': {
      slidesPerView: 2,
    },
    '576': {
      slidesPerView: 1,
    },
    '0': {
      slidesPerView: 1,
    },
  },
}

// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";

const DomaineDeMehaignoulMain = () => {
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
            
            {/* NOS COCONS IBÙ Experience section */}
            <div className="showcase-details-2-area pb-120 pt-120">
                <div className="container">
                                     <div className="row">
                       <div className="col-xl-12">
                                                  <div className="showcase-details-2-section-box">
                              <h4 className="showcase-details-2-section-title tp-char-animation">
                                Domaine<br />
                                de Mehaignoul
                              </h4>
                          </div>
                       </div>
                   </div>
                  <div className="row">
                      <div className="col-xl-3">
                        <div className="showcase-details-2-section-left">
                            <span className="ab-inner-subtitle mb-25">
                              <Leaf/>
                              Immersion dans un vignoble
                            </span>
                        </div>
                      </div>
                      <div className="col-xl-9">
                        <div className="showcase-details-2-content-right tp_title_anim">
                            <p>Situé au cœur de la Wallonie à seulement 30 min de Bruxelles, le domaine de Mehaignoul est une ferme en carré datant du 13e siècle d'une exceptionnelle authenticité. En plus de sa première fonction agricole, elle dispose d'un charmant vignoble où règne une atmosphère champêtre et dépaysante.</p>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
                         {/* NOS COCONS IBÙ Experience section */}

                           {/* Slider images section */}
              <div className="showcase-details-2-area pb-120">
                  <div className="container-fluid">
                    <div className="pd-visual-slider-wrap pb-40">
                      <Swiper {...slider_setting} modules={[Autoplay]} className="swiper-container pd-visual-slider-active">
                          {slider_images.map((imgSrc, index) => (
                            <SwiperSlide key={index}>
                              <div className="pd-visual-slider-thumb fix">
                                <Image 
                                  src={imgSrc} 
                                  alt="Domaine de Mehaignoul Gallery" 
                                  width={600}
                                  height={400}
                                  style={{height:"auto"}}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                      </Swiper>
                    </div>
                  </div>
              </div>
                           {/* Slider images section */}

                             {/* Le logement section */}
            <div className="showcase-details-2-area pb-120">
                <div className="container">
                  <div className="row">
                      <div className="col-xl-8">
                        <div className="showcase-details-2-section-box">
                            <h4 className="showcase-details-2-section-title tp-char-animation">Le logement</h4>
                        </div>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-xl-3">
                        <div className="showcase-details-2-section-left">
                            <span className="ab-inner-subtitle mb-25">
                              <Leaf/>
                              Votre cocon
                            </span>
                        </div>
                      </div>
                      <div className="col-xl-9">
                        <div className="showcase-details-2-content-right tp_title_anim">
                            <p className="pb-25">Conçus dans un esprit minimaliste et chaleureux, nos pods offrent une immersion totale dans la nature sans compromis sur le confort : lit double avec baie vitrée panoramique, douche design, et toilettes sèches de nouvelle génération.</p>
                        </div>
                      </div>
                  </div>
                  
                  {/* Images des cocons intégrées */}
                  <div className="row" style={{marginTop: '40px', marginBottom: '40px'}}>
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
                  
                  {/* Icônes des cocons intégrées */}
                  <div className="row" style={{marginTop: '40px', marginBottom: '60px'}}>
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
                  
                  {/* 2 photos du logement intégrées */}
                  <div className="row" style={{marginTop: '40px'}}>
                      <div className="col-xl-6">
                        <div className="tp-project-details-3-thumb-box mb-30">
                            <Image className="w-100" src={logement_img_1} alt="Logement Domaine de Mehaignoul" style={{height:'auto'}}/>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="tp-project-details-3-thumb-box mb-30">
                          <Image className="w-100" src={logement_img_2} alt="Logement Domaine de Mehaignoul" style={{height:'auto'}}/>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
            {/* Le logement section */}


             {/* Parallax image section */}
            <div className="tp-project-details-3-thumb mb-120">
                <div className="container container-1560">
                  <div className="row">
                      <div className="col-xl-12">
                        <div className="tp-project-details-3-thumb-box">
                            <Image data-speed=".8" src={parallax_img} alt="Domaine de Mehaignoul Parallax" style={{ height: 'auto' }}/>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
            {/* Parallax image section */}

             {/* details title 5 - new section for showcase images */}
            <div className="showcase-details-2-area pb-120">
              <div className="container">
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
                      <div className="col-xl-9">
                        <div className="showcase-details-2-content-right tp_title_anim">
                            <p>Avec <strong>IBÙ Signature</strong>, vivez une parenthèse gastronomique intimiste : un menu raffiné en trois services, imaginé par notre chef privé à partir de produits locaux, dans l&apos;atmosphère apaisante de votre cocon niché en pleine nature.</p>
                            <p>
                             Avec <strong>IBÙ Bien-Être</strong>, plongez dans une bulle de sérénité grâce à un sauna privatif, un bain nordique extérieur et un kit de relaxation, pour un séjour où détente et confort s&apos;entrelacent harmonieusement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* details title 5 */}

            {/* new showcase images section */}
            <div className="showcase-details-2-grid-area pb-120">
                <div className="container">
                  <div className="row">
                                       <div className="col-xl-6 col-lg-6">
                         <div className="showcase-details-2-grid-img mb-30 showcase-hover-container">
                             <a href="/experiences/ibu-bien-etre" className="showcase-image-link">
                                 <Image className="img-left" src={showcase_img_14} alt="showcase-img-14" style={{height:'auto'}}/>
                                 <div className="showcase-hover-text">
                                     <span className="showcase-hover-title">IBÙ Bien-être</span>
                                 </div>
                             </a>
                         </div>
                         <div className="showcase-details-2-link-text">
                                                                <a href="/experiences/ibu-bien-etre" className="showcase-link-with-arrow">
                                       Découvrir IBÙ Bien-être
                                       <span className="arrow-right">
                                           <RightArrowOutline/>
                                       </span>
                                   </a>
                         </div>
                       </div>
                       <div className="col-xl-6 col-lg-6">
                         <div className="showcase-details-2-grid-img mb-30 showcase-hover-container">
                             <a href="/experiences/ibu-signature" className="showcase-image-link">
                                 <Image className="img-right" src={showcase_img_15} alt="showcase-img-15" style={{height:'auto'}}/>
                                 <div className="showcase-hover-text">
                                     <span className="showcase-hover-title">IBÙ Signature</span>
                                 </div>
                             </a>
                         </div>
                         <div className="showcase-details-2-link-text">
                                                                <a href="/experiences/ibu-signature" className="showcase-link-with-arrow">
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
            {/* new showcase images section */}

            {/* footer area start */}
            <FooterThree />
            {/* footer area end */}

          </main>
        </div>
      </div>

    </Wrapper>
  );
};

export default DomaineDeMehaignoulMain;
