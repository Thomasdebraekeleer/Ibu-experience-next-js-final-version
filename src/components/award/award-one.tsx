"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import a_1 from "@/assets/img/home-01/award/award-1.png";
import a_2 from "@/assets/img/home-01/award/award-2.png";
import a_3 from "@/assets/img/home-01/award/award-3.png";
import a_4 from "@/assets/img/home-01/award/award-4.png";
import a_5 from "@/assets/img/home-01/award/award-5.png";
import a_6 from "@/assets/img/home-01/award/award-6.png";
import { Leaf } from "../svg";

const AWARD_IMAGES = [a_1, a_2, a_3, a_4, a_5, a_6];

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
  const [activeThumb, setActiveThumb] = React.useState(1);

  const awardData = steps.map((step, index) => ({
    id: step.id,
    img: AWARD_IMAGES[index],
    subtitle: String(step.id),
    title: step.text,
  }));

  return (
    <div className={`tp-award-area ${cls}`}>
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
          <div className="col-xl-4 col-lg-4 d-none d-lg-block">
            <div
              className="tp-award-list-thumb-wrap p-relative d-flex align-items-start justify-content-center"
              style={{ minHeight: "auto", paddingTop: "0px", marginTop: "0px" }}
            >
              <div
                id="tp-award-thumb"
                className={`tp-award-list-thumb-${activeThumb}`}
              >
                {awardData.map((item) => (
                  <Image
                    key={item.id}
                    className={`tp-award-list-thumb-${item.id} ${item.id === 1 ? "hide-valise-mobile" : ""}`}
                    src={item.img}
                    alt="list-thumb"
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
              {awardData.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() =>
                    window.innerWidth >= 992 ? setActiveThumb(item.id) : null
                  }
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
