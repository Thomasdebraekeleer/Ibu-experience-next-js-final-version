"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CloseTwo } from "../svg";
import logo from "@/assets/img/logo/logo.png";
import gallery_1 from "@/assets/img/inner-project/showcase/Carroussel new/Image 1.webp";
import gallery_2 from "@/assets/img/inner-project/showcase/Carroussel new/Image 3.webp";
import gallery_3 from "@/assets/img/inner-project/showcase/Carroussel new/Image 6.webp";
import gallery_4 from "@/assets/img/inner-project/showcase/Carroussel new/Image 7.webp";
import { Link } from "@/i18n/navigation";
import MobileMenus from "./mobile-menus";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

const gallery_images = [
  { src: gallery_1, altIndex: 2 },
  { src: gallery_2, altIndex: 4 },
  { src: gallery_3, altIndex: 7 },
  { src: gallery_4, altIndex: 8 },
] as const;

type IProps = {
  openOffcanvas: boolean;
  setOpenOffcanvas: React.Dispatch<React.SetStateAction<boolean>>;
  variant?: "homepage" | "default";
};

export default function MobileOffcanvas({
  openOffcanvas,
  setOpenOffcanvas,
  variant = "default",
}: IProps) {
  const t = useTranslations();

  return (
    <>
      <div className={`tp-offcanvas-area ${openOffcanvas ? "opened" : ""}`}>
        <div className="tp-offcanvas-wrapper">
          <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
            <div className="tp-offcanvas-logo">
              <Link href="/accueil">
                <Image src={logo} alt={t("common.brand")} />
              </Link>
            </div>
            <div className="tp-offcanvas-close">
              <button
                className="tp-offcanvas-close-btn"
                onClick={() => setOpenOffcanvas(false)}
              >
                <CloseTwo />
              </button>
            </div>
          </div>
          <div className="tp-offcanvas-main">
            <div className="tp-offcanvas-content">
              <h3 className="tp-offcanvas-title">{t("common.brand")}</h3>
              <p>{t("common.tagline")}</p>
              <div className="mt-3">
                <LanguageSwitcher variant={variant} />
              </div>
            </div>
            <div className="tp-main-menu-mobile d-xl-none">
              <MobileMenus />
            </div>
            <div className="tp-offcanvas-gallery">
              <div className="row gx-2">
                {gallery_images.map((item) => (
                  <div className="col-md-3 col-3" key={item.altIndex}>
                    <div className="tp-offcanvas-gallery-img fix">
                      <a href="#" className="position-relative d-block w-100 h-100">
                        <Image
                          src={item.src}
                          alt={t("home.evasion.carouselImageAlt", { index: item.altIndex })}
                          fill
                          sizes="25vw"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="tp-offcanvas-contact">
              <h3 className="tp-offcanvas-title sm">
                {t("offcanvas.information")}
              </h3>

              <ul>
                <li>
                  <a href="mailto:info@ibu-experience.be">
                    info@ibu-experience.be
                  </a>
                </li>
              </ul>
            </div>
            <div className="tp-offcanvas-social">
              <h3 className="tp-offcanvas-title sm">
                {t("offcanvas.followUs")}
              </h3>
              <div className="tp-offcanvas-social-links">
                <a
                  href="https://www.linkedin.com/company/ib%C3%B9-experience/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.facebook.com/people/IB%C3%99-Experience/61571861925403/#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/ibu_experience/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => setOpenOffcanvas(false)}
        className={`body-overlay ${openOffcanvas ? "opened" : ""}`}
      ></div>
    </>
  );
}
