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

// Gallery images from A propos folder
import gallery_img_1 from '@/assets/img/inner-project/A propos/showcase-details-2-2 bis.jpg';
import gallery_img_2 from '@/assets/img/inner-project/A propos/showcase-details-2-3 bis.jpg';
import gallery_img_3 from '@/assets/img/inner-project/A propos/showcase-details-2-4 - bis.jpg';
import gallery_img_4 from '@/assets/img/inner-project/A propos/showcase-details-2-5 bis.jpg';
import gallery_img_5 from '@/assets/img/inner-project/A propos/showcase-details-2-6 bis.jpg';
import gallery_img_6 from '@/assets/img/inner-project/A propos/showcase-details-2-7 bis.jpg';
import gallery_img_7 from '@/assets/img/inner-project/A propos/showcase-details-2-8 bis.jpg';
import gallery_img_8 from '@/assets/img/inner-project/A propos/showcase-details-2-9 bis.jpg';

// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";
import { movingImageSlider } from "@/utils/scroll-marque";
import VideoTwo from "@/components/video/video-two";

// Gallery data
const gallery_data = [gallery_img_1, gallery_img_2, gallery_img_3, gallery_img_4, gallery_img_5, gallery_img_6, gallery_img_7, gallery_img_8];

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
      movingImageSlider();
      hoverBtn();
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper showBackToTop={false}>
      {/* Style fix pour le titre "UNE HISTOIRE DE FAMILLE" */}
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
                <div className="row align-items-center">
                  {/* Image à gauche */}
                  <div className="col-xl-5 col-lg-5">
                    <div className="histoire-famille-image mb-30">
                      <Image 
                        src={histoire_famille_img} 
                        alt="Une histoire de famille" 
                        style={{height: 'auto', width: '100%'}}
                      />
                    </div>
                  </div>
                  
                  {/* Contenu à droite */}
                  <div className="col-xl-7 col-lg-7">
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
              
              {/* Moving Gallery */}
              <div className="moving-gallery" style={{marginTop: '80px'}}>
                <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-top d-flex align-items-end mb-20">
                  {gallery_data.slice(0,4).map((imgSrc,i) => (
                    <div key={i} className="showcase-details-2-slider-item">
                      <Image src={imgSrc} alt={`gallery-img-${i+1}`} style={{height:"auto"}}/>
                    </div>
                  ))}
                </div>
              </div>

              <div className="moving-gallery">
                <div className="showcase-details-2-slider-wrap wrapper-gallery slider-wrap-bottom d-flex align-items-end">
                  {gallery_data.slice(4,8).map((imgSrc,i) => (
                    <div key={i+4} className="showcase-details-2-slider-item">
                      <Image src={imgSrc} alt={`gallery-img-${i+5}`} style={{height:"auto"}}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Gallery Section end */}

            {/* Section Work in motion */}
            <VideoTwo />
            {/* Section Work in motion end */}


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
