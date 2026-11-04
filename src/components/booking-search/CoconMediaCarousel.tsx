"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./CoconMediaCarousel.module.scss";
import type { PublicCoconImage } from "@/lib/booking/cocon-media-types";

type Props = {
  coconName: string;
  fallbackSrc: string;
  remoteImages: PublicCoconImage[];
  loadingRemote: boolean;
  mediaError: boolean;
  onRetryPhotos?: () => void;
  resetKey: number;
};

export default function CoconMediaCarousel({
  coconName,
  fallbackSrc,
  remoteImages,
  loadingRemote,
  mediaError,
  onRetryPhotos,
  resetKey,
}: Props) {
  const t = useTranslations("bookingSearch.coconChoice");
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(() => new Set());

  const slides = useMemo(() => {
    const valid = remoteImages
      .map((img) => img.url)
      .filter((url) => !brokenUrls.has(url));
    if (valid.length > 0) return valid;
    return [fallbackSrc];
  }, [remoteImages, brokenUrls, fallbackSrc]);

  const total = slides.length;
  const isFallbackOnly = slides.length === 1 && slides[0] === fallbackSrc;
  const showNav = total > 1;

  const altFor = (index: number) =>
    t("photoAlt", { index: index + 1, count: total, name: coconName });

  const wireSwiperControls = useCallback(
    (swiper: SwiperType) => {
      if (!showNav) return;
      const prev = prevRef.current;
      const next = nextRef.current;
      const pagination = paginationRef.current;
      if (!prev || !next || !pagination) return;

      if (typeof swiper.params.navigation === "object") {
        swiper.params.navigation.enabled = true;
        swiper.params.navigation.prevEl = prev;
        swiper.params.navigation.nextEl = next;
      }
      if (typeof swiper.params.pagination === "object") {
        swiper.params.pagination.enabled = true;
        swiper.params.pagination.el = pagination;
        swiper.params.pagination.clickable = true;
      }

      try {
        swiper.navigation.destroy();
      } catch {
        /* pas encore initialisé */
      }
      swiper.navigation.init();
      swiper.navigation.update();

      try {
        swiper.pagination.destroy();
      } catch {
        /* pas encore initialisé */
      }
      swiper.pagination.init();
      swiper.pagination.render();
      swiper.pagination.update();
    },
    [showNav]
  );

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper) wireSwiperControls(swiper);
  }, [wireSwiperControls, resetKey, slides.length]);

  return (
    <div className={styles.root}>
      {showNav && (
        <>
          <button
            ref={prevRef}
            type="button"
            className={`${styles.navBtn} ${styles.navPrev}`}
            aria-label={t("photoPrev")}
          >
            <ChevronLeft className={styles.navIcon} aria-hidden="true" strokeWidth={2.5} />
          </button>
          <button
            ref={nextRef}
            type="button"
            className={`${styles.navBtn} ${styles.navNext}`}
            aria-label={t("photoNext")}
          >
            <ChevronRight className={styles.navIcon} aria-hidden="true" strokeWidth={2.5} />
          </button>
        </>
      )}

      <Swiper
        key={resetKey}
        className={styles.swiper}
        modules={[Navigation, Pagination, Keyboard, A11y]}
        slidesPerView={1}
        loop={showNav}
        keyboard={{ enabled: true }}
        navigation={false}
        pagination={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          wireSwiperControls(swiper);
        }}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
      >
        {slides.map((src, i) => {
          const isRemote = src.startsWith("https://");
          return (
            <SwiperSlide key={`${resetKey}-${src}`}>
              <div className={styles.slideInner}>
                <Image
                  src={src}
                  alt={altFor(i)}
                  fill
                  className={styles.image}
                  sizes="(max-width: 640px) 100vw, 420px"
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  onError={() => {
                    if (isRemote) {
                      setBrokenUrls((prev) => new Set(prev).add(src));
                    }
                  }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {showNav && (
        <>
          <span className={styles.counter} aria-live="polite">
            {t("photoCounter", { current: activeIndex + 1, total })}
          </span>
          <div ref={paginationRef} className={styles.paginationHost} />
        </>
      )}

      {loadingRemote && isFallbackOnly && (
        <span className={styles.loadingShimmer} aria-hidden="true" />
      )}

      {mediaError && onRetryPhotos && (
        <button type="button" className={styles.retryPhotos} onClick={onRetryPhotos}>
          {t("retryPhotos")}
        </button>
      )}
    </div>
  );
}
