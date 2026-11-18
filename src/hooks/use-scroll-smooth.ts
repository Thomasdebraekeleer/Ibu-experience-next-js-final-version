"use client";
import { gsap } from "gsap";
import { ScrollSmoother, ScrollTrigger } from "@/plugins";
import useIsomorphicLayoutEffect from "./use-isomorphic-layout-effect";

/** Native scrolling on mobile; smooth scrolling on desktop without page reloads. */
export default function useScrollSmooth() {
  useIsomorphicLayoutEffect(() => {
    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");
    if (!wrapper || !content) return;

    const desktop = window.matchMedia("(min-width: 992px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let smoother: ReturnType<typeof ScrollSmoother.create> | undefined;
    let lastWidth = window.innerWidth;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    gsap.config({ nullTargetWarn: false });

    const syncSmoother = () => {
      // Explicitly filter mobile height-only resizes. ignoreMobileResize alone
      // depends on GSAP's initial viewport measurements and touch detection.
      ScrollTrigger.config({
        autoRefreshEvents: desktop.matches
          ? "visibilitychange,DOMContentLoaded,load,resize"
          : "visibilitychange,DOMContentLoaded,load",
      });
      const shouldSmooth = desktop.matches && !reducedMotion.matches;
      if (shouldSmooth === Boolean(smoother)) return;

      // Switching layout must not discard the reader's current position.
      const scrollY = smoother ? smoother.scrollTop() : window.scrollY;
      if (shouldSmooth) {
        smoother = ScrollSmoother.create({
          wrapper,
          content,
          smooth: 1.5,
          effects: true,
          smoothTouch: false,
          normalizeScroll: false,
          ignoreMobileResize: true,
        });
        smoother.scrollTop(scrollY);
      } else {
        smoother?.kill();
        smoother = undefined;
        window.scrollTo({ top: scrollY, behavior: "instant" });
      }
    };

    syncSmoother();
    // Media-query changes only: hiding the mobile address bar is not a layout
    // switch. ScrollTrigger still handles desktop resizes itself.
    desktop.addEventListener("change", syncSmoother);
    reducedMotion.addEventListener("change", syncSmoother);
    const onResize = () => {
      const widthChanged = window.innerWidth !== lastWidth;
      lastWidth = window.innerWidth;
      if (desktop.matches || !widthChanged) return;
      clearTimeout(resizeTimer);
      // Rotation and split-screen change layout width and still need a refresh.
      // refresh(true) uses GSAP's resize handler, which is disabled on mobile.
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      desktop.removeEventListener("change", syncSmoother);
      reducedMotion.removeEventListener("change", syncSmoother);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      smoother?.kill();
      ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize" });
    };
  }, []);
}
