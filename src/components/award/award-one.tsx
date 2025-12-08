"use client";
import React from "react";
import Image from "next/image";

// award images
import a_1 from "@/assets/img/home-01/award/award-1.png";
import a_2 from "@/assets/img/home-01/award/award-2.png";
import a_3 from "@/assets/img/home-01/award/award-3.png";
import a_4 from "@/assets/img/home-01/award/award-4.png";
import a_5 from "@/assets/img/home-01/award/award-5.png";
import a_6 from "@/assets/img/home-01/award/award-6.png";
import { Leaf } from "../svg";

const award_data = [
  {
    id: 1,
    img: a_1,
    subtitle: "1",
    title: "Déposez vos bagages et vos soucis.",
    date: "Jun 24, 2024",
  },
  {
    id: 2,
    img: a_2,
    subtitle: "2",
    title: "Éteignez votre téléphone, éveillez vos sens.",
    date: "Nov 24, 2022",
  },
  {
    id: 3,
    img: a_3,
    subtitle: "3",
    title: "Enveloppez-vous dans un doux peignoir.",
    date: "May 24, 2012",
  },
  {
    id: 4,
    img: a_4,
    subtitle: "4",
    title: "Inspirez la quiétude.",
    date: "Sep 10, 2021",
  },
  {
    id: 5,
    img: a_5,
    subtitle: "5",
    title: "Retissez le lien avec la nature et ceux que vous aimez.",
    date: "Jun 12, 2021",
  },
  {
    id: 6,
    img: a_6,
    subtitle: "6",
    title: "Bienvenue dans votre instant hors du temps.",
    date: "Aug 18, 2022",
  },
];

// prop type
type IProps = {
  cls?: string;
  abStyle?: boolean;
};
const AwardOne = ({cls="pt-125 pb-125",abStyle=false}: IProps) => {
  const [activeThumb, setActiveThumb] = React.useState(1);
  return (
    <div className={`tp-award-area ${cls}`}>
      <div className="container container-1630">
        {/* Titre séparé */}
        {!abStyle && (
          <div className="row">
            <div className="col-xl-12 col-12">
              <div className="tp-award-title-box mb-50 text-left" style={{
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}>
                <h4 className="showcase-details-2-section-title tp-char-animation" style={{
                  display: 'block',
                  visibility: 'visible',
                  opacity: 1,
                  fontSize: 'clamp(2rem, 6vw, 4rem)',
                  lineHeight: '1.2',
                  color: '#053725'
                }}>
                  L&apos;instant <br /> <span>IBÙ</span>
                </h4>
              </div>
            </div>
          </div>
        )}
        
        {/* Contenu principal avec photo et 6 lignes */}
        <div className="row align-items-start">
          {/* Colonne images - PC seulement */}
          <div className="col-xl-4 col-lg-4 d-none d-lg-block">
            <div className="tp-award-list-thumb-wrap p-relative d-flex align-items-start justify-content-center" style={{minHeight: 'auto', paddingTop: '0px', marginTop: '0px'}}>
              <div
                id="tp-award-thumb"
                className={`tp-award-list-thumb-${activeThumb}`}
              >
                {award_data.map((item) => (
                  <Image
                    key={item.id}
                    className={`tp-award-list-thumb-${item.id} ${item.id === 1 ? 'hide-valise-mobile' : ''}`}
                    src={item.img}
                    alt="list-thumb"
                    style={{
                      width: 'auto', 
                      height: 'auto', 
                      maxWidth: '100%',
                      objectFit: 'contain',
                      aspectRatio: 'auto'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Colonne texte - pleine largeur sur mobile */}
          <div className="col-xl-8 col-lg-8 col-12">
            <div className="tp-award-list-wrap">
              {abStyle && (
                <div className="ab-award-title-sm">
                  <span>
                    <Leaf />
                    Our Awards
                  </span>
                </div>
              )}
                {award_data.map((item) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => window.innerWidth >= 992 ? setActiveThumb(item.id) : null}
                    className="tp-award-list-item d-flex align-items-center tp_fade_bottom"
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
        </div>
      </div>
    </div>
  );
};

export default AwardOne;
