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
import { Autoplay, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

// image imports
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';
import cocons_img_1 from '@/assets/img/inner-project/experiences-cocons/cocons-1.jpg';
import cocons_img_2 from '@/assets/img/inner-project/experiences-cocons/cocons-2.jpg';
import cocons_img_3 from '@/assets/img/inner-project/experiences-cocons/cocons-3.jpg';
import cocons_img_4 from '@/assets/img/inner-project/experiences-cocons/cocons-4.jpg';

// nouvelles images pour la section Le logement
import logement_img_1 from '@/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-5.jpg';
import logement_img_2 from '@/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-6.jpg';

// image pour la section parallax
import parallax_img from '@/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-7.jpg';
import visite_chai from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Visite de Chai.webp';
import planche_aperitif from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Planche apéritif.webp';
import planche_gourmande from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Planche Gourmande.webp';
import depart_tardif from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Départ tardif.webp';

// slider images for Domaine de Mehaignoul
const slider_images = [
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-2.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-3.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-4.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-9.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-10.jpg',
  '/assets/img/inner-project/portfolio-details-domaine-mehaignoul/Domaine-de-Mehaignoul-img-1.jpg'
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
import ExperienceServicesInclusSection from "@/components/experience/experience-services-inclus-section";
import PetitDejeunerOptionRow from "@/components/experience/petit-dejeuner-option-row";

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
                            <p>Situé au cœur de la Wallonie à seulement 30 min de Bruxelles, le domaine de Mehaignoul est une ferme en carré datant du 13e siècle d&apos;une exceptionnelle authenticité. En plus de sa première fonction agricole, elle dispose d&apos;un charmant vignoble où règne une atmosphère champêtre et dépaysante.</p>
                        </div>
                      </div>
                  </div>
                  
                  {/* Section Widgets Lodgify - Cocon 1 et Cocon 2 */}
                  <div className="row cocons-widgets-row" style={{marginTop: '80px', marginBottom: '40px'}}>
                    {/* Colonne Cocon 1 */}
                    <div className="col-lg-6 mb-lg-0 cocon-widget-col">
                      <div className="lodgify-widget-container">
                        <h5 className="text-center mb-4" style={{
                          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                          fontWeight: '600',
                          color: '#053725'
                        }}>Cocon IBÙ 1</h5>
                        <div className="widget-photo-container mb-4" style={{
                          width: '100%',
                          maxHeight: '200px',
                          overflow: 'hidden',
                          borderRadius: '0'
                        }}>
                          <Image 
                            src="/assets/img/inner-project/Cocons/Cocon1.webp"
                            alt="Cocon IBÙ 1" 
                            width={500}
                            height={200}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '0'
                            }}
                          />
                        </div>
                        <a 
                          href="https://ibu-experience.lodgify.com/fr/ibu-experience---cocon-1---domaine-de-mehaignoul"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '60px',
                            lineHeight: '60px',
                            borderRadius: '0',
                            padding: '0 42px',
                            fontWeight: 500,
                            fontSize: '16px',
                            letterSpacing: '0.03em',
                            textAlign: 'center',
                            textDecoration: 'none',
                            textTransform: 'capitalize',
                            backgroundColor: '#053725',
                            color: 'white',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#074d32';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#053725';
                          }}
                        >
                          Voir les disponibilités
                        </a>
                      </div>
                    </div>
                    
                    {/* Colonne Cocon 2 */}
                    <div className="col-lg-6 mb-lg-0 cocon-widget-col">
                      <div className="lodgify-widget-container">
                        <h5 className="text-center mb-4" style={{
                          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                          fontWeight: '600',
                          color: '#053725'
                        }}>Cocon IBÙ 2</h5>
                        <div className="widget-photo-container mb-4" style={{
                          width: '100%',
                          maxHeight: '200px',
                          overflow: 'hidden',
                          borderRadius: '0'
                        }}>
                          <Image 
                            src="/assets/img/inner-project/Cocons/Cocon2.webp"
                            alt="Cocon IBÙ 2" 
                            width={500}
                            height={200}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '0'
                            }}
                          />
                        </div>
                        <a 
                          href="https://npreview-ibu-experience.lodgify.com/fr/ibu-experience---cocon-2---domaine-de-mehaignoul"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            width: '100%',
                            height: '60px',
                            lineHeight: '60px',
                            borderRadius: '0',
                            padding: '0 42px',
                            fontWeight: 500,
                            fontSize: '16px',
                            letterSpacing: '0.03em',
                            textAlign: 'center',
                            textDecoration: 'none',
                            textTransform: 'capitalize',
                            backgroundColor: '#053725',
                            color: 'white',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#074d32';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#053725';
                          }}
                        >
                          Voir les disponibilités
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Styles pour espacer correctement les cocons sur mobile */}
                  <style jsx>{`
                    @media (max-width: 991px) {
                      .cocons-widgets-row {
                        margin-bottom: 160px !important;
                      }
                      .cocon-widget-col {
                        margin-bottom: 50px !important;
                      }
                      .cocon-widget-col:last-child {
                        margin-bottom: 0 !important;
                      }
                    }
                  `}</style>
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
            <div className="showcase-details-2-area pb-120 logement-section-domaine">
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
                              alt="Le logement IBÙ" 
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
                    
                    {/* Styles pour les indicateurs de pagination des cocons */}
                    <style jsx>{`
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
                    `}</style>
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
            {/* Le logement section */}

            <ExperienceServicesInclusSection
              sectionId="services-section-domaine"
              accordionParentId="accordion-domaine-inclus"
              collapseIdPrefix="collapse-domaine-inclus"
            />

            <div className="showcase-details-2-area pb-120 pt-40">
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Les options</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25" style={{ whiteSpace: "nowrap" }}>
                        <Leaf />
                        Personnalisez votre séjour inoubliable
                      </span>
                    </div>
                  </div>
                </div>
                {/* Option 1: Visite de Chai — image à gauche, texte à droite */}
                <div className="row" style={{marginTop: '20px'}}>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={visite_chai} alt="Visite de Chai" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Visite de Chai (avec dégustation) - 60EUR / 2 pers.
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Découvrez les coulisses de la vinification au cœur du chai : fermentation, élevage en cuve ou en barrique, et secrets de production. Une immersion guidée, authentique et sensorielle pour comprendre le savoir-faire du domaine et apprécier les vins autrement.</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          * Pour réserver la visite du chai (avec dégustation), veuillez sélectionner l&apos;option lors de votre réservation. Tarif : 60EUR / 2 pers. Paiement directement sur place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 2: Planche apéritive */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Planche apéritive (40eur/2pers)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Une délicate planche apéritive composée de produits du terroir : sélection de fromages locaux, charcuteries artisanales et accompagnements de saison.</p>
                        <p>Parfaite pour accompagner votre bouteille de bienvenue et savourer un premier moment au cœur des vignes.</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          * Vin et soft disponible en option dans votre mini bar (Chardonnay, Pinot gris, Effervescent, Kult Kéfir)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={planche_aperitif} alt="Planche apéritif" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>

                {/* Option 3: Planche gourmande dinatoire — image à gauche, texte à droite */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={planche_gourmande} alt="Planche gourmande dinatoire" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Planche gourmande dinatoire (65eur/2pers)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Une généreuse planche gourmande aux saveurs du terroir : assortiment de fromages locaux, charcuteries artisanales, tapenades maison et produits frais 100% belges.</p>
                        <p>Une expérience complète et conviviale, idéale pour un dîner à deux au cœur des vignes.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 4: Départ tardif — texte à gauche, photo à droite */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6">
                    <div className="mb-30">
                      <h5 className="visite-chai-title" style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        fontWeight: '500',
                        color: '#053725',
                        marginTop: '10px',
                        marginBottom: '20px',
                        lineHeight: '1.4',
                        display: 'block',
                        textTransform: 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}>
                        Départ tardif (13h30) (31eur)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>
                          Prolongez votre parenthèse bien-être : au lieu de quitter les lieux à l&apos;heure habituelle du check-out, profitez encore de votre cocon et quittez tranquillement à&nbsp;13h30. Idéal pour savourer une grasse matinée, un dernier moment au sauna ou au bain nordique, ou une balade dans les environs avant de reprendre la route.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={depart_tardif} alt="Départ tardif" style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>

                {/* Option 5: Petit déjeuner local */}
                <PetitDejeunerOptionRow />
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

export default DomaineDeMehaignoulMain;
