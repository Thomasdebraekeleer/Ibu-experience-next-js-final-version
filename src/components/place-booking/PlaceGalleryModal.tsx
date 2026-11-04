"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import styles from "./place-booking.module.scss";

type Props = {
  open: boolean;
  coconName: string;
  images: string[];
  onClose: () => void;
};

export default function PlaceGalleryModal({ open, coconName, images, onClose }: Props) {
  const t = useTranslations("placeBooking");
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
    openerRef.current?.focus();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  const wireSwiperControls = useCallback(
    (swiper: SwiperType) => {
      if (typeof swiper.params.navigation === "object") {
        swiper.params.navigation.enabled = true;
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
      }
      try {
        swiper.navigation.destroy();
      } catch {
        /* noop */
      }
      swiper.navigation.init();
      swiper.navigation.update();
    },
    []
  );

  if (!mounted || !open || images.length === 0) return null;

  const total = images.length;

  return createPortal(
    <div className={styles.galleryOverlay} role="presentation" onClick={handleClose}>
      <div
        className={styles.galleryDialog}
        role="dialog"
        aria-modal="true"
        aria-label={coconName}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.galleryClose}
          onClick={handleClose}
          aria-label={t("close")}
        >
          <X aria-hidden="true" />
        </button>
        <div className={styles.gallerySwiperWrap}>
          {total > 1 && (
            <>
              <button
                ref={prevRef}
                type="button"
                className={`${styles.galleryNav} ${styles.galleryNavPrev}`}
                aria-label={t("photoPrev")}
              >
                <ChevronLeft aria-hidden="true" size={44} strokeWidth={2.25} />
              </button>
              <button
                ref={nextRef}
                type="button"
                className={`${styles.galleryNav} ${styles.galleryNavNext}`}
                aria-label={t("photoNext")}
              >
                <ChevronRight aria-hidden="true" size={44} strokeWidth={2.25} />
              </button>
            </>
          )}
          <Swiper
            className={styles.gallerySwiper}
            modules={[Navigation, Keyboard, A11y]}
            slidesPerView={1}
            loop={total > 1}
            keyboard={{ enabled: true }}
            navigation={false}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              wireSwiperControls(swiper);
            }}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
          >
            {images.map((src, i) => (
              <SwiperSlide key={src}>
                <div className={styles.gallerySlideInner}>
                  <Image
                    src={src}
                    alt={t("photoAlt", { index: i + 1, count: total, name: coconName })}
                    fill
                    className={styles.galleryImage}
                    sizes="(max-width: 768px) 100vw, 900px"
                    priority={i === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <span className={styles.galleryCounter}>
            {t("photoCounter", { current: activeIndex + 1, total })}
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
