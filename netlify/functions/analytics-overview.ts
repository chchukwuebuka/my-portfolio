import {
  GA4Error,
  parseDateRange,
  percentChange,
  runReport,
  toNumber,
  withCache,
} from "./_lib/ga4.ts";
import { errorResponse, jsonResponse } from "./_lib/http.ts";
import { requireAdminSession } from "./_lib/session.ts";

const STANDARD_CACHE_TTL_MS = 180_000; // 3 minutes

interface PeriodMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  engagementRate: number;
  avgEngagementTime: number;
  eventCount: number;
}

function extractMetrics(row: Parameters<typeof toNumber>[0]): PeriodMetrics {
  const totalUsers = toNumber(row, 0);
  const activeUsers = toNumber(row, 1);
  const newUsers = toNumber(row, 2);
  const sessions = toNumber(row, 3);
  const pageViews = toNumber(row, 4);
  const engagementRate = toNumber(row, 5);
  const userEngagementDuration = toNumber(row, 6);
  const eventCount = toNumber(row, 7);

  const avgEngagementTime =
    activeUsers > 0 ? userEngagementDuration / activeUsers : 0;

  return {
    totalUsers,
    activeUsers,
    newUsers,
    sessions,
    pageViews,
    engagementRate,
    avgEngagementTime,
    eventCount,
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET is supported.");
  }

  const auth = await requireAdminSession(req);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    const range = parseDateRange(url);
    const bypass = url.searchParams.get("refresh") === "1";
    const cacheKey = `overview:${range.current.startDate}:${range.current.endDate}`;

    const result = await withCache(
      cacheKey,
      STANDARD_CACHE_TTL_MS,
      bypass,
      async () => {
        const report = await runReport({
          dateRanges: [
            {
              startDate: range.current.startDate,
              endDate: range.current.endDate,
              name: "current",
            },
            {
              startDate: range.previous.startDate,
              endDate: range.previous.endDate,
              name: "previous",
            },
          ],
          metrics: [
            { name: "totalUsers" },
            { name: "activeUsers" },
            { name: "newUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "engagementRate" },
            { name: "userEngagementDuration" },
            { name: "eventCount" },
          ],
        });

        // With 2 dateRanges and 0 dimensions, GA4 returns up to 2 rows (date_range_0 and date_range_1)
        const rows = report.rows ?? [];
        const currentRow =
          rows.find((r) => r.dimensionValues?.[0]?.value === "date_range_0") ??
          rows[0];
        const previousRow =
          rows.find((r) => r.dimensionValues?.[0]?.value === "date_range_1") ??
          rows[1];

        const current = extractMetrics(currentRow);
        const previous = extractMetrics(previousRow);

        const buildMetric = (key: keyof PeriodMetrics) => ({
          current: current[key],
          previous: previous[key],
          changePercent: percentChange(current[key], previous[key]),
        });

        return {
          range,
          hasData:
            current.totalUsers > 0 ||
            current.sessions > 0 ||
            current.pageViews > 0 ||
            current.eventCount > 0,
          metrics: {
            totalUsers: buildMetric("totalUsers"),
            activeUsers: buildMetric("activeUsers"),
            newUsers: buildMetric("newUsers"),
            sessions: buildMetric("sessions"),
            pageViews: buildMetric("pageViews"),
            engagementRate: buildMetric("engagementRate"),
            avgEngagementTime: buildMetric("avgEngagementTime"),
            eventCount: buildMetric("eventCount"),
          },
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
      "OVERVIEW_FAILED",
      "Unable to retrieve overview analytics."
    );
  }
}
