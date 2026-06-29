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
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import ContactTwo from "@/components/contact/contact-two";
import FooterThree from "@/layouts/footers/footer-three";
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { charAnimation } from "@/utils/title-animation";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

export default function ContactMain() {
  const locale = useLocale();
  const t = useTranslations("contact.hero");

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
      hoverBtn();
      footerTwoAnimation();
      charAnimation();
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
              <div className="tm-hero-area tm-hero-ptb p-relative">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="tm-hero-content">
                        <span className="tm-hero-subtitle">
                          {t("eyebrow")}
                        </span>
                        <h4 className="tm-hero-title-big tp-char-animation">
                          {t("title")}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ContactTwo />
            </main>

            <FooterThree />
          </div>
        </div>
      </Wrapper>

      <style jsx>{`
        @media (max-width: 991px) {
          .tm-hero-title-big {
            letter-spacing: 0.05em !important;
            font-size: clamp(2rem, 8vw, 3.5rem) !important;
            line-height: 1.1 !important;
          }
        }
      `}</style>
    </>
  );
}
