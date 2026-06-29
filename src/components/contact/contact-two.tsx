"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ContactForm from "../form/contact-form";
import Social from "../social/social";
import shape from "@/assets/img/inner-about/about/shape-1.png";

export default function ContactTwo() {
  const t = useTranslations("contact.section");

  return (
    <div className="cn-contactform-area cn-contactform-style p-relative pb-100">
      <div className="ab-2-hero-social-wrap d-none d-xl-block">
        <div className="ab-2-hero-social">
          <Social />
        </div>
        <div className="ab-2-hero-social-text">
          <span>{t("followUs")}</span>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-5">
            <div className="ab-about-category-title-box mb-40 p-relative">
              <h4 className="ab-about-category-title">
                {t("headingLine1")} <br />
                <span>{t("headingLine2")}</span>
              </h4>
              <Image
                className="ab-about-shape-1 d-none d-xl-block"
                src={shape}
                alt=""
              />
            </div>
          </div>
          <div className="col-xl-7">
            <div className="cn-contactform-wrap">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
