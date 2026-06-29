"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LineTextSyne from "@/components/line-text/line-text-syne";
import logo from "@/assets/img/logo/logo-white.png";
import { RightArrow } from "@/components/svg";
import { Link } from "@/i18n/navigation";

export default function FooterThree() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <footer>
      <div className="tp-footer-4-area black-bg pt-30 pb-120">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <LineTextSyne />
            </div>
          </div>
        </div>
        <div className="container container-1480">
          <div className="tp-footer-4-top">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="tp-footer-4-top-left">
                  <p>
                    {t("ctaLine1")} <br /> {t("ctaLine2")}
                  </p>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="tp-footer-4-top-right text-start text-md-end">
                  <Link href="/contact" className="tp-btn-white-lg">
                    {t("contactButton")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tp-footer-2-area black-bg pb-20">
        <div className="container container-1480">
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 mb-50">
              <div className="tp-footer-2-widget footer-col-2-1">
                <div className="tp-footer-2-widget-logo">
                  <Link href="/accueil">
                    <Image src={logo} alt={tCommon("brand")} />
                  </Link>
                </div>
                <div className="tp-footer-2-widget-text">
                  <p>
                    {tCommon("taglineFooterLine1")} <br />{" "}
                    {tCommon("taglineFooterLine2")}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-6 mb-50 d-none d-md-block">
              <div className="tp-footer-2-widget footer-col-2-2">
                <div className="tp-footer-2-widget-menu">
                  <h4 className="tp-footer-2-widget-title">{t("sitemap")}</h4>
                  <ul>
                    <li>
                      <Link href="/accueil">{t("home")}</Link>
                    </li>
                    <li>
                      <Link href="/experiences">{t("experience")}</Link>
                    </li>
                    <li>
                      <Link href="/reservations">{t("reservation")}</Link>
                    </li>
                    <li>
                      <Link href="/a-propos">{t("about")}</Link>
                    </li>
                    <li>
                      <Link href="/devenir-partenaire">{t("partner")}</Link>
                    </li>
                    <li>
                      <Link href="/contact">{t("contact")}</Link>
                    </li>
                    <li>
                      <Link href="/faq">{t("faq")}</Link>
                    </li>
                    <li>
                      <Link href="/blog">{t("blog")}</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-5 col-md-6 mb-50">
              <div className="tp-footer-2-widget footer-col-2-3">
                <h4 className="tp-footer-2-widget-title">{t("info")}</h4>
                <div className="tp-footer-2-contact-item">
                  <span>
                    {t("addressLine1")}
                    <br />
                    {t("addressLine2")}
                    <br />
                    {t("addressLine3")}
                  </span>
                </div>
                <div className="tp-footer-2-contact-item">
                  <span>
                    <a href="mailto:info@ibu-experience.be">{t("email")}</a>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-5 col-md-6 mb-50">
              <div className="tp-footer-2-widget footer-col-2-4">
                <div className="tp-footer-2-widget-newslatter">
                  <h4 className="tp-footer-2-widget-title">
                    {t("newsletter")}
                  </h4>
                  <form action="#">
                    <div className="tp-footer-2-input p-relative">
                      <input
                        type="text"
                        placeholder={t("newsletterPlaceholder")}
                      />
                      <button type="submit" aria-label={t("newsletter")}>
                        <RightArrow />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tp-copyright-2-area tp-copyright-2-bdr-top black-bg">
        <div className="container container-1480">
          <div className="row align-items-center">
            <div className="col-xl-4 col-lg-5">
              <div className="tp-copyright-2-left text-center text-lg-start">
                <p>
                  {t("copyright", { year: new Date().getFullYear() })}{" "}
                  <a
                    href="https://www.nrv.brussels/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NRV Agency
                  </a>
                </p>
              </div>
            </div>
            <div className="col-xl-8 col-lg-7">
              <div className="tp-copyright-2-social text-center text-lg-end">
                <a
                  className="mb-10"
                  href="https://www.linkedin.com/company/ib%C3%B9-experience/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </a>
                <a
                  className="mb-10"
                  href="https://www.facebook.com/people/IB%C3%99-Experience/61571861925403/#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
                <a
                  className="mb-10"
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
    </footer>
  );
}
