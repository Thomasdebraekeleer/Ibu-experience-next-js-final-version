"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from '@/plugins';
import Image from "next/image";
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

const GIFT_CARD_OPTIONS = [
  { amount: 50, label: "50 €", url: "https://buy.stripe.com/14A9ASaweenRgvc9Qt1Fe00" },
  { amount: 100, label: "100 €", url: "https://buy.stripe.com/8x28wO47QbbFbaSaUx1Fe01" },
  { amount: 250, label: "250 €", url: "https://buy.stripe.com/6oUdR88o6bbF92K3s51Fe02" },
  { amount: 299, label: "299 €", url: "https://buy.stripe.com/3cI7sK9sa7Ztgvc8Mp1Fe03" },
] as const;

export default function GiftCardPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(GIFT_CARD_OPTIONS[0].amount);

  const selectedOption = GIFT_CARD_OPTIONS.find((opt) => opt.amount === selectedAmount) || GIFT_CARD_OPTIONS[0];

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
    }, 100);
    return () => clearTimeout(timer);
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

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
            <div className="tp-gift-card-page">
              <div className="container container-1530">
                <div className="row align-items-stretch">
                  {/* Image Section - À gauche sur desktop, deuxième sur mobile */}
                  <div className="col-lg-6 order-2 order-lg-1 mb-50 mb-lg-0">
                    <div className="tp-gift-card-image-wrapper">
                      <Image
                        src="/assets/img/inner-project/Carte cadeau/Carte-cadeau-IBU-mockup.png"
                        alt="Carte cadeau IBÙ"
                        fill
                        className="tp-gift-card-image"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>

                  {/* Widget Section - À droite sur desktop, premier sur mobile */}
                  <div className="col-lg-6 order-1 order-lg-2">
                    <div className="tp-gift-card-widget">
                      {/* Title */}
                      <h1 className="tp-gift-card-title">
                        Carte cadeau IBÙ
                      </h1>

                      {/* Selected Amount Display */}
                      <div className="tp-gift-card-amount">
                        <p className="tp-gift-card-price">
                          {formatPrice(selectedAmount)}
                        </p>
                      </div>

                      {/* Instructions */}
                      <p className="tp-gift-card-instructions">
                        Sélectionnez le montant de votre carte cadeau
                      </p>

                      {/* Amount Buttons */}
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
                              {option.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Commander Button */}
                      <a
                        href={selectedOption.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tp-btn-black-md tp-gift-card-command-btn"
                      >
                        Commander
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* footer area */}
            <FooterThree />
            {/* footer area */}
          </main>
        </div>
      </div>
    </Wrapper>
  );
}
