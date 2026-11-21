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

interface AudienceEntry {
  name: string;
  users: number;
  sessions: number;
  engagementRate: number;
}

function mapAudience(
  rows: Awaited<ReturnType<typeof runReport>>["rows"]
): AudienceEntry[] {
  return (rows ?? []).map((row) => ({
    name: toDimension(row, 0, "(not set)"),
    users: toNumber(row, 0),
    sessions: toNumber(row, 1),
    engagementRate: toNumber(row, 2),
  }));
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
    const cacheKey = `audience:${range.current.startDate}:${range.current.endDate}`;

    const result = await withCache(
      cacheKey,
      STANDARD_CACHE_TTL_MS,
      bypass,
      async () => {
        const makeQuery = (dimension: string, limit: number) =>
          runReport({
            dateRanges: [range.current],
            dimensions: [{ name: dimension }],
            metrics: [
              { name: "totalUsers" },
              { name: "sessions" },
              { name: "engagementRate" },
            ],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
            limit,
          });

        const [countriesRes, citiesRes, devicesRes, browsersRes, osRes] =
          await Promise.all([
            makeQuery("country", 20),
            makeQuery("city", 20),
            makeQuery("deviceCategory", 10),
            makeQuery("browser", 15),
            makeQuery("operatingSystem", 15),
          ]);

        return {
          range,
          countries: mapAudience(countriesRes.rows),
          cities: mapAudience(citiesRes.rows).filter((c) => c.name !== "(not set)"),
          devices: mapAudience(devicesRes.rows),
          browsers: mapAudience(browsersRes.rows),
          operatingSystems: mapAudience(osRes.rows),
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
      "AUDIENCE_FAILED",
      "Unable to retrieve audience analytics."
    );
  }
}
