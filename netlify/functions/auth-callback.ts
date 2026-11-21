import { OAuth2Client } from "google-auth-library";
import { ConfigError, getOAuthConfig } from "./_lib/config.ts";
import {
  clearCookieHeader,
  errorResponse,
  isSecureRequest,
  redirectResponse,
} from "./_lib/http.ts";
import {
  OAUTH_STATE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  createSessionCookie,
  readOAuthStateCookie,
  safeTimingEqual,
} from "./_lib/session.ts";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET is supported.");
  }

  const secure = isSecureRequest(req);
  const clearStateCookie = clearCookieHeader(OAUTH_STATE_COOKIE_NAME, secure);
  const clearAllCookies = [
    clearStateCookie,
    clearCookieHeader(SESSION_COOKIE_NAME, secure),
  ];

  let oauth;
  try {
    oauth = getOAuthConfig(req.url);
  } catch (err) {
    if (err instanceof ConfigError) {
      return redirectResponse(
        "/admin/analytics/login?error=config_missing",
        clearAllCookies
      );
    }
    return redirectResponse(
      "/admin/analytics/login?error=oauth_error",
      clearAllCookies
    );
  }

  const url = new URL(req.url);
  const oauthError = url.searchParams.get("error");
  if (oauthError) {
    return redirectResponse(
      "/admin/analytics/login?error=oauth_denied",
      [clearStateCookie]
    );
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = await readOAuthStateCookie(req);

  if (!code || !state || !storedState || !safeTimingEqual(state, storedState.state)) {
    return redirectResponse(
      "/admin/analytics/login?error=invalid_state",
      clearAllCookies
    );
  }

  try {
    const client = new OAuth2Client({
      clientId: oauth.clientId,
      clientSecret: oauth.clientSecret,
      redirectUri: oauth.redirectUri,
    });

    const { tokens } = await client.getToken({
      code,
      codeVerifier: storedState.codeVerifier,
      redirect_uri: oauth.redirectUri,
    });

    if (!tokens.id_token) {
      return redirectResponse(
        "/admin/analytics/login?error=token_missing",
        clearAllCookies
      );
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: oauth.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return redirectResponse(
        "/admin/analytics/login?error=invalid_token",
        clearAllCookies
      );
    }

    // Verify OpenID nonce to guard against token replay
    if (!payload.nonce || !safeTimingEqual(payload.nonce, storedState.nonce)) {
      return redirectResponse(
        "/admin/analytics/login?error=invalid_state",
        clearAllCookies
      );
    }

    // Require Google-verified email address
    if (payload.email_verified !== true || !payload.email) {
      return redirectResponse(
        "/admin/analytics/login?error=unverified_email",
        clearAllCookies
      );
    }

    const normalizedEmail = payload.email.toLowerCase().trim();
    if (!safeTimingEqual(normalizedEmail, oauth.adminEmail)) {
      return redirectResponse(
        "/admin/analytics/login?error=unauthorized",
        clearAllCookies
      );
    }

    const { cookie: sessionCookie } = await createSessionCookie(
      {
        email: normalizedEmail,
        name: payload.name ?? "Portfolio Owner",
        picture: payload.picture,
      },
      secure
    );

    return redirectResponse(storedState.returnTo, [
      clearStateCookie,
      sessionCookie,
    ]);
  } catch {
    return redirectResponse(
      "/admin/analytics/login?error=oauth_failed",
      clearAllCookies
    );
  }
}
