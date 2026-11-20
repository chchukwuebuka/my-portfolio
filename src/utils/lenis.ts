import type Lenis from "lenis";

let activeLenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  activeLenis = instance;
}

export function getLenis(): Lenis | null {
  return activeLenis;
}

export function smoothScrollTo(target: string | number | HTMLElement) {
  if (activeLenis) {
    activeLenis.scrollTo(target, { offset: -76, duration: 1.05 });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }

  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
