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
import Image from 'next/image';

// Images pour la section partenaire
import partner_img_1 from '@/assets/img/inner-project/Devenir un partenaire/Devenir un partenaire image 1.webp';
import partner_img_2 from '@/assets/img/inner-project/Devenir un partenaire/Devenir un partenaire image 2.webp';
import partner_img_3 from '@/assets/img/inner-project/Devenir un partenaire/Devenir un partenaire image 3.webp';
import { Leaf } from '@/components/svg';

// Icônes SVG pour la section avantages partenaires
const PatrimoineIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 374 374">
    <path d="M352,64.198h-30c-12.131,0-22,9.869-22,22v21.04L206.797,18.71c-11.101-10.545-28.493-10.544-39.594,0
      L74,107.238v-21.04c0-12.131-9.869-22-22-22H22c-12.131,0-22,9.869-22,22v277h55.5H74h226h18.5H374v-277
      C374,74.067,364.131,64.198,352,64.198z M54,343.198H20v-257c0-1.103,0.897-2,2-2h30c1.103,0,2,0.897,2,2V343.198z M180.977,33.211
      c3.378-3.208,8.669-3.208,12.047,0l98.951,93.987h-23.599c-8.202,0-14.875,6.673-14.875,14.875v12.125h-34v-12.125
      c0-8.202-6.673-14.875-14.875-14.875h-35.25c-8.202,0-14.875,6.673-14.875,14.875v12.125h-34v-12.125
      c0-8.202-6.673-14.875-14.875-14.875H82.026L180.977,33.211z M227,343.198h-80v-58.125c0-17.3,14.075-31.375,31.375-31.375h17.25
      c17.3,0,31.375,14.075,31.375,31.375V343.198z M298.5,343.198H247v-58.125c0-28.328-23.047-51.375-51.375-51.375h-17.25
      c-28.328,0-51.375,23.047-51.375,51.375v58.125H75.5v-196h25v12.125c0,8.202,6.673,14.875,14.875,14.875h44.25
      c8.202,0,14.875-6.673,14.875-14.875v-12.125h25v12.125c0,8.202,6.673,14.875,14.875,14.875h44.25
      c8.202,0,14.875-6.673,14.875-14.875v-12.125h25V343.198z M354,343.198h-34v-257c0-1.103,0.897-2,2-2h30c1.103,0,2,0.897,2,2
      V343.198z"/>
  </svg>
);

const RevenusIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M3,10 L3,12 L1,12 L1,5 C1,3.8954305 1.81402773,3 2.81818182,3 L21.1818182,3 C22.1859723,3 23,3.8954305 23,5 L23,17 C23,18.1045695 22.1859723,19 21.1818182,19 L11,19 L11,17 L21,17 L21,10 L3,10 Z M3,8 L21,8 L21,5 L3,5 L3,8 Z M5.58578644,17 L1,17 L1,15 L5.58578644,15 L4.29289322,13.7071068 L5.70710678,12.2928932 L9.41421356,16 L5.70710678,19.7071068 L4.29289322,18.2928932 L5.58578644,17 Z"/>
  </svg>
);

const ClienteleIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g>
      <path d="M24,15.9c0-2.8-1.5-5-3.7-6.1C21.3,8.8,22,7.5,22,6c0-2.8-2.2-5-5-5c-2.1,0-3.8,1.2-4.6,3c0,0,0,0,0,0c-0.1,0-0.3,0-0.4,0
        c-0.1,0-0.3,0-0.4,0c0,0,0,0,0,0C10.8,2.2,9.1,1,7,1C4.2,1,2,3.2,2,6c0,1.5,0.7,2.8,1.7,3.8C1.5,10.9,0,13.2,0,15.9V20h5v3h14v-3h5
        V15.9z M17,3c1.7,0,3,1.3,3,3c0,1.6-1.3,3-3,3c0-1.9-1.1-3.5-2.7-4.4c0,0,0,0,0,0C14.8,3.6,15.8,3,17,3z M13.4,4.2
        C13.4,4.2,13.4,4.2,13.4,4.2C13.4,4.2,13.4,4.2,13.4,4.2z M15,9c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S15,7.3,15,9z M10.6,4.2
        C10.6,4.2,10.6,4.2,10.6,4.2C10.6,4.2,10.6,4.2,10.6,4.2z M7,3c1.2,0,2.2,0.6,2.7,1.6C8.1,5.5,7,7.1,7,9C5.3,9,4,7.7,4,6S5.3,3,7,3
        z M5.1,18H2v-2.1C2,13.1,4.1,11,7,11v0c0,0,0,0,0,0c0.1,0,0.2,0,0.3,0c0,0,0,0,0,0c0.3,0.7,0.8,1.3,1.3,1.8
        C6.7,13.8,5.4,15.7,5.1,18z M17,21H7v-2.1c0-2.8,2.2-4.9,5-4.9c2.9,0,5,2.1,5,4.9V21z M22,18h-3.1c-0.3-2.3-1.7-4.2-3.7-5.2
        c0.6-0.5,1-1.1,1.3-1.8c0.1,0,0.2,0,0.4,0v0c2.9,0,5,2.1,5,4.9V18z"/>
    </g>
  </svg>
);

const NotorieteIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <g>
      <g>
        <path d="m480.5,460.2l-428.5-.2 .2-428.6c0-11.3-9.3-20.3-20.5-20.4-11.3,0-20.5,9.1-20.5,20.4l-.2,449c0,5.4 2.2,10.6 6,14.4 3.6,3.6 8.3,5.7 13.4,5.9 0.4,0 0.7,0 1.1,0l449,.2c11.3,0 20.5-9.1 20.5-20.4 0-11.2-9.2-20.3-20.5-20.3z"/>
        <path d="m118.6,401.9l112.7-94 143.6-7.8c7.6-0.4 14.3-5 17.5-11.8l51.4-110.5 11,24.1c8.1,16 23,11.9 27.2,10.1 10.4-4.4 14.8-16.8 10.1-27l-31.8-69.4c-6.9-14.3-22.1-13-27.4-10l-68.3,32.2c-10.2,4.8-14.6,17-9.8,27.2 4.8,10.2 17.1,14.5 27.3,9.7l23-10.9-44.7,96.2-138.2,7.5c-4.4,0.2-8.6,1.9-12,4.7l-117.9,98.4c-8.7,7.2-9.7,20-2.6,28.8 7,8.4 20.7,9.8 28.9,2.5z"/>
      </g>
    </g>
  </svg>
);

const SynergiesIcon = () => (
  <svg fill="#053725" height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12.2407 2.96432C12.0063 2.96432 11.797 3.07184 11.6595 3.24024L11.6024 3.28346C9.45801 2.63339 7.03194 3.15091 5.33598 4.83602C3.82743 6.33492 3.24863 8.40778 3.59957 10.3471L3.58455 10.3619L2.6274 11.3129C1.7951 12.1399 1.7951 13.4807 2.6274 14.3077C3.11636 14.7935 3.78381 14.9939 4.42002 14.9089C4.51377 15.2552 4.6974 15.5824 4.9709 15.8542C5.34265 16.2235 5.81755 16.4279 6.30347 16.4673C6.34307 16.9503 6.54878 17.4223 6.92061 17.7917C7.30952 18.1781 7.81134 18.384 8.32054 18.4093C8.34607 18.9151 8.55325 19.4136 8.94208 19.7999C9.70236 20.5554 10.8942 20.6207 11.7291 19.996L12.1156 20.3801C12.952 21.2111 14.3079 21.2111 15.1443 20.3801C15.5147 20.012 15.721 19.5428 15.7633 19.0621C16.2462 19.021 16.7177 18.8168 17.0874 18.4495C17.4581 18.0812 17.6636 17.6114 17.7043 17.1303C18.1809 17.0858 18.6453 16.8821 19.0104 16.5193C19.2966 16.235 19.4844 15.89 19.5738 15.526C20.2005 15.6003 20.854 15.3986 21.3349 14.9208C22.1672 14.0938 22.1672 12.753 21.3349 11.926L20.5014 11.0979L20.6727 10.4313C21.045 8.98208 20.8578 7.44693 20.1482 6.12848C19.1007 4.182 17.0615 2.96933 14.8448 2.96933L13.2381 2.96933C13.1696 2.96601 13.1008 2.96432 13.0316 2.96432H12.2407ZM15.1649 7.90945L18.6286 11.351L18.6325 11.3551L18.6458 11.3687L20.2708 12.9833C20.5155 13.2264 20.5155 13.6205 20.2708 13.8635C20.0262 14.1066 19.6296 14.1066 19.3849 13.8635L17.7599 12.2489C17.4661 11.9569 16.9897 11.9569 16.6959 12.2489L16.6796 12.2651C16.3857 12.557 16.3857 13.0304 16.6796 13.3223L17.9464 14.581C18.1912 14.8243 18.1912 15.2188 17.9464 15.4621C17.7232 15.6838 17.3724 15.7037 17.1274 15.5206C16.8267 15.2958 16.4051 15.3263 16.1403 15.592C15.8756 15.8577 15.8491 16.2769 16.0784 16.5734C16.2668 16.8171 16.2481 17.1689 16.0234 17.3922C15.7968 17.6173 15.4389 17.6344 15.1934 17.4424C14.8947 17.2087 14.4674 17.2332 14.1977 17.4995C13.9279 17.7658 13.9006 18.1902 14.1339 18.4885C14.3276 18.7361 14.3093 19.0952 14.0802 19.3228C13.8315 19.5699 13.4284 19.5699 13.1797 19.3228L12.808 18.9535L12.9132 18.8489C13.7455 18.0219 13.7455 16.6811 12.9132 15.8542C12.5243 15.4677 12.0225 15.2619 11.5133 15.2366C11.4878 14.7308 11.2806 14.2323 10.8918 13.8459C10.52 13.4766 10.0451 13.2722 9.55922 13.2328C9.51962 12.7499 9.3139 12.2779 8.94208 11.9084C8.45311 11.4226 7.78567 11.2222 7.14945 11.3072C7.0557 10.9609 6.87208 10.6337 6.59857 10.3619C6.16723 9.93332 5.597 9.72685 5.03184 9.7425C4.88504 8.36976 5.34111 6.94543 6.40004 5.89327C7.38426 4.91535 8.69207 4.45489 9.98101 4.5119L8.48356 5.64643C7.45969 6.42216 7.26245 7.87941 8.04327 8.89941C8.82232 9.91708 10.2805 10.1144 11.302 9.34048L13.1908 7.90945H15.1649ZM9.3894 6.84203L12.5277 4.46432H13.0316C13.0811 4.46432 13.1302 4.46565 13.1789 4.46826C13.1922 4.46898 13.2056 4.46933 13.219 4.46933H14.8448C16.513 4.46933 18.043 5.38193 18.8274 6.83933C19.3221 7.7586 19.4773 8.8178 19.2712 9.83451L16.0591 6.63806C15.9178 6.49195 15.7232 6.40945 15.52 6.40945L12.9388 6.40945C12.7752 6.40945 12.6162 6.4629 12.4858 6.56165L10.3962 8.14487C10.0326 8.42032 9.5116 8.3498 9.23434 7.98762C8.95886 7.62776 9.02817 7.11571 9.3894 6.84203ZM6.03496 14.7969C5.86706 14.6301 5.81439 14.3921 5.87697 14.1807C5.90557 14.084 5.95823 13.9929 6.03496 13.9167L6.99212 12.9657C7.23675 12.7226 7.63338 12.7226 7.87802 12.9657C8.11986 13.2059 8.12262 13.5938 7.8863 13.8375L7.87776 13.8459L6.92061 14.797L6.91236 14.8052C6.8374 14.877 6.74888 14.9265 6.65519 14.9539C6.44237 15.0161 6.20287 14.9637 6.03496 14.7969ZM5.54368 11.4285C5.61917 11.5066 5.67014 11.5995 5.69659 11.6976C5.75261 11.9054 5.6986 12.1364 5.53451 12.2994L4.57736 13.2504C4.33272 13.4935 3.93609 13.4935 3.69146 13.2504C3.44682 13.0073 3.44682 12.6133 3.69146 12.3702L4.64861 11.4192C4.89325 11.1761 5.28988 11.1761 5.53451 11.4192L5.54368 11.4285ZM10.892 18.7427C10.8152 18.8191 10.7233 18.8714 10.6258 18.8998C10.4132 18.9618 10.1739 18.9094 10.0061 18.7427C9.83837 18.576 9.78565 18.3383 9.84799 18.1269C9.87655 18.0301 9.92926 17.9388 10.0061 17.8625L10.9633 16.9114C11.2079 16.6683 11.6046 16.6683 11.8492 16.9114C12.0938 17.1545 12.0938 17.5486 11.8492 17.7917L10.892 18.7427ZM8.87057 16.7345C8.7939 16.8106 8.7023 16.8629 8.60513 16.8914C8.39225 16.9537 8.15263 16.9013 7.98467 16.7345C7.8167 16.5676 7.76406 16.3295 7.82675 16.118C7.85432 16.0249 7.9042 15.937 7.97639 15.8626L7.98492 15.8542L8.94208 14.9031L8.95032 14.8949C9.19556 14.6602 9.5859 14.6629 9.82772 14.9032C10.0724 15.1463 10.0724 15.5404 9.82772 15.7834L8.87057 16.7345Z"/>
  </svg>
);

// animation
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";
import { hoverBtn } from "@/utils/hover-btn";

// Données pour la section avantages partenaires
const partner_advantages = [
  {
    id: 1,
    icon: <PatrimoineIcon />,
    text: "Valorisez votre patrimoine et faites-en un lieu d'accueil unique"
  },
  {
    id: 2,
    icon: <RevenusIcon />,
    text: "Bénéficiez de revenus récurrents sans charge de gestion"
  },
  {
    id: 3,
    icon: <ClienteleIcon />,
    text: "Attirez une nouvelle clientèle curieuse, locale et internationale"
  },
  {
    id: 4,
    icon: <NotorieteIcon />,
    text: "Renforcez l'image et la notoriété de votre domaine"
  },
  {
    id: 5,
    icon: <SynergiesIcon />,
    text: "Créez des synergies avec des producteurs et artisans locaux"
  }
];

const BecomePartnerMain = () => {
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
      
      // Animation en cascade de la timeline
      const timelineContainer = document.querySelector('.timeline-svg-container');
      if (timelineContainer) {
        // Animation de la ligne principale
        gsap.fromTo('.timeline-main-line', 
          { strokeDashoffset: 1000 },
          { 
            strokeDashoffset: 0, 
            duration: 1.5, 
            ease: "power2.out",
            scrollTrigger: {
              trigger: '.timeline-svg-container',
              start: "top 80%",
              end: "bottom 20%"
            }
          }
        );
        
        // Animation en cascade des points (SVG)
        for (let i = 1; i <= 7; i++) {
          gsap.fromTo(`.timeline-step[data-step="${i}"]`, 
            { 
              opacity: 0, 
              scale: 0,
              transformOrigin: "center"
            },
            { 
              opacity: 1, 
              scale: 1, 
              duration: 0.6,
              ease: "back.out(1.7)",
              delay: 0.2 + (i * 0.15), // Délai croissant pour l'effet cascade
              scrollTrigger: {
                trigger: '.timeline-svg-container',
                start: "top 80%",
                end: "bottom 20%"
              }
            }
          );
        }
        
        // Animation en cascade des textes
        for (let i = 1; i <= 7; i++) {
          gsap.fromTo(`.timeline-text[data-step="${i}"]`, 
            { 
              opacity: 0, 
              y: 20
            },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8,
              ease: "power2.out",
              delay: 0.4 + (i * 0.15), // Délai légèrement après les cercles
              scrollTrigger: {
                trigger: '.timeline-svg-container',
                start: "top 80%",
                end: "bottom 20%"
              }
            }
          );
        }
        
      // Animation pour mobile
      const mobileSteps = document.querySelectorAll('.timeline-mobile-step');
      if (mobileSteps.length > 0) {
        mobileSteps.forEach((step, index) => {
          gsap.fromTo(step, 
            { 
              opacity: 0, 
              x: -50
            },
            { 
              opacity: 1, 
              x: 0, 
              duration: 0.8,
              ease: "power2.out",
              delay: index * 0.1,
              scrollTrigger: {
                trigger: '.timeline-mobile',
                start: "top 80%",
                end: "bottom 20%"
              }
            }
          );
        });
      }
      
      // Animation GSAP pour les boutons de formulaire
      const formButtons = document.querySelectorAll('.tp-btn-green-hover');
      formButtons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }
    }, 100);
    return () => clearTimeout(timer);
  });

  return (
    <Wrapper showBackToTop={false}>
      
      {/* Styles pour la timeline */}
      <style jsx global>{`
        .process-timeline {
          position: relative;
        }
        
        .timeline-svg-container {
          position: relative;
          height: 200px;
          margin-bottom: 100px;
        }
        
        /* Styles pour l'animation */}
        .timeline-step {
          opacity: 0;
          transform: scale(0);
          transform-origin: center;
        }
        
        .timeline-text {
          opacity: 0;
          transform: translateY(20px);
        }
        
        .timeline-main-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }
        
        .timeline-mobile-step {
          opacity: 0;
          transform: translateX(-50px);
        }
        
        .tp-btn-green-hover:hover {
          background-color: transparent !important;
          color: #053725 !important;
          border: 2px solid #053725 !important;
        }
        
        @media (min-width: 769px) {
          .timeline-mobile {
            display: none;
          }
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
          <main>
            
            {/* hero section start */}
            <div className="tp-project-details-3-top tp-project-details-3-ptb">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-project-details-3-title-box">
                      <h2 className="tp-section-title-160 mb-20 tp-char-animation" style={{ whiteSpace: 'nowrap', fontSize: 'clamp(1.5rem, 6vw, 6rem)' }}>DEVENIR PARTENAIRE</h2>
                      <h3 className="tp-section-subtitle-3 tp-char-animation" style={{ fontSize: 'clamp(1.2rem, 4vw, 3rem)', fontWeight: '500', color: '#053725', marginTop: '10px', marginBottom: 'clamp(20px, 3vw, 80px)', lineHeight: '1.4' }}>Envie de transformer votre domaine en destination? Rejoignez l&apos;aventure IBÙ !</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* hero section end */}
            
            {/* grid images section start */}
            <div className="showcase-details-2-grid-area pb-90" style={{ marginTop: 'clamp(-30px, -3vw, 0px)' }}>
              <div className="container">
                <div className="row">
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image className="img-left" src={partner_img_1} alt="Devenir partenaire IBÙ" style={{height:'auto'}}/>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="showcase-details-2-grid-img mb-30">
                      <Image className="img-right" src={partner_img_2} alt="Partenariat IBÙ Experience" style={{height:'auto'}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* call to action section start */}
            <div className="tp-project-details-3-top" style={{ paddingTop: 'clamp(20px, 4vw, 60px)', paddingBottom: '60px' }}>
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-project-details-3-title-box text-center">
                      <h3 className="tp-section-subtitle-3" style={{ fontSize: 'clamp(1.2rem, 4vw, 2.5rem)', fontWeight: '500', color: '#053725', marginBottom: '40px', lineHeight: '1.4' }}>Cliquez sur le bouton ci-dessous pour accéder au formulaire de candidature.</h3>
                      
                      <div className="tp-btn-wrapper d-flex justify-content-center gap-4 flex-wrap">
                        <a 
                          href="https://form.typeform.com/to/JqIvbztX" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="tp-btn-2 tp-btn-green-hover"
                          style={{ 
                            backgroundColor: '#053725',
                            color: 'white',
                            padding: '15px 30px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '16px',
                            border: '2px solid #053725',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(5, 55, 37, 0.1)',
                            display: 'inline-block'
                          }}
                        >
                          Formulaire FR
                        </a>
                        <a 
                          href="https://form.typeform.com/to/kxv6Z2di" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="tp-btn-2 tp-btn-green-hover"
                          style={{ 
                            backgroundColor: '#053725',
                            color: 'white',
                            padding: '15px 30px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '16px',
                            border: '2px solid #053725',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(5, 55, 37, 0.1)',
                            display: 'inline-block'
                          }}
                        >
                          Formulaire EN
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* call to action section end */}
            
            {/* advantages section start */}
            <div className="tp-service-2-area tp-service-2-pt pb-150 z-index-5" style={{ paddingBottom: '100px', paddingTop: 'clamp(40px, 8vw, 0px)' }}>
              <div className="container container-1480">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="tp-service-2-title-box mb-70">
                      <span className="tp-section-subtitle-3" style={{ fontSize: 'clamp(0.8rem, 3vw, 1.2rem)' }}>
                        <span>
                          <Leaf />
                        </span>
                        POURQUOI DEVENIR PARTENAIRE IBÙ
                      </span>
                      <h4 className="tp-section-title-40" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                        Rejoignez un réseau d&apos;excellence et transformez votre domaine en destination d&apos;exception.
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-xxl-6 col-xl-4 col-lg-4">
                    <div className="text-center text-lg-start" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Image src={partner_img_3} alt="Avantages partenariat IBÙ" style={{ width: '100%', height: 'auto', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-8 col-lg-8">
                    <div className="tp-service-2-content-box">
                      {partner_advantages.map((advantage, index) => (
                        <div key={advantage.id} className="tp-service-2-item d-flex" style={{ marginBottom: index < partner_advantages.length - 1 ? '30px' : '0', paddingBottom: index < partner_advantages.length - 1 ? '30px' : '0', borderBottom: index < partner_advantages.length - 1 ? '1px solid #e5e5e5' : 'none' }}>
                          <div className="tp-service-2-icon" style={{ marginRight: '20px', flexShrink: 0 }}>
                            <span>
                              {advantage.icon}
                            </span>
                          </div>
                          <div className="tp-service-2-content">
                            <p style={{ margin: 0, fontSize: 'clamp(16px, 4vw, 20px)', lineHeight: '1.6', fontWeight: '500' }}>{advantage.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* advantages section end */}
            
            {/* process section start */}
            <section className="tp-process-area pt-100 pb-150">
              <div className="container">
                <div className="row">
                  <div className="col-xl-8">
                    <div className="showcase-details-2-section-box mb-80">
                      <h4 className="showcase-details-2-section-title tp-char-animation" style={{ fontSize: 'clamp(1.2rem, 4vw, 3.5rem)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>LE FONCTIONNEMENT</h4>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Desktop */}
                <div className="row justify-content-center d-none d-lg-block">
                  <div className="col-xl-12">
                    <div className="process-timeline">
                      
                      {/* SVG Timeline */}
                      <div className="timeline-svg-container" style={{position: 'relative', height: '400px', marginBottom: '50px'}}>
                        <svg 
                          width="100%" 
                          height="300" 
                          viewBox="0 0 1200 300" 
                          style={{position: 'absolute', top: 80, left: 0}}
                        >
                          {/* Ligne principale horizontale */}
                          <line 
                            x1="100" 
                            y1="150" 
                            x2="1100" 
                            y2="150" 
                            stroke="#053725" 
                            strokeWidth="4"
                            className="timeline-main-line"
                          />
                          
                          {/* Points et lignes verticales avec cercles numérotés */}
                          {/* Point 1 */}
                          <g className="timeline-step" data-step="1">
                            <line x1="200" y1="148" x2="200" y2="210" stroke="#053725" strokeWidth="4"/>
                            <circle cx="200" cy="210" r="20" fill="#053725"/>
                            <text x="200" y="210" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">01</text>
                          </g>
                          
                          {/* Point 2 */}
                          <g className="timeline-step" data-step="2">
                            <line x1="350" y1="150" x2="350" y2="90" stroke="#053725" strokeWidth="4"/>
                            <circle cx="350" cy="90" r="20" fill="#053725"/>
                            <text x="350" y="90" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">02</text>
                          </g>
                          
                          {/* Point 3 */}
                          <g className="timeline-step" data-step="3">
                            <line x1="500" y1="148" x2="500" y2="210" stroke="#053725" strokeWidth="4"/>
                            <circle cx="500" cy="210" r="20" fill="#053725"/>
                            <text x="500" y="210" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">03</text>
                          </g>
                          
                          {/* Point 4 */}
                          <g className="timeline-step" data-step="4">
                            <line x1="650" y1="150" x2="650" y2="90" stroke="#053725" strokeWidth="4"/>
                            <circle cx="650" cy="90" r="20" fill="#053725"/>
                            <text x="650" y="90" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">04</text>
                          </g>
                          
                          {/* Point 5 */}
                          <g className="timeline-step" data-step="5">
                            <line x1="800" y1="148" x2="800" y2="210" stroke="#053725" strokeWidth="4"/>
                            <circle cx="800" cy="210" r="20" fill="#053725"/>
                            <text x="800" y="210" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">05</text>
                          </g>
                          
                          {/* Point 6 */}
                          <g className="timeline-step" data-step="6">
                            <line x1="950" y1="150" x2="950" y2="90" stroke="#053725" strokeWidth="4"/>
                            <circle cx="950" cy="90" r="20" fill="#053725"/>
                            <text x="950" y="90" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">06</text>
                          </g>
                          
                          {/* Point 7 */}
                          <g className="timeline-step" data-step="7">
                            <line x1="1100" y1="148" x2="1100" y2="210" stroke="#053725" strokeWidth="4"/>
                            <circle cx="1100" cy="210" r="20" fill="#053725"/>
                            <text x="1100" y="210" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="16" fontWeight="bold">07</text>
                          </g>
                        </svg>
                        
                        {/* Contenus textuels et rectangles - Responsive avec le SVG */}
                        <div className="timeline-content" style={{position: 'relative', width: '100%', height: '100%'}}>
                          
                          {/* Step 1 - En bas - Cercle à y=210 (290px réel), marge de 35px */}
                          <div className="timeline-text" data-step="1" style={{position: 'absolute', left: '16.67%', top: '325px', width: '13.33%', textAlign: 'center', transform: 'translateX(-50%)'}}>
                            <h5 style={{fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 'bold', color: '#053725', lineHeight: '1.3'}}>
                              Prise de contact & analyse des besoins
                            </h5>
                          </div>
                          
                          {/* Step 2 - En haut - Cercle à y=90 (170px réel), marge plus grande */}
                          <div className="timeline-text" data-step="2" style={{position: 'absolute', left: '29.17%', top: '90px', width: '13.33%', textAlign: 'center', transform: 'translateX(-50%) translateY(-100%)'}}>
                            <h5 style={{fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 'bold', color: '#053725', lineHeight: '1.3'}}>
                              Étude du site & faisabilité technique
                            </h5>
                          </div>
                          
                          {/* Step 3 - En bas - Cercle à y=210 (290px réel), marge de 35px */}
                          <div className="timeline-text" data-step="3" style={{position: 'absolute', left: '41.67%', top: '325px', width: '13.33%', textAlign: 'center', transform: 'translateX(-50%)'}}>
                            <h5 style={{fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 'bold', color: '#053725', lineHeight: '1.3'}}>
                              Création de l&apos;expérience IBÙ × Votre Domaine
                            </h5>
                          </div>
                          
                          {/* Step 4 - En haut - Cercle à y=90 (170px réel), marge plus grande */}
                          <div className="timeline-text" data-step="4" style={{position: 'absolute', left: '54.17%', top: '90px', width: '13.33%', textAlign: 'center', transform: 'translateX(-50%) translateY(-100%)'}}>
                            <h5 style={{fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 'bold', color: '#053725', lineHeight: '1.3'}}>
                              Design sur mesure de la tiny house
                            </h5>
                          </div>
                          
                          {/* Step 5 - En bas - Cercle à y=210 (290px réel), marge de 35px */}
                          <div className="timeline-text" data-step="5" style={{position: 'absolute', left: '66.67%', top: '325px', width: '13.33%', textAlign: 'center', transform: 'translateX(-50%)'}}>
                            <h5 style={{fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 'bold', color: '#053725', lineHeight: '1.3'}}>
                              Intégration web & marketing
                            </h5>
                          </div>
                          
                          {/* Step 6 - En haut - Cercle à y=90 (170px réel), marge plus grande */}
                          <div className="timeline-text" data-step="6" style={{position: 'absolute', left: '79.17%', top: '90px', width: '13.33%', textAlign: 'center', transform: 'translateX(-50%) translateY(-100%)'}}>
                            <h5 style={{fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 'bold', color: '#053725', lineHeight: '1.3'}}>
                              Livraison & installation<br/>(6 à 8 semaines)
                            </h5>
                          </div>
                          
                          {/* Step 7 - En bas - Cercle à y=210 (290px réel), marge de 35px */}
                          <div className="timeline-text" data-step="7" style={{position: 'absolute', left: '91.67%', top: '325px', width: '13.33%', textAlign: 'center', transform: 'translateX(-50%)'}}>
                            <h5 style={{fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 'bold', color: '#053725', lineHeight: '1.3'}}>
                              Gestion assurée par IBÙ
                            </h5>
                          </div>
                          
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                {/* Version Mobile - Liste verticale */}
                <div className="timeline-mobile d-block d-lg-none">
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        {[
                          { number: "01", text: "Prise de contact & analyse des besoins" },
                          { number: "02", text: "Étude du site & faisabilité technique" },
                          { number: "03", text: "Création de l'expérience IBÙ × Votre Domaine" },
                          { number: "04", text: "Design sur mesure de la tiny house" },
                          { number: "05", text: "Intégration web & marketing" },
                          { number: "06", text: "Livraison & installation (6 à 8 semaines)" },
                          { number: "07", text: "Gestion assurée par IBÙ" }
                        ].map((step, index) => (
                          <div key={index} className="timeline-mobile-step d-flex align-items-center mb-4" data-step={index + 1}>
                            <div 
                              className="timeline-mobile-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                              style={{
                                width: '50px',
                                height: '50px',
                                backgroundColor: '#053725',
                                borderRadius: '50%',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold'
                              }}
                            >
                              {step.number}
                            </div>
                            <div className="timeline-mobile-text">
                              <h5 style={{
                                fontSize: '16px', 
                                fontWeight: 'bold', 
                                color: '#053725', 
                                lineHeight: '1.3',
                                margin: 0
                              }}>
                                {step.text}
                              </h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* process section end */}

          </main>

          {/* footer area start */}
          <FooterThree />
          {/* footer area end */}

        </div>
      </div>

    </Wrapper>
  );
};

export default BecomePartnerMain;
