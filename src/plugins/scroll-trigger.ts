import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// One instance for every page, including ScrollSmoother and lazy-loaded sections.
// A phone's address bar changes viewport height while scrolling. Recalculating
// all triggers then temporarily scrolls to zero and can interrupt native scroll.
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { ScrollTrigger };
