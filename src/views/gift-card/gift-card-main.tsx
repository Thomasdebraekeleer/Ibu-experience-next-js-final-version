"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocale, useTranslations } from "next-intl";
import useScrollSmooth from "@/hooks/use-scroll-smooth";
import {
  ScrollSmoother,
  ScrollTrigger,
  SplitText,
  cursorAnimation,
} from "@/plugins";
import Image from "next/image";
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

const GIFT_CARD_OPTIONS = [
  {
    amount: 50,
    url: "https://buy.stripe.com/14A9ASaweenRgvc9Qt1Fe00",
    descriptionKey: undefined,
  },
  {
    amount: 100,
    url: "https://buy.stripe.com/8x28wO47QbbFbaSaUx1Fe01",
    descriptionKey: undefined,
  },
  {
    amount: 265,
    url: "https://buy.stripe.com/00w14mbAi4Nh4Mu7Il1Fe05",
    descriptionKey: "weekStay" as const,
  },
  {
    amount: 315,
    url: "https://buy.stripe.com/28EeVcbAibbFbaS8Mp1Fe04",
    descriptionKey: "weekendStay" as const,
  },
] as const;

export default function GiftCardMain() {
  const locale = useLocale();
  const t = useTranslations("giftCard");
  const [selectedAmount, setSelectedAmount] = useState<number>(
    GIFT_CARD_OPTIONS[0].amount
  );

  const selectedOption =
    GIFT_CARD_OPTIONS.find((opt) => opt.amount === selectedAmount) ||
    GIFT_CARD_OPTIONS[0];

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
    }, 100);
    return () => clearTimeout(timer);
  }, [locale]);

  const formatPrice = (amount: number) => {
    const intlLocale = locale === "nl-BE" ? "nl-BE" : "fr-FR";
    return new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <Wrapper showBackToTop={false}>
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>

      <HeaderVBU />

      <div id="smooth-wrapper">
        <div id="smooth-content" key={locale}>
          <main>
            <div className="tp-gift-card-page">
              <div className="container container-1530">
                <div className="row align-items-stretch">
                  <div className="col-lg-6 order-2 order-lg-1 mb-50 mb-lg-0">
                    <div className="tp-gift-card-image-wrapper">
                      <Image
                        src="/assets/img/inner-project/Carte cadeau/Carte-cadeau-IBU-mockup.png"
                        alt={t("imageAlt")}
                        fill
                        className="tp-gift-card-image"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 order-1 order-lg-2">
                    <div className="tp-gift-card-widget">
                      <h1 className="tp-gift-card-title">{t("title")}</h1>

                      <div className="tp-gift-card-amount">
                        <p className="tp-gift-card-price">
                          {formatPrice(selectedAmount)}
                          {selectedOption.descriptionKey && (
                            <span className="tp-gift-card-description">
                              {" "}
                              (
                              {t(
                                `options.${selectedOption.descriptionKey}`
                              )}
                              )
                            </span>
                          )}
                        </p>
                      </div>

                      <p className="tp-gift-card-instructions">
                        {t("instructions")}
                      </p>

                      <div className="tp-gift-card-buttons">
                        {GIFT_CARD_OPTIONS.map((option) => {
                          const isActive = selectedAmount === option.amount;
                          return (
                            <button
                              key={option.amount}
                              onClick={() => setSelectedAmount(option.amount)}
                              className={`tp-gift-card-amount-btn ${isActive ? "active" : ""}`}
                              aria-pressed={isActive}
                            >
                              {formatPrice(option.amount)}
                            </button>
                          );
                        })}
                      </div>

                      <a
                        href={selectedOption.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tp-btn-black-md tp-gift-card-command-btn"
                      >
                        {t("order")}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FooterThree />
          </main>
        </div>
      </div>
    </Wrapper>
  );
}
