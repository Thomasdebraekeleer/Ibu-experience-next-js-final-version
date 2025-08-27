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
import ServiceOne from "@/components/service/service-one";
import TeamOne from "@/components/team/team-one";

// animation
import { hoverBtn } from "@/utils/hover-btn";
import { footerTwoAnimation } from "@/utils/footer-anim";
import { bounceAnimation, charAnimation, fadeAnimation } from "@/utils/title-animation";

const BecomePartnerMain = () => {
  useScrollSmooth();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    experienceType: '',
    description: '',
    location: '',
    capacity: '',
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
    // Ici vous pouvez ajouter la logique pour envoyer la candidature
    console.log('Candidature partenaire soumise:', formData);
    alert('Votre candidature a été soumise avec succès ! Nous vous contacterons bientôt.');
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
                        Devenez <span className="text-gradient">Partenaire</span>
                      </h1>
                      <p className="tp-hero-text">
                        Rejoignez notre réseau de partenaires et proposez des expériences uniques à nos clients
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* hero section end */}

            {/* benefits section start */}
            <section className="tp-benefits-area pb-150">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div className="tp-section-title text-center mb-80">
                      <h2>Pourquoi devenir partenaire ?</h2>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="tp-benefit-item text-center">
                      <div className="tp-benefit-icon mb-30">
                        <i className="fas fa-users"></i>
                      </div>
                      <h4>Réseau étendu</h4>
                      <p>Accédez à notre communauté de voyageurs passionnés et augmentez votre visibilité</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="tp-benefit-item text-center">
                      <div className="tp-benefit-icon mb-30">
                        <i className="fas fa-chart-line"></i>
                      </div>
                      <h4>Croissance des revenus</h4>
                      <p>Développez votre activité grâce à nos réservations et notre marketing</p>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="tp-benefit-item text-center">
                      <div className="tp-benefit-icon mb-30">
                        <i className="fas fa-tools"></i>
                      </div>
                      <h4>Support technique</h4>
                      <p>Bénéficiez de notre expertise et de nos outils pour optimiser vos expériences</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* benefits section end */}

            {/* partner form section start */}
            <section className="tp-partner-form-area pb-150">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-8 col-lg-10">
                    <div className="tp-partner-form-wrapper">
                      <div className="tp-section-title text-center mb-50">
                        <h3>Postulez pour devenir partenaire</h3>
                        <p>Remplissez le formulaire ci-dessous et nous vous contacterons dans les plus brefs délais</p>
                      </div>
                      <form onSubmit={handleSubmit} className="tp-partner-form">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Nom de votre entreprise"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="text"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleInputChange}
                                placeholder="Nom du contact principal"
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
                                placeholder="Email professionnel"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Téléphone"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="Site web (optionnel)"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <select
                                name="experienceType"
                                value={formData.experienceType}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Type d'expérience proposée</option>
                                <option value="aventure">Aventure</option>
                                <option value="culturelle">Culturelle</option>
                                <option value="gastronomique">Gastronomique</option>
                                <option value="nature">Nature</option>
                                <option value="urbaine">Urbaine</option>
                                <option value="autre">Autre</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Localisation"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="tp-form-input">
                              <input
                                type="text"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                placeholder="Capacité d'accueil"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="tp-form-input">
                              <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Description de vos expériences"
                                rows={4}
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="tp-form-input">
                              <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Message additionnel"
                                rows={3}
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="tp-form-submit text-center">
                              <button type="submit" className="tp-btn">
                                Soumettre ma candidature
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
            {/* partner form section end */}

            {/* team area start */}
            <TeamOne />
            {/* team area end */}

          </main>
        </div>
      </div>

      {/* footer area start */}
      <FooterOne />
      {/* footer area end */}
    </Wrapper>
  );
};

export default BecomePartnerMain;
