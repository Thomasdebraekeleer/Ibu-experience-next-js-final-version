import React from "react";
import Link from "next/link";
import Image from "next/image";
// internal imports
import logoGreen from '@/assets/img/logo/logo-green.png';
import logoWhite from '@/assets/img/logo/logo-white.png';
import useIsHomepage from '@/hooks/use-is-homepage';
import MobileOffcanvasTwo from "@/components/offcanvas/mobile-offcanvas-2";

// props type
type IProps = {
  style_2?: boolean;
  container?: string;
};
export default function HeaderEight({style_2,container='1840'}: IProps) {
  const [openOffCanvas, setOpenOffcanvas] = React.useState(false);
  const isHomepage = useIsHomepage();
  return (
    <>
      <header>
        <div className={`tp-header-6-area tp-header-style-9 tp-transparent z-index-5 pt-40 ${style_2 ? "tp-header-black" : ""}`}>
          <div className={`container container-${container}`}>
            <div className="row">
              <div className="col-md-6 col-6">
                <div className="tp-header-logo">
                  <Link className={`${style_2?'portfolio-logo-1':''} logo-1`} href="/">
                    <Image src={isHomepage ? logoWhite : logoGreen} alt="logo" />
                  </Link>
                  <Link className={`${style_2?'portfolio-logo-2':''} logo-2`} href="/">
                    <Image src={isHomepage ? logoGreen : logoWhite} alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-md-6 col-6">
                <div className="tp-header-6-menu-box tp-offcanvas-open-btn d-flex align-items-center justify-content-end tp-header-bar">
                  <span>Menu</span>
                  <button onClick={() => setOpenOffcanvas(true)} className="tp-header-6-menubar">
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* off canvas */}
      <MobileOffcanvasTwo openOffcanvas={openOffCanvas} setOpenOffcanvas={setOpenOffcanvas} />
      {/* off canvas */}
    </>
  );
}
