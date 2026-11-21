import { JWT } from "google-auth-library";
import { ConfigError, getGA4Config } from "./config.ts";

const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta";

export type DatePreset = "today" | "7d" | "30d" | "90d" | "custom";

export interface DateWindow {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface ParsedDateRange {
  preset: DatePreset;
  label: string;
  current: DateWindow;
  previous: DateWindow;
  days: number;
}

export interface GA4ReportRow {
  dimensionValues?: Array<{ value?: string }>;
  metricValues?: Array<{ value?: string }>;
}

export interface GA4ReportResponse {
  rows?: GA4ReportRow[];
  rowCount?: number;
  totals?: GA4ReportRow[];
  metadata?: Record<string, unknown>;
}

export class GA4Error extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "GA4Error";
    this.status = status;
    this.code = code;
  }
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const reportCache = new Map<string, CacheEntry<unknown>>();
const MAX_CACHE_ENTRIES = 120;

let cachedAuthClient: JWT | null = null;
let cachedAuthKeyFingerprint = "";

function getAuthClient(): { client: JWT; propertyId: string } {
  const cfg = getGA4Config();
  const fingerprint = `${cfg.propertyId}:${cfg.serviceAccountEmail}:${cfg.privateKey.length}`;

  if (!cachedAuthClient || cachedAuthKeyFingerprint !== fingerprint) {
    cachedAuthClient = new JWT({
      email: cfg.serviceAccountEmail,
      key: cfg.privateKey,
      scopes: [GA4_SCOPE],
    });
    cachedAuthKeyFingerprint = fingerprint;
  }

  return { client: cachedAuthClient, propertyId: cfg.propertyId };
}

function formatIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, delta: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + delta);
  return next;
}

function parseStrictIsoDate(input: string | null): Date | null {
  if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return null;
  const parsed = new Date(`${input}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (formatIsoDate(parsed) !== input) return null;
  return parsed;
}

export function parseDateRange(url: URL): ParsedDateRange {
  const rawPreset = (url.searchParams.get("range") ?? "30d").toLowerCase();
  const todayUtc = new Date();
  const today = new Date(
    Date.UTC(
      todayUtc.getUTCFullYear(),
      todayUtc.getUTCMonth(),
      todayUtc.getUTCDate()
    )
  );

  if (rawPreset === "custom") {
    const start = parseStrictIsoDate(url.searchParams.get("startDate"));
    const end = parseStrictIsoDate(url.searchParams.get("endDate"));

    if (!start || !end) {
      throw new GA4Error(
        400,
        "INVALID_DATE_RANGE",
        "Custom date range requires valid startDate and endDate (YYYY-MM-DD)."
      );
    }

    if (start.getTime() > end.getTime()) {
      throw new GA4Error(
        400,
        "INVALID_DATE_RANGE",
        "startDate must be on or before endDate."
      );
    }

    const days =
      Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;

    if (days > 366) {
      throw new GA4Error(
        400,
        "DATE_RANGE_TOO_LARGE",
        "Custom date range cannot exceed 366 days."
      );
    }

    const prevEnd = addDays(start, -1);
    const prevStart = addDays(prevEnd, -(days - 1));

    return {
      preset: "custom",
      label: `${formatIsoDate(start)} — ${formatIsoDate(end)}`,
      current: { startDate: formatIsoDate(start), endDate: formatIsoDate(end) },
      previous: {
        startDate: formatIsoDate(prevStart),
        endDate: formatIsoDate(prevEnd),
      },
      days,
    };
  }

  let days = 30;
  let preset: DatePreset = "30d";
  let label = "Last 30 days";

  if (rawPreset === "today") {
    days = 1;
    preset = "today";
    label = "Today";
  } else if (rawPreset === "7d") {
    days = 7;
    preset = "7d";
    label = "Last 7 days";
  } else if (rawPreset === "90d") {
    days = 90;
    preset = "90d";
    label = "Last 90 days";
  }

  const currentStart = addDays(today, -(days - 1));
  const prevEnd = addDays(currentStart, -1);
  const prevStart = addDays(prevEnd, -(days - 1));

  return {
    preset,
    label,
    current: {
      startDate: formatIsoDate(currentStart),
      endDate: formatIsoDate(today),
    },
    previous: {
      startDate: formatIsoDate(prevStart),
      endDate: formatIsoDate(prevEnd),
    },
    days,
  };
}

export async function withCache<T>(
  key: string,
  ttlMs: number,
  bypass: boolean,
  fetcher: () => Promise<T>
): Promise<{ data: T; cached: boolean; updatedAt: string }> {
  const now = Date.now();
  if (!bypass && ttlMs > 0) {
    const existing = reportCache.get(key) as CacheEntry<{
      data: T;
      updatedAt: string;
    }> | undefined;
    if (existing && existing.expiresAt > now) {
      return {
        data: existing.value.data,
        cached: true,
        updatedAt: existing.value.updatedAt,
      };
    }
  }

  const data = await fetcher();
  const updatedAt = new Date().toISOString();

  if (ttlMs > 0) {
    if (reportCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = reportCache.keys().next().value;
      if (oldestKey) reportCache.delete(oldestKey);
    }
    reportCache.set(key, {
      value: { data, updatedAt },
      expiresAt: now + ttlMs,
    });
  }

  return { data, cached: false, updatedAt };
}

interface GoogleApiErrorBody {
  error?: {
    message?: string;
    status?: string;
    details?: Array<{ reason?: string }>;
  };
}

export function classifyGA4Forbidden(
  propertyId: string,
  body: GoogleApiErrorBody | null
): GA4Error {
  const message = body?.error?.message ?? "";
  const hasDisabledReason =
    body?.error?.details?.some((d) => d?.reason === "SERVICE_DISABLED") ?? false;

  if (
    hasDisabledReason ||
    /has not been used in project|is disabled|Enable it by visiting/i.test(message)
  ) {
    return new GA4Error(
      502,
      "GA4_API_DISABLED",
      "Google Analytics Data API is not enabled in your Google Cloud project. Enable 'Google Analytics Data API' in Google Cloud Console → APIs & Services → Library, wait ~1 minute, and retry."
    );
  }

  return new GA4Error(
    502,
    "GA4_PERMISSION_DENIED",
    `GA4 denied access for property ${propertyId}. Verify that (1) GA4_PROPERTY_ID in Netlify is your numeric Property ID (e.g. 565407830, not a Data Stream ID), and (2) your service account email has Viewer access under GA4 Admin → Property Access Management.`
  );
}

async function callGA4Endpoint(
  endpoint: "runReport" | "runRealtimeReport",
  body: Record<string, unknown>
): Promise<GA4ReportResponse> {
  let client: JWT;
  let propertyId: string;
  try {
    ({ client, propertyId } = getAuthClient());
  } catch (err) {
    if (err instanceof ConfigError) {
      throw new GA4Error(
        503,
        "GA4_NOT_CONFIGURED",
          `Missing or invalid Netlify Function environment variable(s): ${err.missingKeys.join(", ")}. Verify spelling, enable the Functions scope in Netlify, and trigger a redeploy.`
      );
    }
    throw new GA4Error(500, "GA4_CONFIG_ERROR", "Unable to initialize GA4 client.");
  }

  let accessToken: string;
  try {
    const tokenResult = await client.getAccessToken();
    if (!tokenResult?.token) {
      throw new Error("Empty access token");
    }
    accessToken = tokenResult.token;
  } catch {
    throw new GA4Error(
      502,
      "GA4_AUTH_FAILED",
      "Failed to authenticate the GA4 service account. Verify GA4_SERVICE_ACCOUNT_EMAIL and GA4_PRIVATE_KEY."
    );
  }

  const url = `${GA4_API_BASE}/properties/${propertyId}:${endpoint}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      return (await res.json()) as GA4ReportResponse;
    }

    if ((res.status === 429 || res.status >= 500) && attempt === 0) {
      await new Promise((r) => setTimeout(r, 400));
      continue;
    }

    if (res.status === 403) {
      let errorBody: GoogleApiErrorBody | null = null;
      try {
        errorBody = (await res.json()) as GoogleApiErrorBody;
      } catch {
        errorBody = null;
      }
      throw classifyGA4Forbidden(propertyId, errorBody);
    }

    if (res.status === 400) {
      throw new GA4Error(
        400,
        "GA4_INVALID_QUERY",
        "GA4 rejected the report query parameters."
      );
    }

    if (res.status === 429) {
      throw new GA4Error(
        429,
        "GA4_RATE_LIMITED",
        "GA4 API quota temporarily reached. Please retry in a moment."
      );
    }

    throw new GA4Error(
      502,
      "GA4_UPSTREAM_ERROR",
      "Google Analytics Data API returned an unexpected error."
    );
  }

  throw new GA4Error(502, "GA4_UPSTREAM_ERROR", "GA4 request failed.");
}

export function runReport(
  body: Record<string, unknown>
): Promise<GA4ReportResponse> {
  return callGA4Endpoint("runReport", body);
}

export function runRealtimeReport(
  body: Record<string, unknown>
): Promise<GA4ReportResponse> {
  return callGA4Endpoint("runRealtimeReport", body);
}

export function toNumber(row: GA4ReportRow | undefined, metricIndex: number): number {
  const raw = row?.metricValues?.[metricIndex]?.value;
  if (raw === undefined || raw === null || raw === "") return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toDimension(
  row: GA4ReportRow | undefined,
  dimIndex: number,
  fallback = "(not set)"
): string {
  const raw = row?.dimensionValues?.[dimIndex]?.value?.trim();
  return raw ? raw : fallback;
}

export function percentChange(current: number, previous: number): number | null {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
