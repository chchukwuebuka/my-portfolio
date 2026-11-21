import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

/**
 * Tracks initial load and client-side SPA route changes in GA4.
 * Ignores hash-only section jumps on the same route to prevent duplicates.
 */
export const AnalyticsTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
