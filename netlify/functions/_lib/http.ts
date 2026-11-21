export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  path?: string;
  maxAge?: number;
  expires?: Date;
}

const BASE_SECURITY_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
};

export function isSecureRequest(req: Request): boolean {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }
  try {
    const parsed = new URL(req.url);
    if (parsed.protocol === "https:") return true;
    return parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1";
  } catch {
    return process.env.NODE_ENV === "production";
  }
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx <= 0) continue;
    const key = pair.slice(0, idx).trim();
    const rawVal = pair.slice(idx + 1).trim();
    if (!key) continue;
    try {
      result[key] = decodeURIComponent(rawVal);
    } catch {
      result[key] = rawVal;
    }
  }
  return result;
}

export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path ?? "/"}`);

  if (options.httpOnly !== false) {
    parts.push("HttpOnly");
  }
  if (options.secure) {
    parts.push("Secure");
  }
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }
  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  return parts.join("; ");
}

export function clearCookieHeader(name: string, secure: boolean): string {
  return serializeCookie(name, "", {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders?: HeadersInit,
  setCookies?: string[]
): Response {
  const headers = new Headers(BASE_SECURITY_HEADERS);
  headers.set("Content-Type", "application/json; charset=utf-8");

  if (extraHeaders) {
    const merged = new Headers(extraHeaders);
    merged.forEach((v, k) => headers.set(k, v));
  }

  if (setCookies) {
    for (const cookie of setCookies) {
      headers.append("Set-Cookie", cookie);
    }
  }

  return new Response(JSON.stringify(body), { status, headers });
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  setCookies?: string[]
): Response {
  return jsonResponse({ error: { code, message } }, status, undefined, setCookies);
}

export function redirectResponse(location: string, setCookies?: string[]): Response {
  const headers = new Headers(BASE_SECURITY_HEADERS);
  headers.set("Location", location);

  if (setCookies) {
    for (const cookie of setCookies) {
      headers.append("Set-Cookie", cookie);
    }
  }

  return new Response(null, { status: 302, headers });
}
