'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeaderMenus from './header-menus';
import useSticky from '@/hooks/use-sticky';
import { Menu } from '@/components/svg';
import logoGreen from '@/assets/img/logo/logo-green.png';
import logoWhite from '@/assets/img/logo/logo-white.png';
import useIsHomepage from '@/hooks/use-is-homepage';
import MobileOffcanvas from '@/components/offcanvas/mobile-offcanvas';

export default function HeaderVBU() {
  const {sticky,headerFullWidth} = useSticky();
  const [openOffCanvas, setOpenOffcanvas] = React.useState(false);
  const isHomepage = useIsHomepage();
  
  useEffect(() => {
    headerFullWidth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {/* Styles spécifiques pour les autres pages */}
      <style jsx global>{`
        /* Menu principal */
        .header-other-pages .tp-main-menu-content > ul > li > a {
          color: #053725 !important;
          transition: color 0.3s ease !important;
        }
        .header-other-pages .tp-main-menu-content > ul > li > a:hover {
          color: #031c13 !important;
        }
        
        /* Sous-menus : même fluidité que la page d'accueil */
        .header-other-pages .tp-submenu a {
          color: #053725 !important;
          transition: all 0.3s ease !important;
        }
        .header-other-pages .tp-submenu a:hover {
          color: #031c13 !important;
          background-color: #f8f9fa !important;
        }
        
        /* Menu burger */
        .header-other-pages .tp-inner-header-2-bar span {
          color: #053725 !important;
        }
        
        /* Bouton Carte cadeau mobile - autres pages */
        .header-other-pages .tp-gift-card-menu-btn-mobile {
          color: #053725 !important;
          background-color: transparent !important;
          border: 2px solid #053725 !important;
        }
        .header-other-pages .tp-gift-card-menu-btn-mobile:hover {
          background-color: transparent !important;
          border: 2px solid #053725 !important;
          color: #053725 !important;
        }
        
        /* Bouton Carte cadeau desktop - autres pages */
        .header-other-pages .tp-gift-card-menu-btn {
          color: #053725 !important;
          background-color: transparent !important;
          border: 2px solid #053725 !important;
        }
        .header-other-pages .tp-gift-card-menu-btn:hover {
          background-color: transparent !important;
          border: 2px solid #053725 !important;
          color: #053725 !important;
        }
      `}</style>
      <header className="tp-header-height z-index-5 header-other-pages">
        <div className="tp-inner-header-2-area tp-shop-mob-space tp-transparent tp-inner-header-white">
          <div className="container container-1800">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-4 col-md-4 col-4">
                <div className="tp-header-logo">
                  <Link href="/accueil">
                    <Image src={isHomepage ? logoWhite : logoGreen} alt="VBU Experience" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-8 d-none d-xl-block">
                <div className="tp-inner-header-2-menu header-main-menu">
                  <nav className="tp-main-menu-content">
                    {/* header menus */}
                    <HeaderMenus />
                    {/* header menus */}
                  </nav>
                </div>
              </div>
              <div className="col-xl-2 col-lg-8 col-md-8 col-8">
                <div className="tp-inner-header-2-right d-flex align-items-center justify-content-end">
                  {/* Bouton Carte cadeau mobile */}
                  <Link href="/gift-card" className="tp-gift-card-menu-btn-mobile d-lg-none d-block me-3">
                    Carte cadeau
                  </Link>
                  <button onClick={()=> setOpenOffcanvas(true)} className="tp-inner-header-2-bar tp-offcanvas-open-btn">
                    <span>
                      <Menu/>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* off canvas */}
      <MobileOffcanvas openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffcanvas} />
      {/* off canvas */}
    </>
  )
}
