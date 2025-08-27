import React from 'react';
import Image from 'next/image';
import { Leaf, UpArrow, UpArrowTwo, RightArrowOutline } from '@/components/svg';

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
import d_g_img_1 from '@/assets/img/inner-project/showcase/showcase-details-2-11.jpg';
import d_g_img_2 from '@/assets/img/inner-project/showcase/showcase-details-2-12.jpg';
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';

// img data
const img_data = [port_d_1, port_d_2, port_d_3, port_d_4, port_d_5, port_d_6, port_d_7, port_d_8];

export default function PortfolioDetailsShowcaseTwoArea() {
  return (
    <>
    {/* portfolio hero */}
    <div className="showcase-details-2-area showcase-details-2-bg p-relative" style={{backgroundImage: "url(/assets/img/inner-project/showcase/showcase-details-2-1.jpg)"}}>
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
                        <h5 className="showcase-details-2-title mb-20 tp-char-animation" style={{whiteSpace: 'nowrap'}}>IBÙ Experience</h5>
                        <span className="showcase-details-2-subtitle tp_title_anim">L&apos;art de s&apos;évader dans des lieux d&apos;exception</span>
                      </div>
                  </div>
                  <div className="col-xxl-7 col-xl-10">
                      <div className="showcase-details-2-content tp_title_anim">
                        <p>Découvrez des cocons design au cœur de domaines d&apos;exception entre vignobles, châteaux et forêts. IBÙ Experience transforme votre séjour en une parenthèse hors du temps, où bien-être, gastronomie et nature s&apos;unissent pour une immersion intime et mémorable.</p>
                      </div>
                      <div className="showcase-details-2-info-wrap d-flex align-items-center justify-content-between">
                        <div className="showcase-details-2-info tp_fade_bottom">
                            <span>Lieux</span>
                            <h5>Domaines d&apos;exception, vignobles, châteaux</h5>
                        </div>
                        <div className="showcase-details-2-info tp_fade_bottom">
                            <span>Expériences</span>
                            <h5>IBÙ Signature & IBÙ Bien-Être</h5>
                        </div>
                        <div className="showcase-details-2-info tp_fade_bottom">
                            <span>Valeurs</span>
                            <h5>Intimité, authenticité, excellence</h5>
                        </div>
                        <div className="showcase-details-2-info tp_fade_bottom">
                            <span>Disponible dès</span>
                            <h5>2024</h5>
                        </div>
                      </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* portfolio hero */}

      {/* details title  */}
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
                      <p>Dormez en pleine nature, nichés dans des vignobles, châteaux et autres lieux d&apos;exception, à travers la Belgique. Nos pods au design minimaliste et confortable vous accueillent pour une expérience hors du temps, entre élégance, bien-être et gastronomie locale, à vivre avec ceux que vous aimez.</p>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* details title  */}

      {/* moving image */}
      <div className="showcase-details-2-slider-area pb-120">
          <div className="moving-gallery">
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
      {/* moving image */}

      {/* details title 2 */}
      <div className="showcase-details-2-area pb-120">
          <div className="container">
            <div className="row">
                <div className="col-xl-8">
                  <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">The Goal</h4>
                  </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3">
                  <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        L&apos;objectif
                      </span>
                  </div>
                </div>
                <div className="col-xl-9">
                  <div className="showcase-details-2-content-right tp_title_anim">
                      <p className="pb-25">Déposez vos bagages et vos soucis. Éteignez votre téléphone pour rallumer vos sens, enveloppez-vous dans un doux peignoir et respirez la quiétude. Ici, vous vous reconnectez à la nature et à ceux que vous aimez. Bienvenue dans une parenthèse unique : l’Expérience IBÙ, votre moment hors du temps.</p>
                      <p>Un refuge où chaque instant devient précieux. L’Expérience IBÙ, c’est l’alliance de la simplicité et de l’élégance, pour savourer l’essentiel dans un cadre d’exception</p>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* details title 2 */}

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
       <div className="showcase-details-2-area pb-120">
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
                 <div className="col-xl-9">
                   <div className="showcase-details-2-content-right tp_title_anim">
                       <p>Avec <strong>IBÙ Signature</strong>, vivez une parenthèse gastronomique intimiste : un menu raffiné en trois services, imaginé par notre chef privé à partir de produits locaux, dans l’atmosphère apaisante de votre cocon niché en pleine nature.</p>
                       

                       <p>
                        Avec <strong>IBÙ Bien-Être</strong>, plongez dans une bulle de sérénité grâce à un sauna privatif, un bain nordique extérieur et un kit de relaxation, pour un séjour où détente et confort s’entrelacent harmonieusement.</p>
                   </div>
                 </div>
             </div>
           </div>
       </div>
       {/* details title 5 */}

               {/* new showcase images section */}
       <div className="showcase-details-2-grid-area pb-90">
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
    </>
  )
}
