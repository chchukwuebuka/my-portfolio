import {
  GA4Error,
  parseDateRange,
  runReport,
  toDimension,
  toNumber,
  withCache,
} from "./_lib/ga4.ts";
import { errorResponse, jsonResponse } from "./_lib/http.ts";
import { requireAdminSession } from "./_lib/session.ts";

const STANDARD_CACHE_TTL_MS = 180_000;

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
    const cacheKey = `pages:${range.current.startDate}:${range.current.endDate}`;

    const result = await withCache(
      cacheKey,
      STANDARD_CACHE_TTL_MS,
      bypass,
      async () => {
        const report = await runReport({
          dateRanges: [range.current],
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [
            { name: "screenPageViews" },
            { name: "activeUsers" },
            { name: "userEngagementDuration" },
            { name: "engagementRate" },
          ],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 50,
        });

        const pages = (report.rows ?? [])
          .map((row) => {
            const path = toDimension(row, 0, "/");
            const title = toDimension(row, 1, path);
            const views = toNumber(row, 0);
            const users = toNumber(row, 1);
            const duration = toNumber(row, 2);
            const engagementRate = toNumber(row, 3);
            const avgEngagementTime = users > 0 ? duration / users : 0;

            return {
              path,
              title,
              views,
              users,
              avgEngagementTime,
              engagementRate,
            };
          })
          // Never surface private admin routes in public portfolio pages report
          .filter((page) => !page.path.startsWith("/admin"));

        return { range, pages };
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
      "PAGES_FAILED",
      "Unable to retrieve page analytics."
    );
  }
}
