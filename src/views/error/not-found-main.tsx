"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterThree from "@/layouts/footers/footer-three";

export default function NotFoundMain() {
  const t = useTranslations("notFound");

  return (
    <Wrapper>
      <HeaderVBU />
      <main className="tp-error-area pt-190 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-error-wrapper text-center">
                <h1 className="tp-error-title">{t("heading")}</h1>
                <div className="tp-error-content">
                  <h2 className="tp-error-title-sm">{t("title")}</h2>
                  <p>{t("description")}</p>
                  <Link className="tp-btn-black-2" href="/accueil">
                    {t("backHome")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterThree />
    </Wrapper>
  );
}
