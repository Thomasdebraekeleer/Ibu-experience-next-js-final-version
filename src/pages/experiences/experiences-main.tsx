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
                          <p>Conçus dans un esprit minimaliste et chaleureux, nos pods de 15 m² offrent une immersion totale dans la nature sans compromis sur le confort : lit double avec baie vitrée panoramique, douche design, et toilettes sèches de nouvelle génération.</p>
                          <p style={{marginBottom: '50px'}}>Pour prolonger l&apos;expérience, profitez d&apos;options bien-être en extérieur : sauna et bain nordique avec vue imprenable sur le domaine, en toute intimité.</p>
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
                          <h6 className="cocon-feature-title">Bathroom</h6>
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
                    <div className="showcase-details-2-content-right tp_title_anim mb-30">
                      <p>Avec <strong>IBÙ Signature</strong>, vivez une parenthèse gastronomique intimiste : un menu raffiné en trois services, imaginé par notre chef privé à partir de produits locaux, dans l&apos;atmosphère apaisante de votre cocon niché en pleine nature.</p>
                    </div>
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
            {/* details title 5 */}


            {/* footer area start */}
            <FooterThree />
            {/* footer area end */}

          </main>
        </div>
      </div>

    </Wrapper>
  );
};

export default ExperiencesMain;
