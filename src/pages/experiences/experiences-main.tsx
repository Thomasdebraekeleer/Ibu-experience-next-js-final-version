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

// slider images
const slider_images = [slider_img_1, slider_img_2, slider_img_3, slider_img_4];


const ExperiencesMain = () => {
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
            
            {/* Section expérience IBÙ - Début */}
            
            {/* Titre L'expérience IBÙ avec sous-titre et liens */}
            <div id="ibu-bien-etre-titles" className="tp-project-details-3-top tp-project-details-3-ptb">
              <div className="container container-1560">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-project-details-3-title-box">
                      <h2 className="tp-section-title-160 mb-20 tp-char-animation" style={isMobile ? { fontSize: 'clamp(1.8rem, 7vw, 3.2rem)', whiteSpace: 'nowrap', lineHeight: '1.1' } : {}}>L&apos;expérience IBÙ</h2>
                      <h3 className="tp-section-subtitle-3 tp-char-animation" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)', fontWeight: '500', color: '#053725', marginTop: '10px', marginBottom: '80px' }}>Harmonie & Sérénité</h3>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div className="tp-project-details-3-scroll smooth">
                      <a href="/experiences/ibu-bien-etre" className="pointer">
                        <span>
                          <ScrollDownTwo/>
                        </span>
                        DÉCOUVRIR IBÙ
                      </a>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="tp-project-details-3-link mt-30 text-start text-md-end">
                      <a href="/reservations">
                        Voir les différents logements
                        <span>
                          <UpArrowFour/>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Photo principale */}
            <div className="tp-project-details-3-full-width-thumb mb-120">
              <Image data-speed=".8" src={full_image} alt="Expérience IBÙ" style={{ height: 'auto' }}/>
            </div>
            
            {/* Section L'expérience IBÙ */}
            <div className="showcase-details-2-area" style={{ paddingBottom: '40px' }}>
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">L&apos;expérience IBÙ</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-3">
                    <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Une approche holistique
                      </span>
                    </div>
                  </div>
                  <div className="col-xl-9">
                    <div className="showcase-details-2-content-right tp_title_anim">
                      <p className="pb-25">Niché au cœur de la nature, IBÙ vous invite à une parenthèse de sérénité dans un cocon intimiste. Laissez-vous envelopper par la chaleur des infrastructures privatives, prolongez ce moment avec un kit de relaxation aux notes apaisantes, puis réveillez vos sens avec un petit-déjeuner aux saveurs locales. Ici, chaque détail est pensé pour offrir un voyage sensoriel où détente et harmonie se rencontrent.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section Ce que comprend votre expérience - intégrée après la photo */}
            <ExperienceServicesInclusSection
              sectionId="services-section"
              accordionParentId="accordionExample"
            />
            
            {/* Section expérience IBÙ - Fin */}
            
            {/* Section Les options */}
            <div className="showcase-details-2-area pb-120 pt-40">
              <div className="container">
                {/* Titre et sous-titre */}
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
                        <span className="ab-inner-subtitle mb-25" style={{ whiteSpace: 'nowrap' }}>
                          <Leaf/>
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
                        Visite de Chai (30eur/2pers)
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
                          * Pour réserver la visite du Chai, veuillez le préciser en commentaire lors de votre réservation. Le paiement s&apos;effectue directement sur place.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Option 2: Planche apéritif */}
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
                        Planche apéritif dinatoire (40eur/2pers)
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Une généreuse planche composée exclusivement de produits du terroir : assortiment de fromages locaux, charcuteries artisanales, tapenades maison et autres produits frais 100% belges.</p>
                        <p>Une sélection authentique et gourmande, parfaite pour accompagner un verre de vin et débuter votre expérience IBÙ en douceur.</p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '15px',
                          lineHeight: '1.5'
                        }}>
                          * Vin et soft disponible en option dans votre mini bar (Chardonnay, Pinot gris, Effervescent, Kult Kéfir)
                        </p>
                        <p style={{
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          color: '#666',
                          marginTop: '5px',
                          lineHeight: '1.5'
                        }}>
                          * En cas d&apos;allergie, merci de le mentionner en commentaire lors de votre réservation.
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
                
                {/* Option 3: Départ tardif */}
                <div className="row" style={{marginTop: '40px'}}>
                  <div className="col-xl-6 col-lg-6 order-2 order-lg-1">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image src={depart_tardif} alt="Départ tardif" style={{height:'auto', width: '100%'}}/>
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
                        Arrivée anticipée et/ou départ tardif
                      </h5>
                      <div className="showcase-details-2-content-right tp_title_anim">
                        <p>Prolongez votre parenthèse bien-être et profitez encore davantage de votre expérience IBÙ. Que ce soit en arrivant plus tôt pour vous installer tranquillement et découvrir les lieux, ou en prenant le temps de savourer la matinée après une douce grasse matinée ou une promenade dans les environs, cette option vous permet de vivre l&apos;instant sans vous presser.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section fusionnée : NOS COCONS */}
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
                      <Image src={imgSrc} alt="IBÙ Experience Gallery" style={{height:"auto"}}/>
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
