import { getProjectBySlug, portfolioData } from "../data/portfolio";

export const GA_MEASUREMENT_ID = "G-JM1XMDSCT0";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __ga4Initialized?: boolean;
  }
}

let lastTrackedPath: string | null = null;

function resolvePageTitle(pathname: string): string {
  const { fullName, role } = portfolioData.profile;

  if (pathname === "/" || pathname === "") {
    return `${fullName} | ${role}`;
  }

  if (pathname === "/myworks") {
    return `Project Archive — ${fullName}`;
  }

  if (pathname.startsWith("/work/")) {
    const slug = pathname.slice("/work/".length).replace(/\/+$/, "");
    const project = getProjectBySlug(slug);
    if (project) {
      return `${project.title} — ${fullName}`;
    }
  }

  return document.title || `${fullName} | ${role}`;
}

/**
 * Sends a deduplicated GA4 page_view event for SPA navigation.
 * Uses only clean pathname (no query strings or personal data).
 */
export function trackPageView(pathname: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  // Prevent duplicate page_view events (e.g. React StrictMode double-invoke or hash jumps)
  if (cleanPath === lastTrackedPath) {
    return;
  }

  lastTrackedPath = cleanPath;

  window.gtag("event", "page_view", {
    send_to: GA_MEASUREMENT_ID,
    page_path: cleanPath,
    page_location: `${window.location.origin}${cleanPath}`,
    page_title: resolvePageTitle(cleanPath),
  });
}
