
import React from 'react';
import Image from 'next/image';
import LineTextThree from '@/components/line-text/line-text-3';
import logo from '@/assets/img/logo/logo-white.png';
import { RightArrow } from '@/components/svg';
import Link from 'next/link';

export default function FooterThree() {
  return (
    <footer>

      <div className="tp-footer-4-area black-bg pt-70 pb-120">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              <LineTextThree />
            </div>
          </div>
        </div>
        <div className="container container-1480">
          <div className="tp-footer-4-top">
            <div className="row align-items-center">
              <div className="col-xl-6 col-lg-6 col-md-6">
                                 <div className="tp-footer-4-top-left">
                   <p>Have a question? <br /> Let&apos;s get in touch!</p>
                 </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="tp-footer-4-top-right text-start text-md-end">
                  <span className="tp-btn-white-lg" style={{cursor: 'default', opacity: 0.6}}>{"Let's"} Talk!</span>
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
                  <Link href="/">
                    <Image src={logo} alt="" />
                  </Link>
                </div>
                                 <div className="tp-footer-2-widget-text">
                   <p>L&apos;art de s&apos;évader <br /> dans les domaines d&apos;exception</p>
                 </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-6 mb-50">
              <div className="tp-footer-2-widget footer-col-2-2">
                <div className="tp-footer-2-widget-menu">
                  <h4 className="tp-footer-2-widget-title">Sitemap</h4>
                                                       <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/experiences">Experiences</Link></li>
                    <li><Link href="/reservations">Reservation</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/become-partner">Become a Partner</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/faq">FAQ</Link></li>
                    <li><Link href="/blog">Blog</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-5 col-md-6 mb-50">
                             <div className="tp-footer-2-widget footer-col-2-3">
                 <h4 className="tp-footer-2-widget-title">Infos</h4>
                 <div className="tp-footer-2-contact-item">
                   <span>Rue de la brasserie 1-3, boîte 1<br />1050 Ixelles<br />Belgique</span>
                 </div>
                 <div className="tp-footer-2-contact-item">
                   <span><a href="mailto:info@ibu-experience.be">E: info@ibu-experience.be</a></span>
                 </div>
               </div>
            </div>
            <div className="col-xl-4 col-lg-5 col-md-6 mb-50">
              <div className="tp-footer-2-widget footer-col-2-4">
                <div className="tp-footer-2-widget-newslatter">
                  <h4 className="tp-footer-2-widget-title">Subscribe to our newsletter</h4>
                  <form action="#">
                    <div className="tp-footer-2-input p-relative">
                      <input type="text" placeholder="Enter your email..." />
                      <button>
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
                 <p>All rights reserved — {new Date().getFullYear()} © <a href="https://www.nrv.brussels/" target="_blank" rel="noopener noreferrer">NRV Agency</a></p>
               </div>
            </div>
            <div className="col-xl-8 col-lg-7">
              <div className="tp-copyright-2-social text-center text-lg-end">
                <a className="mb-10" href="https://www.linkedin.com/company/ib%C3%B9-experience/?viewAsMember=true" target="_blank" rel="noopener noreferrer">Linkedin</a>
                <a className="mb-10" href="https://www.facebook.com/people/IB%C3%99-Experience/61571861925403/#" target="_blank" rel="noopener noreferrer">Facebook</a>
                <a className="mb-10" href="https://www.instagram.com/ibu_experience/" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
