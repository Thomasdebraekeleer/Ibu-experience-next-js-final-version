/**
 * Animations de titres et textes - Version optimisée et fiabilisée
 * IMPORTANT: Ces fonctions utilisent document.querySelector pour la compatibilité avec le code existant
 * Pour de nouvelles fonctionnalités, préférez les hooks (useRevealOnScroll, useSplitTextReveal, etc.)
 */

import { gsap, Power2 } from "gsap";
import { SplitText } from "@/plugins";
import { 
  isMobileDevice, 
  prefersReducedMotion, 
  simpleFadeIn,
  animateCharacters as animChars,
  animateTitleLines as animLines,
  fadeAnimation as fadeAnim,
} from "./animation-helpers";

/**
 * Animation du hero title (type 2)
 * OPTIMISATION: Vérifications de sécurité et gestion mobile
 */
function heroTitleAnim() {
  const heroArea = document.querySelector(".tp-hero-2-area");
  if (!heroArea) return;

  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();

  // Sur mobile ou reduced motion, animation simplifiée
  if (isMobile || reducedMotion) {
    const elements = heroArea.querySelectorAll(".tp-hero-2-title, .tp-hero-2-content");
    elements.forEach(el => {
      gsap.set(el, { opacity: 1, x: 0 });
    });
    return;
  }

  const title1 = heroArea.querySelector(".tp-hero-2-title.text-1");
  const title2 = heroArea.querySelector(".tp-hero-2-title.text-2");
  const content = heroArea.querySelector(".tp-hero-2-content");

  if (title1) {
    gsap.fromTo(
      title1,
      { x: 300, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroArea,
          start: "top center",
          markers: false,
        },
      }
    );
  }

  if (title2) {
    gsap.fromTo(
      title2,
      { x: -300, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroArea,
          start: "top center",
          markers: false,
        },
      }
    );
  }

  if (content) {
    gsap.fromTo(
      content,
      { x: -500, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroArea,
          start: "top center",
          markers: false,
        },
      }
    );
  }
}

/**
 * Animation du background du hero
 * OPTIMISATION: Ajout de fallback et gestion des erreurs
 */
function heroBgAnimation() {
  const heroBg = document.querySelector(".tp-hero-bg-single");
  if (!heroBg) return;

  const reducedMotion = prefersReducedMotion();
  if (reducedMotion) {
    gsap.set(heroBg, { scale: 1 });
    return;
  }

  gsap.from(heroBg, {
    scale: 1.3,
    duration: 1.5,
    ease: 'power2.out',
  });
}

/**
 * Animation de boutons avec effet bounce
 * OPTIMISATION: Suppression de jQuery, simplification
 */
function bounceAnimation() {
  const bounce = document.querySelectorAll(".tp-btn-bounce");
  if (bounce.length === 0) return;

  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();

  bounce.forEach((btn) => {
    // Toujours visible par défaut
    gsap.set(btn, { opacity: 1, y: 0 });

    // Pas d'animation bounce sur mobile ou reduced motion
    if (isMobile || reducedMotion) return;

    // Trouver le trigger parent
    const trigger = (btn as HTMLElement).closest(".tp-btn-trigger") || btn;

    gsap.fromTo(
      btn,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "bounce.out",
        scrollTrigger: {
          trigger,
          start: "top center",
          markers: false,
          once: true,
        },
      }
    );
  });
}

/**
 * Animation de caractères avec SplitText
 * OPTIMISATION: Utilise le helper animateCharacters avec fallback
 */
function charAnimation() {
  const elements = document.querySelectorAll(".tp-char-animation");
  if (elements.length === 0) return;

  elements.forEach((element) => {
    try {
      animChars(element as HTMLElement, {
        scrollTrigger: true,
        stagger: 0.05,
        duration: 1,
        delay: 0.5,
        y: 100,
      });
    } catch (error) {
      console.warn('Char animation failed for element, using fallback:', error);
      simpleFadeIn(element as HTMLElement, 1);
    }
  });
}

/**
 * Animations de fade dans différentes directions
 * OPTIMISATION: Suppression de jQuery, utilisation des helpers, ajout de fallbacks CSS
 */
function fadeAnimation() {
  // Fade from bottom
  const fadeBottom = document.querySelectorAll(".tp_fade_bottom");
  if (fadeBottom.length > 0) {
    fadeAnim(fadeBottom, {
      direction: 'bottom',
      distance: 100,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: true,
      startOffset: 'top center+=400',
    });
  }

  // Fade from top
  const fadeTop = document.querySelectorAll(".tp_fade_top");
  if (fadeTop.length > 0) {
    fadeAnim(fadeTop, {
      direction: 'top',
      distance: 100,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: true,
      startOffset: 'top center+=100',
    });
  }

  // Fade from left
  const fadeLeft = document.querySelectorAll(".tp_fade_left");
  if (fadeLeft.length > 0) {
    fadeAnim(fadeLeft, {
      direction: 'left',
      distance: 100,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: true,
      startOffset: 'top center+=100',
    });
  }

  // Fade from right
  const fadeRight = document.querySelectorAll(".tp_fade_right");
  if (fadeRight.length > 0) {
    fadeAnim(fadeRight, {
      direction: 'right',
      distance: 100,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: true,
      startOffset: 'top center+=100',
    });
  }

  // Fade avec attributs data personnalisables
  const fadeAnimElements = document.querySelectorAll(".tp_fade_anim");
  if (fadeAnimElements.length > 0) {
    fadeAnimElements.forEach((element) => {
      const el = element as HTMLElement;
      
      // Lecture des attributs data
      const direction = el.getAttribute("data-fade-from") || "bottom";
      const distance = parseInt(el.getAttribute("data-fade-offset") || "50");
      const duration = parseFloat(el.getAttribute("data-duration") || "1");
      const delay = parseFloat(el.getAttribute("data-delay") || "0.5");
      const ease = el.getAttribute("data-ease") || "power2.out";
      const onScroll = el.getAttribute("data-on-scroll") !== "0";

      // Configuration de l'animation
      const fromVars: gsap.TweenVars = {
        opacity: 0,
        duration,
        delay: onScroll ? 0 : delay,
        ease,
      };

      // Ajouter direction
      switch (direction) {
        case 'top':
          fromVars.y = -distance;
          break;
        case 'bottom':
          fromVars.y = distance;
          break;
        case 'left':
          fromVars.x = -distance;
          break;
        case 'right':
          fromVars.x = distance;
          break;
        case 'in':
          // Seulement opacity
          break;
      }

      // Ajouter ScrollTrigger si nécessaire
      if (onScroll) {
        fromVars.scrollTrigger = {
          trigger: el,
          start: "top 110%",
          markers: false,
        };
      }

      gsap.from(el, fromVars);
    });
  }
}

/**
 * Animation de révélation type 1
 * OPTIMISATION: Ajout de fallback et gestion mobile
 */
function revelAnimationOne() {
  const elements = document.querySelectorAll(".tp_reveal_anim");
  if (elements.length === 0) return;

  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();

  elements.forEach((element) => {
    const el = element as HTMLElement;

    // Lecture des attributs data
    const duration = parseFloat(el.getAttribute("data-duration") || "1.5");
    const onScroll = el.getAttribute("data-on-scroll") !== "0";
    const stagger = parseFloat(el.getAttribute("data-stagger") || "0.02");
    const delay = parseFloat(el.getAttribute("data-delay") || "0.05");

    // Fallback pour mobile/reduced motion
    if (isMobile || reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    // Animation avec SplitText
    try {
      const split = new SplitText(el, {
        type: "lines,words,chars",
        linesClass: "tp-reveal-line",
      });

      const animVars: gsap.TweenVars = {
        duration,
        delay,
        ease: "circ.out",
        y: 200,
        stagger,
        opacity: 0,
      };

      if (onScroll) {
        animVars.scrollTrigger = {
          trigger: el,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play reverse play reverse",
          markers: false,
        };
      }

      gsap.from(split.chars, animVars);
    } catch (error) {
      console.warn('Reveal animation failed, using fallback:', error);
      simpleFadeIn(el, duration);
    }
  });
}

/**
 * Animation de révélation type 2
 * OPTIMISATION: Version simplifiée avec fallback
 */
function revelAnimationTwo() {
  const elements = document.querySelectorAll(".tp_reveal_anim-2");
  if (elements.length === 0) return;

  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();

  elements.forEach((element) => {
    const el = element as HTMLElement;

    // Lecture des attributs data
    const duration = parseFloat(el.getAttribute("data-duration") || "2");
    const onScroll = el.getAttribute("data-on-scroll") !== "0";
    const stagger = parseFloat(el.getAttribute("data-stagger") || "0.05");
    const delay = parseFloat(el.getAttribute("data-delay") || "0.1");

    // Fallback pour mobile/reduced motion
    if (isMobile || reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    // Animation avec SplitText
    try {
      const split = new SplitText(el, {
        type: "lines,words,chars",
        linesClass: "tp-reveal-line-2",
      });

      const animVars: gsap.TweenVars = {
        duration,
        delay,
        ease: "circ.out",
        y: 200,
        stagger,
        opacity: 0,
      };

      if (onScroll) {
        animVars.scrollTrigger = {
          trigger: el,
          start: "top 85%",
          markers: false,
          toggleActions: "play none none none",
        };
      }

      gsap.from(split.chars, animVars);
    } catch (error) {
      console.warn('Reveal animation 2 failed, using fallback:', error);
      simpleFadeIn(el, duration);
    }
  });
}

/**
 * Animation de zoom
 * OPTIMISATION: Suppression de jQuery, amélioration performance
 */
function zoomAnimation() {
  const zoomElements = document.querySelectorAll(".anim-zoomin");
  if (zoomElements.length === 0) return;

  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();

  zoomElements.forEach((element) => {
    const el = element as HTMLElement;

    // Créer le wrapper si nécessaire
    if (!el.parentElement?.classList.contains("anim-zoomin-wrap")) {
      const wrapper = document.createElement("div");
      wrapper.className = "anim-zoomin-wrap";
      wrapper.style.overflow = "hidden";
      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }

    const wrapper = el.parentElement as HTMLElement;

    // Fallback pour mobile/reduced motion
    if (isMobile || reducedMotion) {
      gsap.set(el, { opacity: 1, scale: 1 });
      return;
    }

    // Animation zoom
    gsap.from(el, {
      duration: 1.5,
      opacity: 0,
      scale: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: wrapper,
        start: "top 90%",
        markers: false,
        once: true,
      },
    });
  });
}

/**
 * Animation de titres par lignes
 * OPTIMISATION: Utilise animateTitleLines avec fallback
 */
function titleAnimation() {
  const elements = document.querySelectorAll('.tp_title_anim');
  if (elements.length === 0) return;

  elements.forEach((element) => {
    try {
      animLines(element as HTMLElement, {
        scrollTrigger: true,
        stagger: 0.1,
        duration: 1,
        delay: 0.3,
      });
    } catch (error) {
      console.warn('Title animation failed, using fallback:', error);
      simpleFadeIn(element as HTMLElement, 1);
    }
  });
}

export {
  heroTitleAnim,
  heroBgAnimation,
  bounceAnimation,
  fadeAnimation,
  charAnimation,
  revelAnimationTwo,
  revelAnimationOne,
  zoomAnimation,
  titleAnimation,
};
