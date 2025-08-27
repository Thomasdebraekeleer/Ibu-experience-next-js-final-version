import React from 'react';
import { scroller } from 'react-scroll';
import {Swiper,SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import Image from 'next/image';
import { Leaf, ScrollDownTwo,UpArrowFour} from '@/components/svg';

// images
import full_image from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-1.jpg';
import full_image_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-2.jpg';
import port_img_1 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-3.jpg';
import port_img_2 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-4.jpg';
import port_img_3 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-5.jpg';
import port_img_4 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-6.jpg';
import port_img_5 from '@/assets/img/inner-project/portfolio-details-ibu-bien-etre/portfolio-img-7.jpg';

// slider images
const slider_images = [port_img_3,port_img_4,port_img_5,port_img_4];

// slider setting
const slider_setting:SwiperOptions = {
  slidesPerView: 3,
  loop: true,
  autoplay: true,
  spaceBetween: 20,
  speed: 1000,
  breakpoints: {
    '1400': {
      slidesPerView: 3,
    },
    '1200': {
      slidesPerView: 3,
    },
    '992': {
      slidesPerView: 2,
    },
    '768': {
      slidesPerView: 2,
    },
    '576': {
      slidesPerView: 1,
    },
    '0': {
      slidesPerView: 1,
    },
  },
}

export default function PortfolioDetailsIBUBienEtre() {
  const scrollTo = () => {
    scroller.scrollTo('xyz', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };
  return (
    <>
      {/* details are */}
      <div className="tp-project-details-3-top tp-project-details-3-ptb">
          <div className="container container-1560">
            <div className="row">
                <div className="col-xl-12">
                  <div className="tp-project-details-3-title-box">
                      <h2 className="tp-section-title-160 mb-50 tp-char-animation">IBÙ Bien-être - Harmonie & Sérénité</h2>
                  </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-6">
                  <div className="tp-project-details-3-scroll smooth">
                      <a onClick={scrollTo} className="pointer">
                        <span>
                            <ScrollDownTwo/>
                        </span>
                        Découvrir nos Soins
                      </a>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="tp-project-details-3-link mt-30 text-start text-md-end">
                      <a href="/reservations">
                        Réserver un Soin
                        <span>
                            <UpArrowFour/>
                        </span>
                      </a>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* details are */}

      {/* full image */}
      <div className="tp-project-details-3-full-width-thumb mb-120">
          <Image data-speed=".8" src={full_image} alt="IBÙ Bien-être Experience" style={{ height: 'auto' }}/>
      </div>
      {/* full image */}

      {/* details area */}
      <div className="showcase-details-2-area pb-120">
          <div className="container">
            <div className="row">
                <div className="col-xl-12">
                  <div className="showcase-details-2-section-box">
                      <h4 className="showcase-details-2-section-title tp-char-animation">Expériences de Bien-être</h4>
                  </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3">
                  <div className="showcase-details-2-section-left">
                      <span className="ab-inner-subtitle mb-25">
                        <Leaf/>
                        Une approche holistique
                      </span>
                  </div>
                </div>
                <div className="col-xl-9">
                  <div className="showcase-details-2-content-right tp_title_anim">
                      <p className="pb-25">Nos expériences de bien-être sont conçues pour harmoniser le corps, l&apos;esprit et l&apos;âme. Chaque soin est une invitation à la détente profonde et à la reconnexion avec soi-même.</p>
                      <p>Du Spa & Massages aux Retraites Nature, en passant par la Méditation & Yoga, chaque expérience est une porte vers l&apos;équilibre intérieur et la sérénité.</p>
                  </div>
                </div>
            </div>
          </div>
      </div>
      {/* details area */}

    {/*details thumb */}
        <div id="xyz" className="tp-project-details-3-thumb mb-120">
          <div className="container container-1560">
            <div className="row">
                <div className="col-xl-12">
                  <div className="tp-project-details-3-thumb-box">
                    <Image data-speed=".8" src={full_image_2} alt="IBÙ Bien-être Collection" style={{ height: 'auto' }}/>
                  </div>
                </div>
            </div>
          </div>
      </div>
    {/* details thumb */}

    {/* details area */}
    <div className="showcase-details-2-area pb-120">
        <div className="container">
          <div className="row">
              <div className="col-xl-8">
                <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation" style={{whiteSpace: 'nowrap'}}>Notre Philosophie</h4>
                </div>
              </div>
          </div>
          <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                    <span className="ab-inner-subtitle mb-25">
                      <Leaf/>
                      Notre vision
                    </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-content-right tp_title_anim">
                    <p className="pb-25">Notre philosophie repose sur la conviction que le bien-être authentique naît de l&apos;harmonie entre tous les aspects de notre être. Nous créons des espaces sacrés où la guérison naturelle peut s&apos;opérer.</p>
                    <p>Nous travaillons avec des praticiens certifiés et utilisons des techniques ancestrales combinées aux innovations modernes pour offrir des soins qui transforment véritablement.</p>
                </div>
              </div>
          </div>
        </div>
    </div>
    {/* details area */}

    {/* details thumb */}
    <div className="tp-project-details-3-thumb mb-90">
        <div className="container">
          <div className="row">
              <div className="col-xl-6">
                <div className="tp-project-details-3-thumb-box mb-30">
                    <Image className="w-100" src={port_img_1} alt="Spa & Massages" style={{height:'auto'}}/>
                </div>
              </div>
              <div className="col-xl-6">
                <div className="tp-project-details-3-thumb-box mb-30">
                  <Image className="w-100" src={port_img_2} alt="Retraites Nature" style={{height:'auto'}}/>
                </div>
              </div>
          </div>
        </div>
    </div>
    {/* details thumb */}

    {/* details area */}
    <div className="showcase-details-2-area pb-120">
        <div className="container">
          <div className="row">
              <div className="col-xl-8">
                <div className="showcase-details-2-section-box">
                    <h4 className="showcase-details-2-section-title tp-char-animation">La Transformation</h4>
                </div>
              </div>
          </div>
          <div className="row">
              <div className="col-xl-3">
                <div className="showcase-details-2-section-left">
                    <span className="ab-inner-subtitle mb-25">
                      <Leaf/>
                      Notre promesse
                    </span>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="showcase-details-2-content-right tp_title_anim">
                    <p className="pb-25">Chaque expérience de bien-être est conçue pour catalyser une transformation profonde. Nous croyons au pouvoir de la guérison naturelle et créons les conditions optimales pour que cette transformation puisse s&apos;opérer.</p>
                    <p>De la relaxation profonde à l&apos;éveil spirituel, nos soins vous accompagnent dans votre voyage vers l&apos;équilibre et l&apos;harmonie intérieure.</p>
                </div>
              </div>
          </div>
        </div>
    </div>
    {/* details area */}

     {/* slider images area */}
     <div className="pd-visual-slider-wrap pb-40">
          <Swiper {...slider_setting} modules={[Autoplay]} className="swiper-container pd-visual-slider-active">
              {slider_images.map((imgSrc, index) => (
                <SwiperSlide key={index}>
                  <div className="pd-visual-slider-thumb fix">
                    <Image src={imgSrc} alt="IBÙ Bien-être Gallery" style={{height:"auto"}}/>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      {/* slider images area */}
    </>
  )
}
