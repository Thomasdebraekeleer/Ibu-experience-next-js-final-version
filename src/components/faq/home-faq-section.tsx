"use client";

import { useTranslations } from "next-intl";
import FaqAccordion from "@/components/faq/faq-accordion";
import FaqSharedStyles from "@/components/faq/faq-shared-styles";

export default function HomeFaqSection() {
  const t = useTranslations("faq.hero");

  return (
    <>
      <FaqSharedStyles />
      <div
        className="ibu-home-faq-section"
        style={{
          marginTop: "72px",
          paddingTop: "48px",
          borderTop: "1px solid rgba(25, 25, 26, 0.1)",
        }}
      >
        <div className="row">
          <div className="col-xl-12">
            <h2 className="ibu-faq-hero-title tp_title_anim">{t("title")}</h2>
            <p className="ibu-faq-hero-lead tp_title_anim">{t("subtitle")}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <FaqAccordion variant="embedded" initialOpenIndex={null} />
          </div>
        </div>
      </div>
    </>
  );
}
