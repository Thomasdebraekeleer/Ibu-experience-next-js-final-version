'use client';
import { gsap } from "gsap";
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
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
import {
  getLodgifyMehaignoulCocon1Url,
  getLodgifyMehaignoulCocon2Url,
} from "@/config/lodgify";
import type { Locale } from "@/i18n/routing";

const COCON_FEATURE_KEYS = [
  "doubleBed",
  "bathroom",
  "kitchenette",
  "wardrobe",
] as const;

const DomaineDeMehaignoulMain = () => {
  const locale = useLocale() as Locale;
  const t = useTranslations("domaineMehaignoul");
  const tExp = useTranslations("experiences");
  const cocon1BookingUrl = getLodgifyMehaignoulCocon1Url(locale);
  const cocon2BookingUrl = getLodgifyMehaignoulCocon2Url(locale);

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
  }, [locale]);

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
        <div id="smooth-content" key={locale}>
          <main>
            
            {/* NOS COCONS IBÙ Experience section */}
            <div className="showcase-details-2-area pb-120 pt-120">
                <div className="container">
                                     <div className="row">
                       <div className="col-xl-12">
                                                  <div className="showcase-details-2-section-box">
                              <h4 className="showcase-details-2-section-title tp-char-animation">
                                {t("hero.titleLine1")}<br />
                                {t("hero.titleLine2")}
                              </h4>
                          </div>
                       </div>
                   </div>
                  <div className="row">
                      <div className="col-xl-3">
                        <div className="showcase-details-2-section-left">
                            <span className="ab-inner-subtitle mb-25">
                              <Leaf/>
                              {t("intro.subtitle")}
                            </span>
                        </div>
                      </div>
                      <div className="col-xl-9">
                        <div className="showcase-details-2-content-right tp_title_anim">
                            <p>{t("intro.paragraph")}</p>
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
                        }}>{t("booking.cocon1.title")}</h5>
                        <div className="widget-photo-container mb-4" style={{
                          width: '100%',
                          maxHeight: '200px',
                          overflow: 'hidden',
                          borderRadius: '0'
                        }}>
                          <Image 
                            src="/assets/img/inner-project/Cocons/Cocon1.webp"
                            alt={t("booking.cocon1.imageAlt")} 
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
                          href={cocon1BookingUrl}
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
                          {t("booking.cocon1.availabilityCta")}
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
                        }}>{t("booking.cocon2.title")}</h5>
                        <div className="widget-photo-container mb-4" style={{
                          width: '100%',
                          maxHeight: '200px',
                          overflow: 'hidden',
                          borderRadius: '0'
                        }}>
                          <Image 
                            src="/assets/img/inner-project/Cocons/Cocon2.webp"
                            alt={t("booking.cocon2.imageAlt")} 
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
                          href={cocon2BookingUrl}
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
                          {t("booking.cocon2.availabilityCta")}
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
                                  alt={t("gallery.alt")} 
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
                            <h4 className="showcase-details-2-section-title tp-char-animation">{t("cocons.title")}</h4>
                        </div>
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-xl-3">
                        <div className="showcase-details-2-section-left">
                            <span className="ab-inner-subtitle mb-25">
                              <Leaf/>
                              {t("cocons.subtitle")}
                            </span>
                        </div>
                      </div>
                      <div className="col-xl-9">
                        <div className="showcase-details-2-content-right tp_title_anim">
                            <p className="pb-25">{t("cocons.paragraph")}</p>
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
                              alt={t("cocons.carouselAlt")} 
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
                            <h6 className="cocon-feature-title">{tExp(`cocons.features.${COCON_FEATURE_KEYS[0]}`)}</h6>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-3">
                        <div className="cocon-feature-item text-center">
                            <div className="cocon-icon-wrapper mb-20">
                                <BathroomIcon />
                            </div>
                            <h6 className="cocon-feature-title">{tExp(`cocons.features.${COCON_FEATURE_KEYS[1]}`)}</h6>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-3">
                        <div className="cocon-feature-item text-center">
                            <div className="cocon-icon-wrapper mb-20">
                                <KitchenetteIcon />
                            </div>
                            <h6 className="cocon-feature-title">{tExp(`cocons.features.${COCON_FEATURE_KEYS[2]}`)}</h6>
                        </div>
                      </div>
                      <div className="col-xl-3 col-lg-3">
                        <div className="cocon-feature-item text-center">
                            <div className="cocon-icon-wrapper mb-20">
                                <GardeRobeIcon />
                            </div>
                            <h6 className="cocon-feature-title">{tExp(`cocons.features.${COCON_FEATURE_KEYS[3]}`)}</h6>
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
                          <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>{tExp(`cocons.features.${COCON_FEATURE_KEYS[0]}`)}</h6>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="cocon-feature-item text-center">
                          <div className="cocon-icon-wrapper mb-15">
                            <BathroomIcon />
                          </div>
                          <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>{tExp(`cocons.features.${COCON_FEATURE_KEYS[1]}`)}</h6>
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
                          <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>{tExp(`cocons.features.${COCON_FEATURE_KEYS[2]}`)}</h6>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="cocon-feature-item text-center">
                          <div className="cocon-icon-wrapper mb-15">
                            <GardeRobeIcon />
                          </div>
                          <h6 className="cocon-feature-title" style={{fontSize: '14px'}}>{tExp(`cocons.features.${COCON_FEATURE_KEYS[3]}`)}</h6>
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
              localize
            />

            <div className="showcase-details-2-area pb-120 pt-40">
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">{tExp("options.title")}</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25" style={{ whiteSpace: "nowrap" }}>
                        <Leaf />
                        {tExp("options.subtitle")}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Option 1: Visite de Chai — image à gauche, texte à droite (mobile : titre + texte puis photo) */}
                <div className="row" style={{marginTop: '20px'}}>
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={visite_chai} alt={tExp("options.cellarVisit.imageAlt")} style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 order-1 order-lg-2">
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
                        {tExp("options.cellarVisit.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>{tExp("options.cellarVisit.paragraph")}</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          {tExp("options.cellarVisit.footnote")}
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
                        {tExp("options.aperitifBoard.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>{tExp("options.aperitifBoard.paragraph1")}</p>
                        <p>{tExp("options.aperitifBoard.paragraph2")}</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          {tExp("options.aperitifBoard.footnote")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={planche_aperitif} alt={tExp("options.aperitifBoard.imageAlt")} style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>

                {/* Option 3: Planche gourmande dinatoire — image à gauche, texte à droite (mobile : titre + texte puis photo) */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={planche_gourmande} alt={tExp("options.dinnerBoard.imageAlt")} style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 order-1 order-lg-2">
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
                        {tExp("options.dinnerBoard.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>{tExp("options.dinnerBoard.paragraph1")}</p>
                        <p>{tExp("options.dinnerBoard.paragraph2")}</p>
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
                        {tExp("options.lateCheckout.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>
                          {tExp("options.lateCheckout.paragraph")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={depart_tardif} alt={tExp("options.lateCheckout.imageAlt")} style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>

                {/* Option 5: Petit déjeuner local */}
                <PetitDejeunerOptionRow localize />
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
