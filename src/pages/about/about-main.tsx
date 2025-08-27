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
import FooterOne from "@/layouts/footers/footer-one";
import TeamOne from "@/components/team/team-one";
import TestimonialOne from "@/components/testimonial/testimonial-one";
import AwardOne from "@/components/award/award-one";

// animation
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { bounceAnimation, charAnimation, fadeAnimation } from "@/utils/title-animation";

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

  useGSAP(() => {
    const timer = setTimeout(() => {
      hoverBtn();
      footerTwoAnimation();
      fadeAnimation();
      charAnimation();
      bounceAnimation();
    }, 100)
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
            
            {/* hero section start */}
            <section className="tp-hero-area pt-150 pb-150">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="tp-hero-content text-center">
                      <h1 className="tp-hero-title">
                        À Propos de <span className="text-gradient">VBU Experience</span>
                      </h1>
                      <p className="tp-hero-text">
                        Nous créons des expériences uniques et mémorables qui transforment vos voyages en aventures extraordinaires
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* hero section end */}

            {/* about story section start */}
            <section className="tp-about-story-area pb-150">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="tp-about-story-content">
                      <div className="tp-section-title">
                        <h2>Notre Histoire</h2>
                      </div>
                      <p>
                        Fondée en 2020, VBU Experience est née de la passion pour créer des expériences de voyage authentiques et immersives. 
                        Notre équipe d'experts locaux et de passionnés du voyage s'engage à vous offrir des moments inoubliables.
                      </p>
                      <p>
                        Nous croyons que chaque voyage devrait être une aventure unique, une opportunité de découvrir de nouveaux horizons 
                        et de créer des souvenirs qui durent toute une vie.
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-about-story-image">
                      <div className="tp-about-img">
                        <img src="/img/about/story-image.jpg" alt="Notre Histoire" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* about story section end */}

            {/* mission vision section start */}
            <section className="tp-mission-vision-area pb-150">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="tp-mission-content">
                      <div className="tp-section-title">
                        <h2>Notre Mission</h2>
                      </div>
                      <p>
                        Connecter les voyageurs avec des expériences authentiques et locales, en créant des ponts culturels 
                        et en favorisant la compréhension mutuelle à travers le monde.
                      </p>
                      <ul className="tp-mission-list">
                        <li>Expériences authentiques et locales</li>
                        <li>Développement durable et responsable</li>
                        <li>Excellence du service client</li>
                        <li>Innovation continue</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="tp-vision-content">
                      <div className="tp-section-title">
                        <h2>Notre Vision</h2>
                      </div>
                      <p>
                        Devenir la référence mondiale pour les expériences de voyage immersives, en transformant 
                        la façon dont les gens découvrent et explorent le monde.
                      </p>
                      <div className="tp-vision-stats">
                        <div className="row">
                          <div className="col-6">
                            <div className="tp-stat-item text-center">
                              <h3>500+</h3>
                              <p>Expériences uniques</p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="tp-stat-item text-center">
                              <h3>50+</h3>
                              <p>Pays visités</p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="tp-stat-item text-center">
                              <h3>10K+</h3>
                              <p>Voyageurs satisfaits</p>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="tp-stat-item text-center">
                              <h3>98%</h3>
                              <p>Taux de satisfaction</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* mission vision section end */}

            {/* team area start */}
            <TeamOne />
            {/* team area end */}

            {/* awards area start */}
            <AwardOne />
            {/* awards area end */}

            {/* testimonial area start */}
            <TestimonialOne />
            {/* testimonial area end */}

          </main>
        </div>
      </div>

      {/* footer area start */}
      <FooterOne />
      {/* footer area end */}
    </Wrapper>
  );
};

export default AboutMain;
