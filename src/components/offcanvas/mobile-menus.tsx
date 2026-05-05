'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import menu_data from "@/data/menu-data";

export default function MobileMenus() {
  const [navTitle, setNavTitle] = React.useState<string>("");
  const pathname = usePathname();
  
  // Filtrer les éléments du menu pour exclure la page actuelle
  const filteredMenuData = menu_data.filter((menu) => menu.link !== pathname);

  //openMobileMenu
  const openMobileMenu = (menu: string) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };
  return (
    <>
      <nav className="tp-main-menu-content">
        <ul>
          {filteredMenuData.map((menu) => (
            <li
              key={menu.id}
              className={`has-dropdown ${
                menu.home_menus ? "has-homemenu" : ""
              } ${menu.home_menus ? "dropdown-opened" : ""}`}
            >
              <div className="d-flex align-items-center justify-content-between">
                <Link href={menu.link} className="flex-grow-1">
                  {menu.title}
                </Link>
                {menu.dropdown_menus && menu.dropdown_menus.length > 0 && (
                  <button 
                    className="dropdown-toggle-btn ms-2"
                    onClick={(e) => {
                      e.preventDefault();
                      openMobileMenu(menu.title);
                    }}
                  >
                    <i className="fa-light fa-plus"></i>
                  </button>
                )}
              </div>
              {menu.home_menus ? (
                <div className="tp-submenu submenu tp-mega-menu" style={{ display: navTitle === menu.title ? "block" : "none"}}>
                  <div className="tp-menu-fullwidth">
                    <div className="tp-homemenu-wrapper">
                      <div className="row gx-25 row-cols-xl-6 row-cols-lg-2 row-cols-md-2 row-cols-1">
                        {menu.home_menus.map((hm, i) => (
                          <div key={i} className="col homemenu">
                            <div className="homemenu-thumb-wrap mb-20">
                              <div className="homemenu-thumb fix">
                                <Link href={hm.link}>
                                  <Image src={hm.img} alt={hm.title} width={512} height={480} style={{ height: "100%" }} />
                                </Link>
                              </div>
                            </div>
                            <div className="homemenu-content text-center">
                              <h4 className="homemenu-title">
                                <Link href={hm.link}>{hm.title}</Link>
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : menu.dropdown_menus ? (
                <ul className="tp-submenu submenu" style={{ display: navTitle === menu.title ? "block" : "none"}}>
                  {menu.dropdown_menus.map((mm, i) => (
                    <li key={i}>
                      <Link href={mm.link}>{mm.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
