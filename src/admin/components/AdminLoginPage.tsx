import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Lock } from "lucide-react";
import Monogram from "../../components/Monogram";
import { AdminApiError, fetchSession } from "../api";
import { useNoIndex } from "../useNoIndex";
import styles from "./AdminLoginPage.module.css";

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized:
    "Access denied. The Google account you selected is not authorized to view this analytics dashboard.",
  unverified_email:
    "Access denied. Your Google account email address must be verified by Google.",
  invalid_state:
    "Sign-in verification expired or did not match. Please start a fresh Google sign-in.",
  oauth_denied: "Google sign-in was cancelled before completion.",
  oauth_failed:
    "Google authentication could not be completed. Please try signing in again.",
  token_missing:
    "Google did not return a valid identity token. Please try again.",
  invalid_token: "Identity verification failed. Please try signing in again.",
  config_missing:
    "Server-side OAuth environment variables are not configured yet. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, ADMIN_EMAIL, and SESSION_SECRET in Netlify.",
  session_expired: "Your session expired. Sign in again to continue.",
};

const GoogleGlyph = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
    />
    <path
      fill="#34A853"
      d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"
    />
    <path
      fill="#EA4335"
      d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
    />
  </svg>
);

export const AdminLoginPage = () => {
  useNoIndex("Sign In — Private Portfolio Analytics");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [oauthConfigured, setOauthConfigured] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const errorCode = searchParams.get("error");
  const returnTo = searchParams.get("returnTo");
  const errorMessage = errorCode
    ? ERROR_MESSAGES[errorCode] ??
      "Sign-in could not be completed. Please try again."
    : null;

  useEffect(() => {
    let active = true;
    fetchSession()
      .then((session) => {
        if (!active) return;
        if (session.authenticated) {
          navigate("/admin/analytics", { replace: true });
          return;
        }
        setOauthConfigured(session.oauthConfigured);
        setChecking(false);
      })
      .catch((err) => {
        if (!active) return;
        setServerError(
          err instanceof AdminApiError
            ? err.message
            : "Unable to reach the authentication service."
        );
        setChecking(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const oauthHref = returnTo
    ? `/.netlify/functions/auth-google?returnTo=${encodeURIComponent(returnTo)}`
    : "/.netlify/functions/auth-google";

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brandRow}>
          <div className={styles.brandLeft}>
            <Monogram size={28} />
            <span className={styles.brandTitle}>Portfolio Analytics</span>
          </div>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            Private
          </span>
        </div>

        <div className={styles.copy}>
          <h1 className={styles.heading}>Owner Sign-In</h1>
          <p className={styles.description}>
            Authenticate with your authorized Google account to access private
            GA4 traffic, realtime telemetry, and engagement reports.
          </p>
        </div>

        {errorMessage && (
          <div className={styles.alert} role="alert">
            <AlertCircle size={16} className={styles.alertIcon} aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {serverError && (
          <div className={styles.notice} role="status">
            {serverError}
          </div>
        )}

        {!checking && !oauthConfigured && !errorMessage && (
          <div className={styles.notice} role="status">
            Server OAuth credentials are not configured yet. Add{" "}
            <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>,{" "}
            <code>GOOGLE_REDIRECT_URI</code>, <code>ADMIN_EMAIL</code>, and{" "}
            <code>SESSION_SECRET</code> in Netlify to enable Google Sign-In.
          </div>
        )}

        {checking ? (
          <p className={styles.loadingNote}>Verifying session…</p>
        ) : (
          <a
            href={oauthHref}
            className={`${styles.googleBtn} ${
              !oauthConfigured ? styles.googleBtnDisabled : ""
            }`}
            aria-disabled={!oauthConfigured}
          >
            <GoogleGlyph />
            <span>Continue with Google</span>
          </a>
        )}

        <div className={styles.meta}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Lock size={12} aria-hidden="true" />
            <span>Server-verified OAuth 2.0</span>
          </span>
          <Link to="/" className={styles.backLink}>
            ← Public Portfolio
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AdminLoginPage;
