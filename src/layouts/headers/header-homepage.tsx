"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import HeaderMenus from "./header-menus";
import useSticky from "@/hooks/use-sticky";
import { Menu } from "@/components/svg";
import logoWhite from "@/assets/img/logo/logo-white.png";
import MobileOffcanvas from "@/components/offcanvas/mobile-offcanvas";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default function HeaderHomepage() {
  const { sticky, headerFullWidth } = useSticky();
  const [openOffCanvas, setOpenOffcanvas] = React.useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const isGiftCardPage = pathname === "/gift-card";

  useEffect(() => {
    headerFullWidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style jsx global>{`
        .header-homepage .tp-main-menu-content > ul > li > a {
          color: #fcf8e3 !important;
          transition: color 0.3s ease !important;
        }
        @media (min-width: 1200px) {
          .header-homepage .tp-main-menu-content > ul > li > a {
            font-size: 15px !important;
          }
        }
        .header-homepage .tp-main-menu-content > ul > li > a:hover {
          color: #ffffff !important;
        }
        .header-homepage .tp-submenu a {
          color: #053725 !important;
          transition: all 0.3s ease !important;
        }
        .header-homepage .tp-submenu a:hover {
          color: #031c13 !important;
          background-color: #f8f9fa !important;
        }
        .header-homepage .tp-inner-header-2-bar span {
          color: #fcf8e3 !important;
        }
        .header-homepage .tp-gift-card-menu-btn-mobile {
          color: #fcf8e3 !important;
          background-color: transparent !important;
          border: 2px solid #fcf8e3 !important;
        }
        .header-homepage .tp-gift-card-menu-btn-mobile:hover {
          background-color: transparent !important;
          border: 2px solid #fcf8e3 !important;
          color: #fcf8e3 !important;
        }
        .header-homepage .tp-gift-card-menu-btn {
          color: #fcf8e3 !important;
          background-color: transparent !important;
          border: 2px solid #fcf8e3 !important;
        }
        @media (min-width: 1200px) {
          .header-homepage .tp-gift-card-menu-btn {
            font-size: 13px !important;
            padding: 9px 14px !important;
            white-space: nowrap !important;
            line-height: 1 !important;
          }
        }
        .header-homepage .tp-gift-card-menu-btn:hover {
          background-color: transparent !important;
          border: 2px solid #fcf8e3 !important;
          color: #fcf8e3 !important;
        }
      `}</style>
      <header className="tp-header-height z-index-5 header-homepage">
        <div className="tp-inner-header-2-area tp-shop-mob-space tp-transparent tp-inner-header-white">
          <div className="container container-1800">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-4 col-md-4 col-4">
                <div className="tp-header-logo">
                  <Link href="/accueil">
                    <Image src={logoWhite} alt={t("common.brand")} />
                  </Link>
                </div>
              </div>
              <div className="col-xl-9 d-none d-xl-block">
                <div className="tp-inner-header-2-menu header-main-menu">
                  <nav className="tp-main-menu-content">
                    <HeaderMenus variant="homepage" />
                  </nav>
                </div>
              </div>
              <div className="col-xl-1 col-lg-8 col-md-8 col-8">
                <div className="tp-inner-header-2-right d-flex align-items-center justify-content-end">
                  <div className="d-xl-none me-3">
                    <LanguageSwitcher variant="homepage" />
                  </div>
                  {!isGiftCardPage && (
                    <Link
                      href="/gift-card"
                      className="tp-gift-card-menu-btn-mobile d-lg-none d-block me-3"
                    >
                      {t("nav.giftCard")}
                    </Link>
                  )}
                  <button
                    onClick={() => setOpenOffcanvas(true)}
                    className="tp-inner-header-2-bar tp-offcanvas-open-btn"
                  >
                    <span>
                      <Menu />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileOffcanvas
        openOffcanvas={openOffCanvas}
        setOpenOffcanvas={setOpenOffcanvas}
        variant="homepage"
      />
    </>
  );
}
