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
import FooterThree from "@/layouts/footers/footer-three";
import FaqAccordion from "@/components/faq/faq-accordion";
import FaqSharedStyles from "@/components/faq/faq-shared-styles";
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { titleAnimation } from "@/utils/title-animation";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

export default function FaqMain() {
  const locale = useLocale();
  const t = useTranslations("faq.hero");

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
      titleAnimation();
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
            <main className="ibu-faq-page">
              <div className="tm-hero-area tm-hero-ptb p-relative ibu-faq-hero">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="tm-hero-content text-center">
                        <h1 className="ibu-faq-hero-title tp_title_anim">
                          {t("title")}
                        </h1>
                        <p className="ibu-faq-hero-lead tp_title_anim">
                          {t("subtitle")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <FaqSharedStyles />
              <FaqAccordion variant="page" initialOpenIndex={0} />
            </main>

            <FooterThree />
          </div>
        </div>
      </Wrapper>

      <style jsx global>{`
        .ibu-faq-page .ibu-faq-hero.tm-hero-ptb {
          padding-top: 170px;
          padding-bottom: 28px;
        }

        @media (max-width: 991px) {
          .ibu-faq-page .ibu-faq-hero.tm-hero-ptb {
            padding-top: 140px;
          }
        }

        .ibu-faq-page .ibu-faq-hero-title {
          margin: 0 auto;
        }

        .ibu-faq-page .ibu-faq-hero-lead {
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </>
  );
}
