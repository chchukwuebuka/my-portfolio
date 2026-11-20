import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../utils/gsap";
import { getLenis, smoothScrollTo } from "../utils/lenis";

export const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const scrollToTarget = () => {
        const element = document.getElementById(id);
        if (element) {
          smoothScrollTo(element);
          return true;
        }
        return false;
      };

      if (!scrollToTarget()) {
        const timer = window.setTimeout(() => {
          scrollToTarget();
          ScrollTrigger.refresh();
        }, 100);
        return () => window.clearTimeout(timer);
      }

      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 220);
      return () => window.clearTimeout(refreshTimer);
    }

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
    return () => window.clearTimeout(refreshTimer);
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
