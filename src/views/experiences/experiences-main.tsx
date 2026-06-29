'use client';
import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";
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
import { Link } from "@/i18n/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Leaf, RightArrowOutline, LitDoubleIcon, BathroomIcon, KitchenetteIcon, GardeRobeIcon, ScrollDownTwo, UpArrowFour, UpArrow } from '@/components/svg';

// image imports
import showcase_img_14 from '@/assets/img/inner-project/showcase/showcase-details-2-14.jpg';
import showcase_img_15 from '@/assets/img/inner-project/showcase/showcase-details-2-15.jpg';
import cocons_img_1 from '@/assets/img/inner-project/experiences-cocons/cocons-1.jpg';
import cocons_img_2 from '@/assets/img/inner-project/experiences-cocons/cocons-2.jpg';
import cocons_img_3 from '@/assets/img/inner-project/experiences-cocons/cocons-3.jpg';
import cocons_img_4 from '@/assets/img/inner-project/experiences-cocons/cocons-4.jpg';
import full_image from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-1.jpg';
import full_image_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-2.jpg';
import visite_chai from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Visite de Chai.webp';
import planche_aperitif from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Planche apéritif.webp';
import planche_gourmande from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Planche Gourmande.webp';
import depart_tardif from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/Départ tardif.webp';
import slider_img_1 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-5.jpg';
import slider_img_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-6.jpg';
import slider_img_3 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-7.jpg';
import slider_img_4 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-8.jpg';

// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";
import ExperienceServicesInclusSection from "@/components/experience/experience-services-inclus-section";
import PetitDejeunerOptionRow from "@/components/experience/petit-dejeuner-option-row";

// slider images
const slider_images = [slider_img_1, slider_img_2, slider_img_3, slider_img_4];

const COCON_FEATURE_KEYS = [
  "doubleBed",
  "bathroom",
  "kitchenette",
  "wardrobe",
] as const;

const COCON_FEATURE_ICONS = [
  LitDoubleIcon,
  BathroomIcon,
  KitchenetteIcon,
  GardeRobeIcon,
];

const ExperiencesMain = () => {
  const locale = useLocale();
  const t = useTranslations("experiences");
  const bienEtreRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useScrollSmooth();
  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    }
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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
      
      // Activer l'effet hover pour IBÙ
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
  }, [locale]);

  const renderCoconFeatures = (mobile = false) =>
    COCON_FEATURE_KEYS.map((key, index) => {
      const Icon = COCON_FEATURE_ICONS[index];
      return (
        <div
          key={key}
          className={mobile ? "col-6" : "col-xl-3 col-lg-3"}
        >
          <div className="cocon-feature-item text-center">
            <div
              className={`cocon-icon-wrapper ${mobile ? "mb-15" : "mb-20"}`}
            >
              <Icon />
            </div>
            <h6
              className="cocon-feature-title"
              style={mobile ? { fontSize: "14px" } : undefined}
            >
              {t(`cocons.features.${key}`)}
            </h6>
          </div>
        </div>
      );
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
        <div id="smooth-content" key={locale}>
          <main>
            
            {/* Section expérience IBÙ - Début */}
            
            {/* Titre L'expérience IBÙ avec sous-titre et liens */}
            <div id="ibu-bien-etre-titles" className="tp-project-details-3-top tp-project-details-3-ptb">
              <div className="container container-1560">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-project-details-3-title-box">
                      <h2 className="tp-section-title-160 mb-20 tp-char-animation" style={isMobile ? { fontSize: 'clamp(1.8rem, 7vw, 3.2rem)', whiteSpace: 'nowrap', lineHeight: '1.1' } : {}}>{t("hero.title")}</h2>
                      <h3 className="tp-section-subtitle-3 tp-char-animation" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', fontWeight: '500', color: '#053725', marginTop: '10px', marginBottom: '80px' }}>{t("hero.subtitle")}</h3>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div className="tp-project-details-3-scroll smooth">
                      <Link href="/experiences/ibu-bien-etre" className="pointer">
                        <span>
                          <ScrollDownTwo/>
                        </span>
                        {t("hero.discoverCta")}
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="tp-project-details-3-link mt-30 text-start text-md-end">
                      <Link href="/reservations">
                        {t("hero.lodgingsLink")}
                        <span>
                          <UpArrowFour/>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Photo principale */}
            <div className="tp-project-details-3-full-width-thumb mb-120">
              <Image data-speed=".8" src={full_image} alt={t("hero.heroImageAlt")} style={{ height: 'auto' }}/>
            </div>
            
            {/* Section L'expérience IBÙ */}
            <div className="showcase-details-2-area" style={{ paddingBottom: '40px' }}>
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">{t("intro.title")}</h4>
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
                      <p className="pb-25">{t("intro.paragraph")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section Ce que comprend votre expérience - intégrée après la photo */}
            <ExperienceServicesInclusSection
              sectionId="services-section"
              accordionParentId="accordionExample"
              localize
            />
            
            {/* Section expérience IBÙ - Fin */}
            
            {/* Section Les options */}
            <div className="showcase-details-2-area pb-120 pt-40">
              <div className="container">
                {/* Titre et sous-titre */}
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box">
                        <h4 className="showcase-details-2-section-title tp-char-animation">{t("options.title")}</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-left">
                        <span className="ab-inner-subtitle mb-25" style={{ whiteSpace: 'nowrap' }}>
                          <Leaf/>
                          {t("options.subtitle")}
                        </span>
                    </div>
                  </div>
                </div>
                
                {/* Option 1: Visite de Chai — image à gauche, texte à droite (mobile : titre + texte puis photo) */}
                <div className="row" style={{marginTop: '20px'}}>
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={visite_chai} alt={t("options.cellarVisit.imageAlt")} style={{height:'auto', width: '100%'}}/>
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
                        {t("options.cellarVisit.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>{t("options.cellarVisit.paragraph")}</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          {t("options.cellarVisit.footnote")}
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
                        {t("options.aperitifBoard.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>{t("options.aperitifBoard.paragraph1")}</p>
                        <p>{t("options.aperitifBoard.paragraph2")}</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          {t("options.aperitifBoard.footnote")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={planche_aperitif} alt={t("options.aperitifBoard.imageAlt")} style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>
                
                {/* Option 3: Planche gourmande dinatoire — image à gauche, texte à droite (mobile : titre + texte puis photo) */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={planche_gourmande} alt={t("options.dinnerBoard.imageAlt")} style={{height:'auto', width: '100%'}}/>
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
                        {t("options.dinnerBoard.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>{t("options.dinnerBoard.paragraph1")}</p>
                        <p>{t("options.dinnerBoard.paragraph2")}</p>
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
                        {t("options.lateCheckout.title")}
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>
                          {t("options.lateCheckout.paragraph")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={depart_tardif} alt={t("options.lateCheckout.imageAlt")} style={{height:'auto', width: '100%'}}/>
                    </div>
                  </div>
                </div>

                {/* Option 5: Petit déjeuner local */}
                <PetitDejeunerOptionRow localize />
              </div>
            </div>
            
            {/* Section fusionnée : NOS COCONS */}
            <div className="showcase-details-2-area pb-120 pt-120">
              <div className="container">
                {/* Section NOS COCONS */}
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
                          <p>{t("cocons.paragraph1")}</p>
                          <p style={{marginBottom: '50px'}}>{t("cocons.paragraph2")}</p>
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
                  
                </div>
                
                {/* Icônes des cocons - Version PC */}
                <div className="row d-none d-lg-flex" style={{marginTop: '40px', marginBottom: '60px'}}>
                    {renderCoconFeatures()}
                </div>

                {/* Icônes des cocons - Version Mobile (2x2) */}
                <div className="d-block d-lg-none" style={{marginTop: '40px', marginBottom: '60px'}}>
                  <div className="row">
                    {renderCoconFeatures(true).slice(0, 2)}
                  </div>
                  
                  <div className="row" style={{marginTop: '30px'}}>
                    {renderCoconFeatures(true).slice(2, 4)}
                  </div>
                </div>
                    </div>
                  </div>
            {/* details title 5 */}

            {/* Bouton Lieux et Disponibilités */}
            <div className="tp-project-details-3-thumb pb-130">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-projct-5-2-btn-box d-flex justify-content-center">
                      <div className="tp-hover-btn-wrapper">
                        <Link href="/reservations" className="tp-btn-circle style-2 tp-hover-btn-item tp-hover-btn not-hide-cursor" data-cursor={t("cta.cursor")}>
                          <span className="tp-btn-circle-text">
                            {t("cta.line1")} <br /> {t("cta.line2")}
                        </span>
                          <span className="tp-btn-circle-icon">
                            <UpArrow />
                            </span>
                          <i className="tp-btn-circle-dot"></i>
                        </Link>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carrousel d'images */}
            <div className="pd-visual-slider-wrap pb-120">
              <Swiper
                slidesPerView={3}
                loop={true}
                autoplay={true}
                spaceBetween={20}
                speed={1000}
                breakpoints={{
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
                }}
                modules={[Autoplay]}
                className="swiper-container pd-visual-slider-active"
              >
                {slider_images.map((imgSrc, index) => (
                  <SwiperSlide key={index}>
                    <div className="pd-visual-slider-thumb fix">
                      <Image src={imgSrc} alt={t("gallery.alt")} style={{height:"auto"}}/>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>


            {/* footer area start */}
            <FooterThree />
            {/* footer area end */}

          </main>
        </div>
      </div>

      {/* Styles pour l'effet de scroll mobile sur les formules et pagination des cocons */}
      <style jsx>{`
        .tp-section-subtitle-3 {
          font-size: clamp(1.8rem, 4.5vw, 3rem) !important;
          font-weight: 500 !important;
          color: #053725 !important;
          margin-top: 10px !important;
          margin-bottom: 80px !important;
          line-height: 1.1 !important;
          white-space: nowrap !important;
        }
        
        @media (max-width: 991px) {
          .showcase-hover-container.mobile-hover-active .showcase-hover-text {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
          }
          
          .showcase-hover-container.mobile-hover-active .showcase-image-link::before {
            opacity: 0.8 !important;
          }
          
          #ibu-bien-etre-titles .tp-project-details-3-title-box .tp-section-title-160 {
            white-space: nowrap !important;
            font-size: clamp(1.5rem, 6vw, 2.8rem) !important;
            line-height: 1.1 !important;
            word-break: normal !important;
          }
          
          .tp-section-subtitle-3 {
            font-size: clamp(1.2rem, 3.5vw, 1.8rem) !important;
            white-space: nowrap !important;
            margin-top: 10px !important;
            margin-bottom: 80px !important;
            font-weight: 500 !important;
            color: #053725 !important;
            line-height: 1.1 !important;
          }
          
          /* Permettre au titre CE QUE COMPREND de passer sur 2 lignes sur mobile */
          .ce-que-comprend-title {
            white-space: normal !important;
            word-wrap: break-word !important;
          }
          
          .tp-project-details-3-thumb-box img {
            height: 60vh !important;
            object-fit: cover !important;
            object-position: center !important;
          }
          
          .showcase-details-2-area.pb-120 {
            padding-bottom: 40px !important;
          }
          
          .tp-project-details-3-thumb.mb-120 {
            margin-top: -20px !important;
            margin-bottom: 60px !important;
          }
          
          .tp-service-2-title-box.mb-70 {
            margin-bottom: 15px !important;
          }
          
          .tp-service-2-area .row.align-items-center {
            margin-top: -30px !important;
          }
          
          .tp-service-2-area.tp-service-2-pt.pb-150 {
            padding-bottom: 30px !important;
          }
          
          /* Réduction des espacements spécifiques sur mobile */
          .tp-project-details-3-full-width-thumb.mb-120 {
            margin-bottom: -140px !important;
          }
          
          /* Styles pour les titres des options sur mobile */
          .visite-chai-title {
            font-size: clamp(1.5rem, 4vw, 2rem) !important;
            font-weight: 700 !important;
          }
        }
        
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
    </Wrapper>
  );
};

export default ExperiencesMain;
