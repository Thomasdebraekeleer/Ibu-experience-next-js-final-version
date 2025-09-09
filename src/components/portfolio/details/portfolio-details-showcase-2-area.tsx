import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Leaf, UpArrow, UpArrowTwo, RightArrowOutline } from '@/components/svg';
import AwardOne from '@/components/award/award-one';
import Script from 'next/script';

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


// img data
const img_data = [port_d_1, port_d_2, port_d_3, port_d_4, port_d_5, port_d_6, port_d_7, port_d_8];

export default function PortfolioDetailsShowcaseTwoArea() {
  const heroRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !backgroundRef.current || !foregroundRef.current) return;
      
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      const rateForeground = scrolled * -0.3;
      
      // Effet parallaxe sur l'image de fond
      backgroundRef.current.style.transform = `translateY(${rate}px)`;
      
      // Effet parallaxe sur l'image PNG (plus lent pour créer de la profondeur)
      foregroundRef.current.style.transform = `translateY(${rateForeground}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Script Lodgify */}
      <Script src="https://app.lodgify.com/portable-search-bar/stable/renderPortableSearchBar.js" defer />
      
      {/* portfolio hero avec superposition d'images et parallaxe */}
      <div ref={heroRef} className="showcase-details-2-area showcase-details-2-bg p-relative overflow-hidden">
        {/* Image de fond avec parallaxe */}
        <div 
          ref={backgroundRef}
          className="hero-background-image p-absolute w-100 h-100"
          style={{
            backgroundImage: "url(/assets/img/inner-project/showcase/Image%20hero%201%20Background.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            zIndex: 1
          }}
        />
        
        {/* Contenu du hero avec textes */}
        <div className="hero-content-wrapper p-relative" style={{zIndex: 2}}>
          <div className="showcase-details-2-link">
            <a className="project-details-custom-link" href="#">
                Visit Website
                <span>
                  <UpArrow/>
                </span>
            </a>
          </div>
          <div className="showcase-details-2-wrapper" data-lag="0.2" data-stagger="0.08">
            <div className="container container-1550">
                <div className="row">
                  <div className="col-xl-8">
                      <div className="showcase-details-2-title-box">
                        <h5 className="showcase-details-2-title mb-20 tp-char-animation" style={{whiteSpace: 'nowrap'}}>IBÙ EXPERIENCE</h5>
                        <span className="showcase-details-2-subtitle tp_title_anim">L&apos;art de s&apos;évader dans des lieux d&apos;exception</span>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Widget Lodgify - SECTION DISTINCTE */}
        <div className="lodgify-widget-section p-relative" style={{zIndex: 9999}}>
          <div className="container container-1550">
            <div className="row">
              <div className="col-xxl-7 col-xl-10">
                <div className="lodgify-widget-container tp_title_anim">
                  <style jsx>{`
                    :root {
                      --ldg-psb-background: #ffffff;
                      --ldg-psb-border-radius: 0.42em;
                      --ldg-psb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1);
                      --ldg-psb-padding: 14px;
                      --ldg-psb-input-background: #ffffff;
                      --ldg-psb-button-border-radius: 0px;
                      --ldg-psb-color-primary: #053725;
                      --ldg-psb-color-primary-lighter:#829b92;
                      --ldg-psb-color-primary-darker: #031c13;
                      --ldg-psb-color-primary-contrast: #fcf8e3;
                      --ldg-semantic-color-primary:  #053725;
                      --ldg-semantic-color-primary-lighter: #829b92;
                      --ldg-semantic-color-primary-darker: #031c13;
                      --ldg-semantic-color-primary-contrast: #fcf8e3;
                      --ldg-component-modal-z-index: 999;
                    }
                    #lodgify-search-bar {
                      width:100%;
                    }
                  `}</style>
                  <div
                    id="lodgify-search-bar"
                    data-website-id="607668"
                    data-language-code="fr"
                    data-checkout-page-url='https://checkout.lodgify.com/mallen-jallow/fr/#/16403'
                    data-dates-check-in-label='Arrivée'
                    data-dates-check-out-label='Départ'
                    data-guests-counter-label='Invités'
                    data-guests-input-singular-label='{{NumberOfGuests}} invité'
                    data-guests-input-plural-label='{{NumberOfGuests}} invités'
                    data-location-input-label='Emplacement'
                    data-search-button-label='Rechercher'
                    data-dates-input-min-stay-tooltip-text='{"one":"Minimum {minStay} nuit","other":"Minimum de {minStay} nuits"}'
                    data-guests-breakdown-label='Invités'
                    data-adults-label='{"one":"adulte","other":"adultes"}'
                    data-adults-description='Âges {minAge} ou plus'
                    data-children-label='{"one":"enfant","other":"enfants"}'
                    data-children-description='Âges {minAge} - {maxAge}'
                    data-children-not-allowed-label='Non adapté aux enfants'
                    data-infants-label='{"one":"bébé","other":"bébés"}'
                    data-infants-description='Moins de {maxAge}'
                    data-infants-not-allowed-label='Non adapté aux bébés'
                    data-pets-label='{"one":"animal de compagnie", "other":"animaux de compagnie"}'
                    data-pets-not-allowed-label='Non autorisé'
                    data-done-label='Terminé'
                    data-new-tab="true"
                    data-version="stable"
                    data-has-guests-breakdown
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image PNG au premier plan avec effet parallaxe */}
        <div 
          ref={foregroundRef}
          className="hero-foreground-image p-absolute w-100 h-100"
          style={{
            backgroundImage: "url(/assets/img/inner-project/showcase/Image%20hero%202%20pods.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundAttachment: "fixed",
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
                      <h4 className="showcase-details-2-section-title tp-char-animation" style={{whiteSpace: 'nowrap'}}>IBÙ EXPERIENCE</h4>
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
          
          {/* moving image intégrée */}
          <div className="moving-gallery" style={{marginTop: '120px'}}>
            <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-top d-flex align-items-end mb-20">
              {img_data.slice(0,4).map((imgSrc,i) => (
                <div key={i} className="showcase-details-2-slider-item">
                  <Image src={imgSrc} alt="port-img" style={{height:"auto"}}/>
                </div>
              ))}
            </div>
          </div>

          <div className="moving-gallery">
            <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-bottom d-flex align-items-start">
              {img_data.slice(4,8).map((imgSrc,i) => (
                <div key={i} className="showcase-details-2-slider-item">
                  <Image src={imgSrc} alt="port-img" style={{height:"auto"}}/>
                </div>
              ))}
            </div>
          </div>
      </div>
      {/* details title avec galerie intégrée */}

      {/* Awards section - The Program */}
      <AwardOne cls="pt-120 pb-250" />
      {/* Awards section */}

      {/* full width image */}
      <div className="showcase-details-2-fullwidth-img">
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
                      <p>IBÙ propose une approche unique où chaque séjour se vit comme une parenthèse hors du temps. Dans des lieux d’exception, nos cocons design invitent à savourer la nature, le confort et des expériences raffinées, entre bien-être et gastronomie locale.</p>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* detail title 3 */}

      {/* grid images */}
      <div className="showcase-details-2-grid-area pb-90">
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

             {/* details title 4 */}
       <div className="showcase-details-2-area pt-60 pb-60">
           <div className="container">
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
                       <p>Nos hébergements allient respect de l’environnement, circuits courts et harmonie avec la nature. Conçus avec des matériaux durables, ils valorisent les producteurs locaux et intègrent des solutions éco-énergétiques pour offrir une expérience authentique et responsable..</p>
                   </div>
                 </div>
             </div>
           </div>
       </div>
       {/* details title 4 */}


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

    </>
  )
}
