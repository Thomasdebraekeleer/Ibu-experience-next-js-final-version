"use client";

import React, { CSSProperties, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { getMenuData } from "@/data/menu-data";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

const imgStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  objectFit: "cover",
};

type HeaderMenusProps = {
  variant?: "homepage" | "default";
};

const HeaderMenus = ({ variant = "default" }: HeaderMenusProps) => {
  const pathname = usePathname();
  const t = useTranslations();
  const isGiftCardPage = pathname === "/gift-card";

  const menuData = useMemo(() => getMenuData((key) => t(key)), [t]);
  const filteredMenuData = menuData.filter((menu) => menu.link !== pathname);

  return (
    <ul>
      {filteredMenuData.map((menu) => (
        <li key={menu.id} className="has-dropdown">
          <Link href={menu.link}>{menu.title}</Link>
          {menu.home_menus ? (
            <div className="tp-submenu submenu tp-mega-menu">
              <div className="tp-menu-fullwidth">
                <div className="tp-homemenu-wrapper">
                  <div className="row gx-25 row-cols-xl-6 row-cols-lg-2 row-cols-md-2 row-cols-1">
                    {menu.home_menus.map((home_menu, i) => (
                      <div key={i} className="col homemenu">
                        <div className="homemenu-thumb-wrap mb-20">
                          <div className="homemenu-thumb fix">
                            <Link href={home_menu.link}>
                              <Image
                                src={home_menu.img}
                                alt="home-img"
                                width={251}
                                height={235}
                                style={imgStyle}
                              />
                            </Link>
                          </div>
                        </div>
                        <div className="homemenu-content text-center">
                          <h4 className="homemenu-title">
                            <Link href={home_menu.link}>{home_menu.title}</Link>
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : menu.dropdown_menus ? (
            <ul className="tp-submenu submenu">
              {menu.dropdown_menus.map((mm, i) => (
                <li key={i}>
                  <Link href={mm.link}>{mm.title}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
      <li className="tp-language-switcher-wrapper d-none d-xl-inline-block me-3">
        <LanguageSwitcher variant={variant} />
      </li>
      {!isGiftCardPage && (
        <li className="tp-gift-card-menu-btn-wrapper">
          <Link href="/gift-card" className="tp-gift-card-menu-btn">
            {t("nav.giftCard")}
          </Link>
        </li>
      )}
    </ul>
  );
};

export default HeaderMenus;
