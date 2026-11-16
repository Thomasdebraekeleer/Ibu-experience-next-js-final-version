"use client";

import { gsap } from "gsap";
import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from "@/plugins";
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";
import CgvDocument from "@/components/cgv/cgv-document";
import { getCgvDocument } from "@/content/cgv";
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { titleAnimation } from "@/utils/title-animation";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

export default function CgvMain() {
  const locale = useLocale();
  const cgv = getCgvDocument(locale);

  useScrollSmooth();

  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && globalThis.document.querySelector(".tp-magic-cursor")) {
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
            <main className="ibu-cgv-page">
              <div className="ibu-cgv-spacer" aria-hidden="true" />
              <CgvDocument document={cgv} />
            </main>

            <FooterThree />
          </div>
        </div>
      </Wrapper>

      <style jsx global>{`
        .ibu-cgv-page {
          background: #fff;
        }

        .ibu-cgv-spacer {
          height: 140px;
        }

        @media (max-width: 991px) {
          .ibu-cgv-spacer {
            height: 120px;
          }
        }
      `}</style>
    </>
  );
}