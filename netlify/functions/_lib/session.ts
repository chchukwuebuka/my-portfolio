import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { ConfigError, getAdminEmail, getSessionSecret } from "./config.ts";
import {
  clearCookieHeader,
  errorResponse,
  isSecureRequest,
  parseCookies,
  serializeCookie,
} from "./http.ts";

export const SESSION_COOKIE_NAME = "pa_admin_session";
export const OAUTH_STATE_COOKIE_NAME = "pa_oauth_state";

const JWT_ISSUER = "chukwuebuka-portfolio-admin";
const SESSION_AUDIENCE = "admin-session";
const OAUTH_STATE_AUDIENCE = "oauth-state";

export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
export const OAUTH_STATE_TTL_SECONDS = 60 * 10; // 10 minutes

export interface AdminSession {
  email: string;
  name: string;
  picture?: string;
  csrfToken: string;
  expiresAt: number;
}

export interface OAuthStatePayload {
  state: string;
  nonce: string;
  codeVerifier: string;
  returnTo: string;
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

export function safeTimingEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function generateRandomToken(byteLength = 32): string {
  return randomBytes(byteLength).toString("base64url");
}

export function generatePkcePair(): {
  codeVerifier: string;
  codeChallenge: string;
} {
  const codeVerifier = randomBytes(48).toString("base64url");
  const codeChallenge = createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");
  return { codeVerifier, codeChallenge };
}

export function sanitizeReturnTo(raw: string | null): string {
  if (!raw || !raw.startsWith("/admin/analytics")) {
    return "/admin/analytics";
  }
  if (raw.startsWith("//") || raw.includes("://")) {
    return "/admin/analytics";
  }
  return raw;
}

export async function createOAuthStateCookie(
  payload: OAuthStatePayload,
  secure: boolean
): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(OAUTH_STATE_AUDIENCE)
    .setExpirationTime(`${OAUTH_STATE_TTL_SECONDS}s`)
    .sign(getSecretKey());

  return serializeCookie(OAUTH_STATE_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: OAUTH_STATE_TTL_SECONDS,
  });
}

export async function readOAuthStateCookie(
  req: Request
): Promise<OAuthStatePayload | null> {
  const cookies = parseCookies(req.headers.get("cookie"));
  const raw = cookies[OAUTH_STATE_COOKIE_NAME];
  if (!raw) return null;

  try {
    const { payload } = await jwtVerify(raw, getSecretKey(), {
      issuer: JWT_ISSUER,
      audience: OAUTH_STATE_AUDIENCE,
      algorithms: ["HS256"],
    });

    if (
      typeof payload.state !== "string" ||
      typeof payload.nonce !== "string" ||
      typeof payload.codeVerifier !== "string" ||
      typeof payload.returnTo !== "string"
    ) {
      return null;
    }

    return {
      state: payload.state,
      nonce: payload.nonce,
      codeVerifier: payload.codeVerifier,
      returnTo: sanitizeReturnTo(payload.returnTo),
    };
  } catch {
    return null;
  }
}

export async function createSessionCookie(
  user: { email: string; name: string; picture?: string },
  secure: boolean
): Promise<{ cookie: string; session: AdminSession }> {
  const csrfToken = generateRandomToken(24);
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;

  const jwt = await new SignJWT({
    email: user.email.toLowerCase(),
    name: user.name,
    picture: user.picture ?? "",
    csrfToken,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.email.toLowerCase())
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());

  const cookie = serializeCookie(SESSION_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return {
    cookie,
    session: {
      email: user.email.toLowerCase(),
      name: user.name,
      picture: user.picture,
      csrfToken,
      expiresAt,
    },
  };
}

export type SessionCheckResult =
  | { ok: true; session: AdminSession }
  | { ok: false; response: Response };

/**
 * Verifies the HttpOnly signed session cookie AND re-verifies ADMIN_EMAIL server-side.
 * Every private analytics endpoint must call this before executing any query.
 */
export async function requireAdminSession(
  req: Request
): Promise<SessionCheckResult> {
  const secure = isSecureRequest(req);

  let expectedAdminEmail: string;
  let secretKey: Uint8Array;
  try {
    expectedAdminEmail = getAdminEmail();
    secretKey = getSecretKey();
  } catch (err) {
    if (err instanceof ConfigError) {
      return {
        ok: false,
        response: errorResponse(
          503,
          "SERVER_NOT_CONFIGURED",
          "Authentication service is not fully configured on the server."
        ),
      };
    }
    return {
      ok: false,
      response: errorResponse(500, "AUTH_ERROR", "Authentication check failed."),
    };
  }

  const cookies = parseCookies(req.headers.get("cookie"));
  const raw = cookies[SESSION_COOKIE_NAME];
  if (!raw) {
    return {
      ok: false,
      response: errorResponse(401, "UNAUTHENTICATED", "Authentication required."),
    };
  }

  try {
    const { payload } = await jwtVerify(raw, secretKey, {
      issuer: JWT_ISSUER,
      audience: SESSION_AUDIENCE,
      algorithms: ["HS256"],
    });

    if (
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.csrfToken !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return {
        ok: false,
        response: errorResponse(
          401,
          "INVALID_SESSION",
          "Session token is invalid.",
          [clearCookieHeader(SESSION_COOKIE_NAME, secure)]
        ),
      };
    }

    const sessionEmail = payload.email.toLowerCase().trim();
    if (!safeTimingEqual(sessionEmail, expectedAdminEmail)) {
      return {
        ok: false,
        response: errorResponse(
          403,
          "FORBIDDEN",
          "This account is not authorized to access analytics.",
          [clearCookieHeader(SESSION_COOKIE_NAME, secure)]
        ),
      };
    }

    return {
      ok: true,
      session: {
        email: sessionEmail,
        name: payload.name,
        picture: typeof payload.picture === "string" && payload.picture ? payload.picture : undefined,
        csrfToken: payload.csrfToken,
        expiresAt: payload.exp * 1000,
      },
    };
  } catch {
    return {
      ok: false,
      response: errorResponse(
        401,
        "SESSION_EXPIRED",
        "Your session has expired. Please sign in again.",
        [clearCookieHeader(SESSION_COOKIE_NAME, secure)]
      ),
    };
  }
}

export function verifyCsrfRequest(req: Request, session: AdminSession): boolean {
  const csrfHeader = req.headers.get("x-csrf-token") ?? "";
  if (!csrfHeader || !safeTimingEqual(csrfHeader, session.csrfToken)) {
    return false;
  }

  // Verify same-origin on state-changing requests when Origin header is present
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const reqOrigin = new URL(req.url).origin;
      if (origin !== reqOrigin) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}
