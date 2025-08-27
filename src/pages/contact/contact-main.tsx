'use client';
import { gsap } from "gsap";
import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import useScrollSmooth from '@/hooks/use-scroll-smooth';
import { ScrollSmoother, ScrollTrigger, SplitText, cursorAnimation } from '@/plugins';
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText);

// internal imports
import Wrapper from "@/layouts/wrapper";
import HeaderVBU from "@/layouts/headers/header-vbu";
import FooterOne from "@/layouts/footers/footer-one";

// animation
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { bounceAnimation, charAnimation, fadeAnimation } from "@/utils/title-animation";

const ContactMain = () => {
  useScrollSmooth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    document.body.classList.add("tp-magic-cursor");
    return () => {
      document.body.classList.remove("tp-magic-cursor");
    }
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined' && document.querySelector('.tp-magic-cursor')) {
      cursorAnimation();
    }
  },[]);

  useGSAP(() => {
    const timer = setTimeout(() => {
      hoverBtn();
      footerTwoAnimation();
      fadeAnimation();
      charAnimation();
      bounceAnimation();
    }, 100)
    return () => clearTimeout(timer);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique pour envoyer le message
    console.log('Message de contact soumis:', formData);
    alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
  };

  return (
    <Wrapper showBackToTop={false}>
      {/* magic cursor start */}
      <div id="magic-cursor">
        <div id="ball"></div>
      </div>
      {/* magic cursor end */}

      {/* header area start */}
      <HeaderVBU />
      {/* header area end */}

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            
            {/* hero section start */}
            <section className="tp-hero-area pt-150 pb-150">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="tp-hero-content text-center">
                      <h1 className="tp-hero-title">
                        Contactez <span className="text-gradient">VBU Experience</span>
                      </h1>
                      <p className="tp-hero-text">
                        Nous sommes là pour vous aider à planifier votre prochaine aventure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* hero section end */}

            {/* contact info section start */}
            <section className="tp-contact-info-area pb-100">
              <div className="container">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="tp-contact-info-item text-center">
                      <div className="tp-contact-icon mb-30">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <h4>Notre Adresse</h4>
                      <p>123 Rue de l'Aventure<br />75001 Paris, France</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="tp-contact-info-item text-center">
                      <div className="tp-contact-icon mb-30">
                        <i className="fas fa-phone"></i>
                      </div>
                      <h4>Téléphone</h4>
                      <p>+33 1 23 45 67 89<br />+33 1 98 76 54 32</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="tp-contact-info-item text-center">
                      <div className="tp-contact-icon mb-30">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <h4>Email</h4>
                      <p>info@vbuexperience.com<br />reservations@vbuexperience.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* contact info section end */}

            {/* contact form section start */}
            <section className="tp-contact-form-area pb-150">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-8 col-lg-10">
                    <div className="tp-contact-form-wrapper">
                      <div className="tp-section-title text-center mb-50">
                        <h3>Envoyez-nous un message</h3>
                        <p>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais</p>
                      </div>
                      <form onSubmit={handleSubmit} className="tp-contact-form">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Votre nom complet"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Votre email"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="tp-form-input">
                              <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="Sujet de votre message"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="tp-form-input">
                              <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Votre message"
                                rows={6}
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="tp-form-submit text-center">
                              <button type="submit" className="tp-btn">
                                Envoyer le message
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* contact form section end */}

            {/* map section start */}
            <section className="tp-map-area pb-150">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="tp-map-wrapper">
                      <div className="tp-section-title text-center mb-50">
                        <h3>Notre Localisation</h3>
                      </div>
                      <div className="tp-map">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3522219!3d48.856614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDUxJzIzLjgiTiAywrAyMScwOC4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
                          width="100%"
                          height="450"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* map section end */}

          </main>
        </div>
      </div>

      {/* footer area start */}
      <FooterOne />
      {/* footer area end */}
    </Wrapper>
  );
};

export default ContactMain;
