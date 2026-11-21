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

function formatGa4Date(yyyymmdd: string): string {
  if (!/^\d{8}$/.test(yyyymmdd)) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

function enumerateDates(startIso: string, endIso: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${startIso}T00:00:00.000Z`);
  const end = new Date(`${endIso}T00:00:00.000Z`);
  while (cursor.getTime() <= end.getTime()) {
    const y = cursor.getUTCFullYear();
    const m = String(cursor.getUTCMonth() + 1).padStart(2, "0");
    const d = String(cursor.getUTCDate()).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
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
    const cacheKey = `traffic:${range.current.startDate}:${range.current.endDate}`;

    const result = await withCache(
      cacheKey,
      STANDARD_CACHE_TTL_MS,
      bypass,
      async () => {
        const [seriesCurrent, seriesPrevious, channelsReport, sourcesReport] =
          await Promise.all([
            runReport({
              dateRanges: [range.current],
              dimensions: [{ name: "date" }],
              metrics: [
                { name: "totalUsers" },
                { name: "sessions" },
                { name: "screenPageViews" },
              ],
              orderBys: [{ dimension: { dimensionName: "date" } }],
            }),
            runReport({
              dateRanges: [range.previous],
              dimensions: [{ name: "date" }],
              metrics: [
                { name: "totalUsers" },
                { name: "sessions" },
                { name: "screenPageViews" },
              ],
              orderBys: [{ dimension: { dimensionName: "date" } }],
            }),
            runReport({
              dateRanges: [range.current],
              dimensions: [{ name: "sessionDefaultChannelGroup" }],
              metrics: [
                { name: "sessions" },
                { name: "totalUsers" },
                { name: "engagementRate" },
                { name: "screenPageViews" },
              ],
              orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
              limit: 15,
            }),
            runReport({
              dateRanges: [range.current],
              dimensions: [{ name: "sessionSourceMedium" }],
              metrics: [
                { name: "sessions" },
                { name: "totalUsers" },
                { name: "engagementRate" },
                { name: "screenPageViews" },
              ],
              orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
              limit: 25,
            }),
          ]);

        const currentMap = new Map<
          string,
          { users: number; sessions: number; pageViews: number }
        >();
        for (const row of seriesCurrent.rows ?? []) {
          const iso = formatGa4Date(toDimension(row, 0, ""));
          if (!iso) continue;
          currentMap.set(iso, {
            users: toNumber(row, 0),
            sessions: toNumber(row, 1),
            pageViews: toNumber(row, 2),
          });
        }

        const prevMap = new Map<
          string,
          { users: number; sessions: number; pageViews: number }
        >();
        for (const row of seriesPrevious.rows ?? []) {
          const iso = formatGa4Date(toDimension(row, 0, ""));
          if (!iso) continue;
          prevMap.set(iso, {
            users: toNumber(row, 0),
            sessions: toNumber(row, 1),
            pageViews: toNumber(row, 2),
          });
        }

        const currentDates = enumerateDates(
          range.current.startDate,
          range.current.endDate
        );
        const previousDates = enumerateDates(
          range.previous.startDate,
          range.previous.endDate
        );

        const timeseries = currentDates.map((iso, idx) => {
          const cur = currentMap.get(iso) ?? {
            users: 0,
            sessions: 0,
            pageViews: 0,
          };
          const prevIso = previousDates[idx] ?? "";
          const prev = prevMap.get(prevIso) ?? {
            users: 0,
            sessions: 0,
            pageViews: 0,
          };

          return {
            date: iso,
            previousDate: prevIso,
            users: cur.users,
            sessions: cur.sessions,
            pageViews: cur.pageViews,
            previousUsers: prev.users,
            previousSessions: prev.sessions,
            previousPageViews: prev.pageViews,
          };
        });

        const channels = (channelsReport.rows ?? []).map((row) => ({
          channel: toDimension(row, 0, "Unassigned"),
          sessions: toNumber(row, 0),
          users: toNumber(row, 1),
          engagementRate: toNumber(row, 2),
          pageViews: toNumber(row, 3),
        }));

        const sourceMedium = (sourcesReport.rows ?? []).map((row) => ({
          sourceMedium: toDimension(row, 0, "(direct) / (none)"),
          sessions: toNumber(row, 0),
          users: toNumber(row, 1),
          engagementRate: toNumber(row, 2),
          pageViews: toNumber(row, 3),
        }));

        // Aggregate identifiable LinkedIn traffic from source/medium rows
        const linkedInRows = sourceMedium.filter((row) =>
          row.sourceMedium.toLowerCase().includes("linkedin")
        );
        const linkedInSessions = linkedInRows.reduce((acc, r) => acc + r.sessions, 0);
        const linkedInUsers = linkedInRows.reduce((acc, r) => acc + r.users, 0);
        const linkedInWeightedEng =
          linkedInSessions > 0
            ? linkedInRows.reduce(
                (acc, r) => acc + r.engagementRate * r.sessions,
                0
              ) / linkedInSessions
            : 0;

        return {
          range,
          timeseries,
          channels,
          sourceMedium,
          linkedin: {
            sessions: linkedInSessions,
            users: linkedInUsers,
            engagementRate: linkedInWeightedEng,
            sources: linkedInRows,
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
      "TRAFFIC_FAILED",
      "Unable to retrieve traffic analytics."
    );
  }
}
