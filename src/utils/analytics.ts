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
let lastTrackedProjectSlug: string | null = null;

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

function sendEvent(
  eventName: string,
  params: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  // Never send analytics events from private admin routes
  if (window.location.pathname.startsWith("/admin")) {
    return;
  }

  window.gtag("event", eventName, {
    send_to: GA_MEASUREMENT_ID,
    ...params,
  });
}

/**
 * Sends a deduplicated GA4 page_view event for public SPA navigation.
 * Skips /admin routes and strips query strings / personal data.
 */
export function trackPageView(pathname: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (cleanPath.startsWith("/admin")) {
    lastTrackedPath = cleanPath;
    return;
  }

  if (cleanPath === lastTrackedPath) {
    return;
  }

  lastTrackedPath = cleanPath;
  if (!cleanPath.startsWith("/work/")) {
    lastTrackedProjectSlug = null;
  }

  window.gtag("event", "page_view", {
    send_to: GA_MEASUREMENT_ID,
    page_path: cleanPath,
    page_location: `${window.location.origin}${cleanPath}`,
    page_title: resolvePageTitle(cleanPath),
  });
}

export function trackProjectView(
  projectName: string,
  projectCategory: string,
  projectSlug: string
): void {
  if (projectSlug === lastTrackedProjectSlug) return;
  lastTrackedProjectSlug = projectSlug;

  sendEvent("project_view", {
    project_name: projectName,
    project_category: projectCategory,
    project_slug: projectSlug,
  });
}

export function trackProjectClick(
  projectName: string,
  projectCategory: string,
  linkLocation: string
): void {
  sendEvent("project_click", {
    project_name: projectName,
    project_category: projectCategory,
    link_location: linkLocation,
  });
}

export function trackExternalProjectClick(
  projectName: string,
  projectCategory: string,
  linkUrl: string,
  linkLocation: string
): void {
  sendEvent("external_project_click", {
    project_name: projectName,
    project_category: projectCategory,
    link_url: linkUrl,
    link_location: linkLocation,
  });
}

export function trackFileDownload(
  fileName: string,
  linkLocation: string
): void {
  sendEvent("file_download", {
    file_name: fileName,
    file_extension: "pdf",
    link_location: linkLocation,
  });
}

export function trackLinkedInClick(
  linkLocation: string,
  linkUrl: string
): void {
  sendEvent("linkedin_click", {
    link_location: linkLocation,
    link_url: linkUrl,
  });
}

export function trackGitHubClick(
  linkLocation: string,
  linkUrl: string
): void {
  sendEvent("github_click", {
    link_location: linkLocation,
    link_url: linkUrl,
  });
}

export function trackContactClick(
  contactMethod: "email" | "email_copy" | "phone" | "twitter",
  linkLocation: string
): void {
  // Never pass email addresses, phone numbers, or personal data
  sendEvent("contact_click", {
    contact_method: contactMethod,
    link_location: linkLocation,
  });
}
