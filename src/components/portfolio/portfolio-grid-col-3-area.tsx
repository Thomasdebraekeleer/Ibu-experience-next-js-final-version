"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { UpArrow } from "../svg";
import { useIsotop } from "@/hooks/use-isotop";

type CategoryKey = "vignoble" | "chateau" | "domaine";
type TitleKey = "domaineMehaignoul" | "comingSoon";

const portfolio_data: {
  id: number;
  img: string;
  categoryKey: CategoryKey;
  titleKey: TitleKey;
  show: string;
}[] = [
  {
    id: 1,
    img: "/assets/img/inner-project/portfolio-col-2/port-9.jpg",
    categoryKey: "vignoble",
    titleKey: "domaineMehaignoul",
    show: "cat1",
  },
  {
    id: 2,
    img: "/assets/img/inner-project/portfolio-col-2/port-8.jpg",
    categoryKey: "chateau",
    titleKey: "comingSoon",
    show: "cat2",
  },
  {
    id: 3,
    img: "/assets/img/inner-project/portfolio-col-2/port-7.jpg",
    categoryKey: "vignoble",
    titleKey: "comingSoon",
    show: "cat1",
  },
  {
    id: 4,
    img: "/assets/img/inner-project/portfolio-col-2/port-6.jpg",
    categoryKey: "vignoble",
    titleKey: "comingSoon",
    show: "cat1",
  },
  {
    id: 5,
    img: "/assets/img/inner-project/portfolio-col-2/port-5.jpg",
    categoryKey: "chateau",
    titleKey: "comingSoon",
    show: "cat2",
  },
  {
    id: 6,
    img: "/assets/img/inner-project/portfolio-col-2/port-4.jpg",
    categoryKey: "domaine",
    titleKey: "comingSoon",
    show: "cat3",
  },
];

type IProps = {
  style_2?: boolean;
};

export default function PortfolioGridColThreeArea({ style_2 = false }: IProps) {
  const t = useTranslations("reservations");
  const { initIsotop, isotopContainer } = useIsotop();

  useEffect(() => {
    initIsotop();
  }, [initIsotop]);

  const cursorLabel = t("cursor.availability");

  return (
    <div className="tp-project-5-2-area tp-project-5-2-pt pb-130">
      <div className={`container container-${style_2 ? "1800" : "1530"}`}>
        {!style_2 && (
          <div className="row justify-content-center">
            <div className="col-xl-8">
              <div className="portfolio-filter masonary-menu d-flex justify-content-center mb-60">
                <button data-filter="*" className="active">
                  <span>{t("filters.all")}</span>
                </button>
                <button data-filter=".cat1">
                  <span>{t("filters.vignoble")}</span>
                </button>
                <button data-filter=".cat2">
                  <span>{t("filters.chateau")}</span>
                </button>
                <button data-filter=".cat3">
                  <span>{t("filters.domaine")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="row grid" ref={isotopContainer}>
          {portfolio_data.map((item) => (
            <div
              key={item.id}
              className={`col-xl-4 col-lg-6 col-md-6 grid-item ${item.show}`}
            >
              <div
                className="tp-project-5-2-thumb mb-30 p-relative not-hide-cursor"
                data-cursor={cursorLabel}
              >
                {item.id === 1 ? (
                  <Link href="/domaine-de-mehaignoul" className="cursor-hide">
                    <Image
                      className="anim-zoomin"
                      src={item.img}
                      alt={t(`grid.titles.${item.titleKey}`)}
                      width={style_2 ? 573 : 486}
                      height={style_2 ? 683 : 576}
                      style={{ height: "100%" }}
                    />
                    <div className="tp-project-5-2-category tp_fade_anim">
                      <span>{t(`grid.categories.${item.categoryKey}`)}</span>
                    </div>
                    <div className="tp-project-5-2-content tp_fade_anim">
                      <h4 className="tp-project-5-2-title-sm">
                        {t(`grid.titles.${item.titleKey}`)}
                      </h4>
                    </div>
                  </Link>
                ) : (
                  <div className="cursor-hide">
                    <Image
                      className="anim-zoomin"
                      src={item.img}
                      alt={t(`grid.titles.${item.titleKey}`)}
                      width={style_2 ? 573 : 486}
                      height={style_2 ? 683 : 576}
                      style={{ height: "100%" }}
                    />
                    <div className="tp-project-5-2-category tp_fade_anim">
                      <span>{t(`grid.categories.${item.categoryKey}`)}</span>
                    </div>
                    <div className="tp-project-5-2-content tp_fade_anim">
                      <h4 className="tp-project-5-2-title-sm">
                        {t(`grid.titles.${item.titleKey}`)}
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-projct-5-2-btn-box mt-50 d-flex justify-content-center">
              <div className="tp-hover-btn-wrapper">
                <div className="tp-btn-circle style-2 tp-hover-btn-item tp-hover-btn">
                  <span className="tp-btn-circle-text">
                    {t("cta.line1")} <br /> {t("cta.line2")}
                  </span>
                  <span className="tp-btn-circle-icon">
                    <UpArrow />
                  </span>
                  <i className="tp-btn-circle-dot"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
