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

const KNOWN_PROJECTS = [
  { slug: "hoist-it-solutions", title: "Hoist IT Solutions", category: "Enterprise / Digital Transformation" },
  { slug: "kuepass", title: "Kuepass", category: "Event Technology" },
  { slug: "university-systems", title: "University Systems", category: "Education Technology" },
  { slug: "cookeaze", title: "Cookeaze", category: "Food Technology / AI" },
  { slug: "soundrig", title: "SoundRig", category: "Music Technology / Web3" },
  { slug: "viicsoft", title: "Viicsoft Solutions", category: "Technology Agency" },
  { slug: "crisptv", title: "CrispTV", category: "Media & Live Production" },
  { slug: "winner-chikezie", title: "Winner Chikezie Portfolio", category: "Frontend Engineering" },
  { slug: "crp-church", title: "CRP Church", category: "Community Platform" },
];

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
    const cacheKey = `events:${range.current.startDate}:${range.current.endDate}`;

    const result = await withCache(
      cacheKey,
      STANDARD_CACHE_TTL_MS,
      bypass,
      async () => {
        const [eventsRes, workPagesRes] = await Promise.all([
          runReport({
            dateRanges: [range.current],
            dimensions: [{ name: "eventName" }],
            metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
            limit: 40,
          }),
          runReport({
            dateRanges: [range.current],
            dimensions: [{ name: "pagePath" }],
            metrics: [
              { name: "screenPageViews" },
              { name: "activeUsers" },
              { name: "userEngagementDuration" },
              { name: "engagementRate" },
            ],
            dimensionFilter: {
              filter: {
                fieldName: "pagePath",
                stringFilter: {
                  matchType: "BEGINS_WITH",
                  value: "/work/",
                },
              },
            },
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: 30,
          }),
        ]);

        // Optionally query customEvent:project_name if the user registered it as a GA4 custom dimension
        let projectEventsByTitle = new Map<
          string,
          { projectClicks: number; externalClicks: number; projectViews: number }
        >();
        let customDimensionsActive = false;

        try {
          const customRes = await runReport({
            dateRanges: [range.current],
            dimensions: [
              { name: "customEvent:project_name" },
              { name: "eventName" },
            ],
            metrics: [{ name: "eventCount" }],
            dimensionFilter: {
              filter: {
                fieldName: "eventName",
                inListFilter: {
                  values: [
                    "project_view",
                    "project_click",
                    "external_project_click",
                  ],
                },
              },
            },
            limit: 100,
          });

          customDimensionsActive = true;
          projectEventsByTitle = new Map();
          for (const row of customRes.rows ?? []) {
            const pName = toDimension(row, 0, "");
            const evt = toDimension(row, 1, "");
            const count = toNumber(row, 0);
            if (!pName || pName === "(not set)") continue;
            const key = pName.toLowerCase();
            const existing = projectEventsByTitle.get(key) ?? {
              projectClicks: 0,
              externalClicks: 0,
              projectViews: 0,
            };
            if (evt === "project_click") existing.projectClicks += count;
            if (evt === "external_project_click") existing.externalClicks += count;
            if (evt === "project_view") existing.projectViews += count;
            projectEventsByTitle.set(key, existing);
          }
        } catch {
          // Graceful fallback if customEvent:project_name is not yet registered in GA4 Admin
          customDimensionsActive = false;
        }

        const events = (eventsRes.rows ?? []).map((row) => ({
          eventName: toDimension(row, 0, "unknown"),
          count: toNumber(row, 0),
          users: toNumber(row, 1),
        }));

        const eventCountMap = new Map(events.map((e) => [e.eventName, e.count]));

        const engagementSummary = {
          cvDownloads:
            (eventCountMap.get("file_download") ?? 0) +
            (eventCountMap.get("cv_download") ?? 0),
          linkedinClicks: eventCountMap.get("linkedin_click") ?? 0,
          githubClicks: eventCountMap.get("github_click") ?? 0,
          contactClicks: eventCountMap.get("contact_click") ?? 0,
          projectViews: eventCountMap.get("project_view") ?? 0,
          projectClicks: eventCountMap.get("project_click") ?? 0,
          externalProjectClicks: eventCountMap.get("external_project_click") ?? 0,
        };

        const pageStatsBySlug = new Map<
          string,
          { views: number; users: number; avgEngagementTime: number; engagementRate: number }
        >();
        for (const row of workPagesRes.rows ?? []) {
          const path = toDimension(row, 0, "");
          const slug = path.replace(/^\/work\//, "").replace(/\/+$/, "");
          if (!slug) continue;
          const views = toNumber(row, 0);
          const users = toNumber(row, 1);
          const duration = toNumber(row, 2);
          const engagementRate = toNumber(row, 3);
          pageStatsBySlug.set(slug, {
            views,
            users,
            avgEngagementTime: users > 0 ? duration / users : 0,
            engagementRate,
          });
        }

        const projects = KNOWN_PROJECTS.map((project) => {
          const page = pageStatsBySlug.get(project.slug) ?? {
            views: 0,
            users: 0,
            avgEngagementTime: 0,
            engagementRate: 0,
          };
          const evtData = projectEventsByTitle.get(project.title.toLowerCase()) ?? {
            projectClicks: 0,
            externalClicks: 0,
            projectViews: 0,
          };

          return {
            slug: project.slug,
            title: project.title,
            category: project.category,
            path: `/work/${project.slug}`,
            pageViews: page.views,
            users: page.users,
            avgEngagementTime: page.avgEngagementTime,
            engagementRate: page.engagementRate,
            projectClicks: evtData.projectClicks,
            externalClicks: evtData.externalClicks,
            projectViewEvents: evtData.projectViews,
          };
        }).sort(
          (a, b) =>
            b.pageViews + b.projectClicks + b.externalClicks -
            (a.pageViews + a.projectClicks + a.externalClicks)
        );

        return {
          range,
          customDimensionsActive,
          engagementSummary,
          projects,
          events,
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
      "EVENTS_FAILED",
      "Unable to retrieve project and engagement analytics."
    );
  }
}
