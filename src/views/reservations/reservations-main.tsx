"use client";

import { gsap } from "gsap";
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import {
  ScrollSmoother,
  ScrollTrigger,
  SplitText,
  cursorAnimation,
} from "@/plugins";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";
import PortfolioGridColThreeArea from "@/components/portfolio/portfolio-grid-col-3-area";
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { charAnimation, titleAnimation } from "@/utils/title-animation";
import { imageRevealAnimation } from "@/utils/image-reveal-anim";

const ReservationsMain = () => {
  const locale = useLocale();
  const t = useTranslations("reservations.hero");

  useScrollSmooth();

  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    };
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      document.querySelector(".tp-magic-cursor")
    ) {
      cursorAnimation();
    }
  }, []);

  useGSAP(() => {
    const timer = setTimeout(() => {
      charAnimation();
      titleAnimation();
      imageRevealAnimation();
      hoverBtn();
      footerTwoAnimation();
    }, 100);
    return () => clearTimeout(timer);
  }, [locale]);

  return (
    <>
      <Wrapper showBackToTop={false}>
        <div id="magic-cursor">
          <div id="ball"></div>
        </div>

        <HeaderVBU />

        <div id="smooth-wrapper">
          <div id="smooth-content" key={locale}>
            <main>
              <div
                className="tm-hero-area tm-hero-ptb"
                style={{
                  backgroundImage:
                    "url(/assets/img/inner-project/hero/hero-bg.jpg)",
                }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="tm-hero-content">
                        <span className="tm-hero-subtitle">
                          {t("eyebrow")}
                        </span>
                        <h4 className="tm-hero-title tp-char-animation">
                          {t("title")}
                        </h4>
                      </div>
                      <div className="tm-hero-text">
                        <p className="tp_title_anim">{t("intro")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <PortfolioGridColThreeArea />
            </main>

            <FooterThree />
          </div>
        </div>
      </Wrapper>

      <style jsx>{`
        @media (max-width: 991px) {
          .tm-hero-title {
            letter-spacing: 0.05em !important;
          }
        }
      `}</style>
    </>
  );
};

export default ReservationsMain;
