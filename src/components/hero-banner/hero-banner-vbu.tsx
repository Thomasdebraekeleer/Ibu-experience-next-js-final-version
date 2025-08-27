'use client';
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import Link from "next/link";

const hero_data = [
  {
    id: 1,
    bg: "/assets/img/inner-shop/home/slider-1.jpg",
    subtitle: "DÉCOUVREZ",
    title: "Des Expériences <br/> Uniques",
  },
  {
    id: 2,
    bg: "/assets/img/inner-shop/home/slider-2.jpg",
    subtitle: "AVENTURES",
    title: "Voyages <br/> Mémorables",
  },
  {
    id: 3,
    bg: "/assets/img/inner-shop/home/slider-3.jpg",
    subtitle: "IMMERSION",
    title: "Expériences <br/> Authentiques",
  },
];

export default function HeroBannerVBU() {
  const progressBar = useRef<HTMLSpanElement | null>(null);
  const slider_setting: SwiperOptions = {
    slidesPerView: 1,
    loop: false,
    spaceBetween: 0,
    speed: 1000,
    effect: "fade",
    navigation: {
      prevEl: ".tp-vbu-prev",
      nextEl: ".tp-vbu-next",
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: "#vbu-paginations",
      type: "custom",
      renderCustom: function (swiper, current, total) {
        const zero = total > 9 ? "" : "0";
        const index = zero + current;
        const all = zero + total;
        const html = `<div class="vbu-slider-pagination">
                  <span>${index}</span>
                  <span>${all}</span>
                </div>`;
        return html;
      },
    },
  };
  return (
    <div className="tp-vbu-slider-area p-relative">
      <div className="vbu-slider-wrapper">
        <Swiper
          {...slider_setting}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          className="swiper-container tp-vbu-slider-active"
          onAutoplayTimeLeft={(s, time, progress) => {
            progressBar.current && (progressBar.current.style.transform = `scaleX(calc(1 - ${progress}))`);
          }}
        >
          <div className="tp-vbu-slider-arrow-box">
            <button className="tp-vbu-next">
              <i className="fa-light fa-angle-left"></i>
            </button>
            <button className="tp-vbu-prev">
              <i className="fa-light fa-angle-right"></i>
            </button>
          </div>
          {hero_data.map((item) => (
            <SwiperSlide key={item.id} className="swiper-slide">
              <div className="tp-vbu-slider-bg tp-vbu-slider-overlay">
                <div
                  className="tp-vbu-slider-thumb"
                  style={{ backgroundImage: `url(${item.bg})` }}
                ></div>
                <div className="container container-1300">
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="tp-vbu-slider-content z-index">
                        <div className="tp-vbu-slider-title-box">
                          <span className="tp-vbu-slider-subtitle">
                            {item.subtitle}
                          </span>
                          <h2
                            className="tp-vbu-slider-title"
                            dangerouslySetInnerHTML={{ __html: item.title }}
                          ></h2>
                        </div>
                        <div className="tp-vbu-slider-btn-box">
                          <Link className="tp-vbu-btn" href="/experiences">
                            Découvrir
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="fraction-wrapper d-none d-lg-block">
            <div id="vbu-paginations"></div>
            <div className="vbu-slider-progress-bar">
              <span ref={progressBar}></span>
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
}
