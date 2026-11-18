"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import a_1 from "@/assets/img/home-01/award/award-instant-1.webp";
import a_2 from "@/assets/img/home-01/award/award-instant-2.webp";
import a_3 from "@/assets/img/home-01/award/award-instant-3.webp";
import a_4 from "@/assets/img/home-01/award/award-instant-4.webp";
import a_5 from "@/assets/img/home-01/award/award-instant-5.webp";
import a_6 from "@/assets/img/home-01/award/award-6.png";
import { Leaf } from "../svg";

const AWARD_IMAGES = [a_1, a_2, a_3, a_4, a_5, a_6];

const LG_MIN_WIDTH = 992;
/** Temps d’affichage par étape avant passage à la suivante */
const STEP_HOLD_MS = 3200;
/** Pause le défilement auto tant que l’utilisateur scrolle (évite les sauts de scroll mobile) */
const SCROLL_IDLE_MS = 450;

type InstantIbuStep = {
  id: number;
  text: string;
};

type IProps = {
  cls?: string;
  abStyle?: boolean;
};

const AwardOne = ({ cls = "pt-125 pb-125", abStyle = false }: IProps) => {
  const t = useTranslations("home.instantIbu");
  const steps = t.raw("steps") as InstantIbuStep[];
  const sectionRef = useRef<HTMLDivElement>(null);

  const [activeThumb, setActiveThumb] = useState(1);
  const [isInView, setIsInView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const pauseAutoplayRef = useRef(false);
  const hasEnteredViewRef = useRef(false);
  const userScrollingRef = useRef(false);

  const awardData = steps.map((step, index) => ({
    id: step.id,
    img: AWARD_IMAGES[index],
    subtitle: String(step.id),
    title: step.text,
  }));

  const activeStep =
    awardData.find((item) => item.id === activeThumb) ?? awardData[0];

  const syncViewport = useCallback(() => {
    if (typeof window === "undefined") return;
    setIsDesktop(window.innerWidth >= LG_MIN_WIDTH);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setAutoplayEnabled(!reduceMotion);
  }, []);

  useEffect(() => {
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, [syncViewport]);

  useEffect(() => {
    let scrollIdleTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      userScrollingRef.current = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        userScrollingRef.current = false;
      }, SCROLL_IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollIdleTimer);
    };
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        setIsInView(visible);
        if (visible && !hasEnteredViewRef.current) {
          hasEnteredViewRef.current = true;
          setActiveThumb(1);
        }
      },
      { threshold: [0, 0.15, 0.35], rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !autoplayEnabled) return;

    const id = window.setInterval(() => {
      if (pauseAutoplayRef.current || userScrollingRef.current) return;
      setActiveThumb((prev) => (prev >= steps.length ? 1 : prev + 1));
    }, STEP_HOLD_MS);

    return () => window.clearInterval(id);
  }, [isInView, autoplayEnabled, steps.length]);

  const handleListMouseEnter = (id: number) => {
    if (!isDesktop) return;
    pauseAutoplayRef.current = true;
    setActiveThumb(id);
  };

  const handleListMouseLeave = () => {
    if (!isDesktop) return;
    pauseAutoplayRef.current = false;
  };

  return (
    <div
      ref={sectionRef}
      className={`tp-award-area instant-ibu-section ${cls}`}
    >
      <div className="container container-1630">
        {!abStyle && (
          <div className="row">
            <div className="col-xl-12 col-12">
              <div
                className="tp-award-title-box mb-50 text-left"
                style={{
                  display: "block",
                  visibility: "visible",
                  opacity: 1,
                }}
              >
                <h4
                  className="showcase-details-2-section-title tp-char-animation"
                  style={{
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                    fontSize: "clamp(2rem, 6vw, 4rem)",
                    lineHeight: "1.2",
                    color: "#053725",
                  }}
                >
                  {t("titleBefore")} <br /> <span>{t("titleBrand")}</span>
                </h4>
              </div>
            </div>
          </div>
        )}

        <div className="row align-items-start">
          <div className="col-xl-4 col-lg-4 d-none d-lg-block instant-ibu-desktop-col">
            <div
              className="tp-award-list-thumb-wrap p-relative d-flex align-items-start justify-content-center"
              style={{ minHeight: "auto", paddingTop: "0px", marginTop: "0px" }}
            >
              <div id="tp-award-thumb" className="instant-ibu-thumb-stack">
                {awardData.map((item) => (
                  <Image
                    key={item.id}
                    className={`tp-award-list-thumb-${item.id} instant-ibu-thumb-img${
                      item.id === activeThumb ? " is-active" : ""
                    }`}
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      objectFit: "contain",
                      aspectRatio: "auto",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className="col-xl-8 col-lg-8 d-none d-lg-block instant-ibu-desktop-col"
            onMouseLeave={handleListMouseLeave}
          >
            <div className="tp-award-list-wrap">
              {abStyle && (
                <div className="ab-award-title-sm">
                  <span>
                    <Leaf />
                    Our Awards
                  </span>
                </div>
              )}
              {awardData.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => handleListMouseEnter(item.id)}
                  className={`tp-award-list-item d-flex align-items-center tp_fade_bottom${
                    item.id === activeThumb ? " is-instant-ibu-active" : ""
                  }`}
                  rel={`tp-award-list-thumb-${item.id}`}
                >
                  <div className="tp-award-list-content-left d-flex align-items-center">
                    <span>{item.subtitle}</span>
                    <p>{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 d-lg-none">
            <div className="instant-ibu-mobile-stage">
              <div
                key={`step-${activeThumb}`}
                className="instant-ibu-mobile-text"
              >
                <span className="instant-ibu-mobile-num" aria-hidden="true">
                  {activeStep.subtitle}
                </span>
                <p className="instant-ibu-mobile-copy">{activeStep.title}</p>
              </div>
              <div className="instant-ibu-mobile-img-wrap">
                {awardData.map((item) => (
                  <div
                    key={item.id}
                    className={`instant-ibu-mobile-img-layer${
                      item.id === activeThumb ? " is-active" : ""
                    }`}
                    aria-hidden={item.id !== activeThumb}
                  >
                    <Image
                      src={item.img}
                      alt={item.id === activeThumb ? item.title : ""}
                      className="instant-ibu-mobile-img"
                      fill
                      sizes="100vw"
                      priority={item.id === 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardOne;