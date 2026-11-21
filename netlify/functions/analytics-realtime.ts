import {
  GA4Error,
  runRealtimeReport,
  toDimension,
  toNumber,
  withCache,
} from "./_lib/ga4.ts";
import { errorResponse, jsonResponse } from "./_lib/http.ts";
import { requireAdminSession } from "./_lib/session.ts";

const REALTIME_CACHE_TTL_MS = 20_000; // 20s burst guard while allowing 30–60s polling

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET is supported.");
  }

  const auth = await requireAdminSession(req);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    const bypass = url.searchParams.get("refresh") === "1";

    const result = await withCache(
      "realtime:snapshot",
      REALTIME_CACHE_TTL_MS,
      bypass,
      async () => {
        const [
          active30mReport,
          active5mReport,
          pagesReport,
          eventsReport,
          countriesReport,
          devicesReport,
        ] = await Promise.all([
          runRealtimeReport({
            metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
            minuteRanges: [{ name: "last30m", startMinutesAgo: 29, endMinutesAgo: 0 }],
          }),
          runRealtimeReport({
            metrics: [{ name: "activeUsers" }],
            minuteRanges: [{ name: "last5m", startMinutesAgo: 4, endMinutesAgo: 0 }],
          }),
          runRealtimeReport({
            dimensions: [{ name: "unifiedScreenName" }],
            metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
            limit: 12,
          }),
          runRealtimeReport({
            dimensions: [{ name: "eventName" }],
            metrics: [{ name: "eventCount" }],
            limit: 12,
          }),
          runRealtimeReport({
            dimensions: [{ name: "country" }],
            metrics: [{ name: "activeUsers" }],
            limit: 10,
          }),
          runRealtimeReport({
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "activeUsers" }],
            limit: 5,
          }),
        ]);

        const activeUsers30m = toNumber(active30mReport.rows?.[0], 0);
        const pageViews30m = toNumber(active30mReport.rows?.[0], 1);
        const activeUsers5m = toNumber(active5mReport.rows?.[0], 0);

        const activePages = (pagesReport.rows ?? [])
          .map((row) => ({
            title: toDimension(row, 0, "Untitled Page"),
            activeUsers: toNumber(row, 0),
            views: toNumber(row, 1),
          }))
          .sort((a, b) => b.activeUsers - a.activeUsers);

        const events = (eventsReport.rows ?? [])
          .map((row) => ({
            eventName: toDimension(row, 0, "unknown"),
            count: toNumber(row, 0),
          }))
          .sort((a, b) => b.count - a.count);

        const countries = (countriesReport.rows ?? [])
          .map((row) => ({
            country: toDimension(row, 0, "Unknown"),
            activeUsers: toNumber(row, 0),
          }))
          .sort((a, b) => b.activeUsers - a.activeUsers);

        const devices = (devicesReport.rows ?? [])
          .map((row) => ({
            device: toDimension(row, 0, "Unknown"),
            activeUsers: toNumber(row, 0),
          }))
          .sort((a, b) => b.activeUsers - a.activeUsers);

        return {
          activeUsers30m,
          activeUsers5m,
          pageViews30m,
          activePages,
          events,
          countries,
          devices,
        };
      }
    );

    return jsonResponse({
      ...result.data,
      cached: result.cached,
      updatedAt: result.updatedAt,
    });
  } catch (err) {
    if (err instanceof GA4Error) {
      return errorResponse(err.status, err.code, err.message);
    }
    return errorResponse(
      500,
      "REALTIME_FAILED",
      "Unable to retrieve realtime analytics."
    );
  }
}
