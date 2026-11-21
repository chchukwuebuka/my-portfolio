import type {
  AudienceResponse,
  DateRangeQuery,
  EventsResponse,
  OverviewResponse,
  PagesResponse,
  RealtimeResponse,
  SessionResponse,
  TrafficResponse,
} from "./types";

export class AdminApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
  }
}

const clientCache = new Map<string, { value: unknown; expiresAt: number }>();

export function clearClientAnalyticsCache(): void {
  clientCache.clear();
}

function buildRangeParams(range: DateRangeQuery, refresh?: boolean): string {
  const params = new URLSearchParams();
  params.set("range", range.preset);
  if (range.preset === "custom" && range.startDate && range.endDate) {
    params.set("startDate", range.startDate);
    params.set("endDate", range.endDate);
  }
  if (refresh) {
    params.set("refresh", "1");
  }
  return params.toString();
}

async function requestJson<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST";
    headers?: Record<string, string>;
    cacheKey?: string;
    cacheTtlMs?: number;
    bypassCache?: boolean;
  } = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    cacheKey,
    cacheTtlMs = 0,
    bypassCache = false,
  } = options;

  if (method === "GET" && cacheKey && !bypassCache && cacheTtlMs > 0) {
    const cached = clientCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }
  }

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });
  } catch {
    throw new AdminApiError(
      0,
      "NETWORK_ERROR",
      "Unable to reach analytics server. Check your connection or Netlify Functions."
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  let parsed: unknown = null;
  if (contentType.includes("application/json")) {
    parsed = await res.json();
  }

  if (!res.ok) {
    const errObj =
      parsed && typeof parsed === "object" && "error" in parsed
        ? (parsed as { error?: { code?: string; message?: string } }).error
        : undefined;
    throw new AdminApiError(
      res.status,
      errObj?.code ?? `HTTP_${res.status}`,
      errObj?.message ??
        (res.status === 404
          ? "Netlify Functions endpoint not found. Run locally with `netlify dev` or deploy to Netlify."
          : "Request failed.")
    );
  }

  if (!parsed) {
    throw new AdminApiError(
      502,
      "INVALID_RESPONSE",
      "Server returned an unexpected non-JSON response. Make sure Netlify Functions are running."
    );
  }

  if (method === "GET" && cacheKey && cacheTtlMs > 0) {
    clientCache.set(cacheKey, {
      value: parsed,
      expiresAt: Date.now() + cacheTtlMs,
    });
  }

  return parsed as T;
}

export function fetchSession(): Promise<SessionResponse> {
  return requestJson<SessionResponse>("/.netlify/functions/auth-session");
}

export async function logoutSession(csrfToken: string): Promise<void> {
  clearClientAnalyticsCache();
  await requestJson<{ ok: boolean }>("/.netlify/functions/auth-logout", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
}

export function fetchOverview(
  range: DateRangeQuery,
  refresh = false
): Promise<OverviewResponse> {
  const qs = buildRangeParams(range, refresh);
  const key = `overview:${range.preset}:${range.startDate ?? ""}:${range.endDate ?? ""}`;
  return requestJson<OverviewResponse>(
    `/.netlify/functions/analytics-overview?${qs}`,
    { cacheKey: key, cacheTtlMs: 90_000, bypassCache: refresh }
  );
}

export function fetchTraffic(
  range: DateRangeQuery,
  refresh = false
): Promise<TrafficResponse> {
  const qs = buildRangeParams(range, refresh);
  const key = `traffic:${range.preset}:${range.startDate ?? ""}:${range.endDate ?? ""}`;
  return requestJson<TrafficResponse>(
    `/.netlify/functions/analytics-traffic?${qs}`,
    { cacheKey: key, cacheTtlMs: 90_000, bypassCache: refresh }
  );
}

export function fetchRealtime(refresh = false): Promise<RealtimeResponse> {
  const qs = refresh ? "?refresh=1" : "";
  return requestJson<RealtimeResponse>(
    `/.netlify/functions/analytics-realtime${qs}`,
    { bypassCache: true }
  );
}

export function fetchPages(
  range: DateRangeQuery,
  refresh = false
): Promise<PagesResponse> {
  const qs = buildRangeParams(range, refresh);
  const key = `pages:${range.preset}:${range.startDate ?? ""}:${range.endDate ?? ""}`;
  return requestJson<PagesResponse>(
    `/.netlify/functions/analytics-pages?${qs}`,
    { cacheKey: key, cacheTtlMs: 90_000, bypassCache: refresh }
  );
}

export function fetchAudience(
  range: DateRangeQuery,
  refresh = false
): Promise<AudienceResponse> {
  const qs = buildRangeParams(range, refresh);
  const key = `audience:${range.preset}:${range.startDate ?? ""}:${range.endDate ?? ""}`;
  return requestJson<AudienceResponse>(
    `/.netlify/functions/analytics-audience?${qs}`,
    { cacheKey: key, cacheTtlMs: 90_000, bypassCache: refresh }
  );
}

export function fetchEvents(
  range: DateRangeQuery,
  refresh = false
): Promise<EventsResponse> {
  const qs = buildRangeParams(range, refresh);
  const key = `events:${range.preset}:${range.startDate ?? ""}:${range.endDate ?? ""}`;
  return requestJson<EventsResponse>(
    `/.netlify/functions/analytics-events?${qs}`,
    { cacheKey: key, cacheTtlMs: 90_000, bypassCache: refresh }
  );
}
