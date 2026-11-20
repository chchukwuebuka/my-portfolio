import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, REDUCED_MOTION_QUERY } from "../utils/gsap";
import { getLenis, setLenis } from "../utils/lenis";

/**
 * Synchronizes Lenis smooth scrolling with GSAP's ticker and ScrollTrigger.
 * Automatically bypassed when the user prefers reduced motion.
 */
export const SmoothScroll = () => {
  useEffect(() => {
    if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (getLenis() === lenis) {
        setLenis(null);
      }
    };
  }, []);

  return null;
};

export default SmoothScroll;
