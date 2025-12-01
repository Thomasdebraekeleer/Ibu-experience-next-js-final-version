'use client';
import React, { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, NextIcon, PrevIcon, UpArrow } from "../svg";
import Image from "next/image";
import gael_ibu_img from "@/assets/img/inner-project/Press/GAEL - Ibu Expérience.jpg";
import interview_tvcom_img from "@/assets/img/inner-project/Press/interview Tvcom - IBU Experience.jpg";
import gael_logo from "@/assets/img/inner-project/A propos/Logo Gael Magazine x IBUExperience.png";
import tvcom_logo from "@/assets/img/inner-project/A propos/Logo TVCom x Ibu Expérience.png";

gsap.registerPlugin(ScrollTrigger);


const VideoTwo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const slides = [
    {
      id: 'gael',
      title: 'Gael Magazine',
      subtitle: 'Article',
      image: gael_ibu_img,
      logo: gael_logo,
      alt: 'GAEL - Ibu Expérience',
      link: 'https://www.gael.be/lifestyle/tourisme/ibu-des-cabanes-de-luxe-pour-une-nuit-insolite-en-wallonie/',
      linkText: 'Voir l\'article'
    },
    {
      id: 'interview',
      title: 'Interview TVcom',
      subtitle: 'Interview',
      image: interview_tvcom_img,
      logo: tvcom_logo,
      alt: 'Interview TVcom - IBU Experience',
      link: 'https://www.tvcom.be/replay/emission/linvite-dans-lactu/mallen-jallow-ibu-experience/54210',
      linkText: 'Voir l\'interview'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play du carousel
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Change toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [slides.length, isHovered]);
  useGSAP(() => {
    // Animation pour la section "On parle de nous"
    gsap.fromTo(".video-two-section .showcase-details-2-section-title", 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".video-two-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".video-two-section .ab-inner-subtitle", 
      { opacity: 0, x: -30 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".video-two-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".video-two-section .showcase-details-2-section-right p", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".video-two-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation pour la section Gael Magazine
    gsap.fromTo(".gael-section .tp-video-content .tp-video-subtitle", 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: ".gael-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".gael-section .tp-video-content .tp-video-title", 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".gael-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation de l'image de fond Gael
    gsap.fromTo(".gael-section .tp-video-wrap .tp-video-bg-image", 
      { scale: 1.1, opacity: 0.8 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 2,
        scrollTrigger: {
          trigger: ".gael-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation pour la section Interview TV
    gsap.fromTo(".interview-section .tp-video-content .tp-video-subtitle", 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: ".interview-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".interview-section .tp-video-content .tp-video-title", 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
          trigger: ".interview-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation de l'image de fond Interview
    gsap.fromTo(".interview-section .tp-video-wrap .tp-video-bg-image", 
      { scale: 1.1, opacity: 0.8 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 2,
        scrollTrigger: {
          trigger: ".interview-section",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation pour la section StartLab.Brussels
    gsap.fromTo(".showcase-details-2-area .showcase-details-2-section-title", 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".showcase-details-2-area",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".powered-by-container", 
      { opacity: 0, x: -30 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 1,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".showcase-details-2-area",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".showcase-details-2-area .showcase-details-2-content-right p", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".showcase-details-2-area",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation pour la section Témoignages
    gsap.fromTo(".tp-testimonial-area .showcase-details-2-section-title", 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".tp-testimonial-area",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(".tp-testimonial-slider-wrapper", 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".tp-testimonial-area",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Effet hover GSAP sur les flèches de témoignages
    const testimonialPrevBtn = document.querySelector(".tp-testimonial-prev");
    const testimonialNextBtn = document.querySelector(".tp-testimonial-next");

    if (testimonialPrevBtn) {
      testimonialPrevBtn.addEventListener("mouseenter", () => {
        gsap.to(testimonialPrevBtn, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      testimonialPrevBtn.addEventListener("mouseleave", () => {
        gsap.to(testimonialPrevBtn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }

    if (testimonialNextBtn) {
      testimonialNextBtn.addEventListener("mouseenter", () => {
        gsap.to(testimonialNextBtn, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      testimonialNextBtn.addEventListener("mouseleave", () => {
        gsap.to(testimonialNextBtn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    }
  });

  return (
    <>
    <div>
      <style jsx global>{`
        .tp-video-area,
        .tp-video-area::before,
        .tp-video-area::after,
        .tp-video-wrap,
        .tp-video-wrap::before,
        .tp-video-wrap::after {
          background: none !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
          box-shadow: none !important;
        }
        .tp-video-area .tp-video-wrap::before {
          content: none !important;
          display: none !important;
        }
        .carousel-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 60vh;
          min-height: 450px;
        }
        .carousel-track {
          display: flex;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
        }
        .carousel-slide {
          width: 100%;
          flex-shrink: 0;
        }
        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: 2px solid #fcf8e3;
          color: #fcf8e3;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          font-size: 18px;
          font-weight: bold;
        }
        .carousel-nav:hover {
          background: #fcf8e3;
          color: #053725;
          border-color: #fcf8e3;
        }
        .carousel-nav.prev {
          left: 60px;
        }
        .carousel-nav.next {
          right: 60px;
        }
        .carousel-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 10;
        }
        .carousel-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(252, 248, 227, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .carousel-indicator.active {
          background: #fcf8e3;
        }
        .showcase-details-2-content-right p {
          opacity: 1 !important;
          color: #333 !important;
        }
          .video-two-section .showcase-details-2-section-right p {
            opacity: 1 !important;
            color: #333 !important;
          }
          @media (max-width: 991px) {
            .tp-video-title {
              font-size: clamp(2rem, 4vw, 3rem) !important;
            }
            .carousel-indicators {
              position: absolute !important;
              bottom: 30px !important;
              right: 30px !important;
              left: auto !important;
              transform: none !important;
              justify-content: flex-end !important;
            }
            /* Ajustement de l'espacement de la section vidéo sur mobile */
            .video-two-section {
              padding-bottom: 60px !important;
              margin-bottom: 0 !important;
            }
          }
        `}</style>
      
      {/* Section On parle de nous avec carousel intégré */}
      <div className="showcase-details-2-area pb-60 video-two-section" style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              <div className="showcase-details-2-section-box">
                <h4 className="showcase-details-2-section-title tp-char-animation">On parle de nous</h4>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3">
              <div className="showcase-details-2-section-left">
                <span className="ab-inner-subtitle mb-25">
                  <Leaf/>
                  Nos articles et interviews
                </span>
              </div>
            </div>
            <div className="col-xl-9">
              <div className="showcase-details-2-section-right tp_title_anim">
                <p style={{opacity: 1, color: '#333333'}}>Découvrez IBÙ Experience à travers le regard de la presse et des médias. Ces articles et interviews témoignent de notre vision unique de l&apos;hospitalité de luxe en pleine nature, et de notre engagement à créer des expériences authentiques au cœur des plus beaux domaines de Belgique.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Carousel intégré dans la même section */}
        <div 
          className="carousel-container" 
          style={{marginTop: '40px'}}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
        <div className="carousel-track" style={{transform: `translateX(-${currentSlide * 100}%)`}}>
          {slides.map((slide, index) => (
            <div key={slide.id} className="carousel-slide">
              <div className="tp-video-area" style={{background: 'transparent', height: '100%'}}>
                <div className="container" style={{height: '100%', maxWidth: '100%'}}>
                  <div className="row" style={{height: '100%'}}>
                    <div className="col-xl-12" style={{height: '100%'}}>
                      <div className="tp-video-wrap p-relative" style={{background: 'transparent', position: 'relative', height: '100%'}}>
                        <a href={slide.link} target="_blank" rel="noopener noreferrer" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3, textDecoration: 'none'}}></a>
                        <div className="tp-video-bg-image" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1}}>
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                          />
                        </div>
                        <div style={{position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, textAlign: 'center'}}>
                          <span className="tp-video-subtitle">
                            <span>
                              <Leaf />
                            </span>
                            {slide.subtitle}
                          </span>
                        </div>
                        <div className="tp-video-content" style={{position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 0'}}>
                          <div style={{textAlign: 'center'}}>
                            {/* Logo au-dessus du titre */}
                            <div style={{marginBottom: '30px'}}>
                              <Image
                                src={slide.logo}
                                alt={`Logo ${slide.title}`}
                                style={{
                                  height: 'auto',
                                  width: 'auto',
                                  maxWidth: '250px',
                                  maxHeight: '80px',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>
                            <h2 className="tp-video-title" style={{fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)', letterSpacing: '0.1em'}}>{slide.title}</h2>
                          </div>
                        </div>
                        <div style={{position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 4, textAlign: 'center'}}>
                          <a href={slide.link} target="_blank" rel="noopener noreferrer" style={{
                            color: '#fcf8e3',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = '#ffffff';
                            (e.target as HTMLElement).style.transform = 'translateX(5px)';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = '#fcf8e3';
                            (e.target as HTMLElement).style.transform = 'translateX(0px)';
                          }}>
                            {slide.linkText} →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button className="carousel-nav prev" onClick={prevSlide}>
          ←
        </button>
        <button className="carousel-nav next" onClick={nextSlide}>
          →
        </button>
        
        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default VideoTwo;