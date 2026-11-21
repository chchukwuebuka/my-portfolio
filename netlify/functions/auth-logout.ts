import {
  clearCookieHeader,
  errorResponse,
  isSecureRequest,
  jsonResponse,
} from "./_lib/http.ts";
import {
  OAUTH_STATE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  requireAdminSession,
  verifyCsrfRequest,
} from "./_lib/session.ts";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only POST is supported.");
  }

  const secure = isSecureRequest(req);
  const clearCookies = [
    clearCookieHeader(SESSION_COOKIE_NAME, secure),
    clearCookieHeader(OAUTH_STATE_COOKIE_NAME, secure),
  ];

  // If a valid session exists, require CSRF token + same-origin verification
  const auth = await requireAdminSession(req);
  if (auth.ok && !verifyCsrfRequest(req, auth.session)) {
    return errorResponse(403, "INVALID_CSRF", "Invalid CSRF token.");
  }

  return jsonResponse({ ok: true }, 200, undefined, clearCookies);
}
