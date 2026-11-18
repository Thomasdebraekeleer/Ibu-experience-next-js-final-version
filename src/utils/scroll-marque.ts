import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins/scroll-trigger";
import $ from "jquery";

gsap.registerPlugin(ScrollTrigger);

function teamMarqueAnim() {
  const teamItem = document.querySelector(".tp-team-item");
  if (teamItem) {
    gsap.set(".tp-team-item.marque", {
      x: "25%",
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".tp-team-area ",
          start: "-1000 10%",
          end: "bottom 20%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .to(".tp-team-item.marque ", {
        x: "-100%",
      });
  }
}

function serviceMarqueAnim() {
  const serviceItem = document.querySelector(".tp-service-4-item");
  if (serviceItem) {
    gsap.set(".tp-team-item", {
      x: "25%",
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".tp-service-4-area",
          start: "-1000 10%",
          end: "1000 30%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      .to(".tp-service-4-item ", {
        x: "-200%",
      });
  }
};

// home 5 hero 
function heroScrollTextAnim() {
  let ht = gsap.matchMedia();
  ht.add("(min-width: 576px)", () => {

    /* portfolio animation start */
    if ($('.tp-hero-5-area').length > 0) {

      gsap.timeline({
        scrollTrigger: {
          trigger: '.tp-hero-5-area ',
          start: 'top 30%',
          end: 'bottom 20%',
          scrub: true,
          invalidateOnRefresh: true
        }
      })
        .to('.tp-hero-5-title ', {
          x: '-25%'
        });
      gsap.set('.tp-hero-5-title', {
        x: '18%'
      });

    }

  });
};


function movingImageSlider() {
  let mv = gsap.matchMedia();
  mv.add("(min-width: 768px)", () => {
    // Moving Gallery		
    gsap.utils.toArray('.moving-gallery').forEach((section: any, index: number) => {
      const w = section.querySelector('.wrapper-gallery');
      if (!w) return;

      const isEvasion = section.classList.contains('evasion-scroll-gallery');
      let x: number;
      let xEnd: number;

      if (isEvasion) {
        const overflow = Math.max(0, w.scrollWidth - section.offsetWidth);
        const drift = overflow * 0.4;
        if (index % 2 === 0) {
          x = 0;
          xEnd = -drift;
        } else {
          x = -drift;
          xEnd = 0;
        }
      } else {
        [x, xEnd] =
          index % 2
            ? [section.offsetWidth - w.scrollWidth, 0]
            : [0, section.offsetWidth - w.scrollWidth];
      }

      gsap.fromTo(
        w,
        { x },
        {
          x: xEnd,
          scrollTrigger: {
            trigger: section,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  });
}

/** Révélation douce des portraits Évasion (accueil, PC). */
function evasionGalleryRevealAnim() {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    const bleed = document.querySelector(".evasion-scroll-bleed");
    if (!bleed) return;

    const rows = bleed.querySelectorAll<HTMLElement>(".evasion-scroll-row");
    rows.forEach((row) => {
      const imgs = row.querySelectorAll(".evasion-portrait-img");
      if (imgs.length === 0) return;

      gsap.fromTo(
        imgs,
        {
          opacity: 0.2,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          ease: "power1.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: row,
            start: "top 94%",
            end: "top 58%",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(".evasion-scroll-bleed .evasion-portrait-img", { clearProps: "all", opacity: 1, y: 0 });
  });
}

export {
  teamMarqueAnim,
  serviceMarqueAnim,
  heroScrollTextAnim,
  movingImageSlider,
  evasionGalleryRevealAnim,
};
