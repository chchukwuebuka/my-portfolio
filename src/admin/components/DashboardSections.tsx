import { useState } from "react";
import { AlertCircle, Radio } from "lucide-react";
import {
  formatDelta,
  formatDuration,
  formatNumber,
  formatPercent,
  formatTimestamp,
} from "../format";
import type {
  AudienceEntry,
  AudienceResponse,
  EventsResponse,
  MetricDelta,
  OverviewResponse,
  PagesResponse,
  RealtimeResponse,
  TrafficResponse,
} from "../types";
import TrafficChart from "./TrafficChart";
import styles from "./AdminDashboardPage.module.css";

interface LoadState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const ErrorBanner = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className={styles.errorBanner} role="alert">
    <div className={styles.errorLeft}>
      <AlertCircle size={17} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
      <span>{message}</span>
    </div>
    <button type="button" onClick={onRetry} className={styles.retryBtn}>
      Retry
    </button>
  </div>
);

const SkeletonGrid = ({ count = 4 }: { count?: number }) => (
  <div className={styles.kpiGrid}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.kpiCard}>
        <div className={styles.skeleton} style={{ width: "52%", height: 12 }} />
        <div className={styles.skeleton} style={{ width: "68%", height: 28 }} />
        <div className={styles.skeleton} style={{ width: "44%", height: 12 }} />
      </div>
    ))}
  </div>
);

const KpiCard = ({
  label,
  metric,
  formatter,
}: {
  label: string;
  metric: MetricDelta;
  formatter: (n: number) => string;
}) => {
  const deltaClass =
    metric.changePercent === null || metric.changePercent === 0
      ? styles.deltaNeutral
      : metric.changePercent > 0
        ? styles.deltaUp
        : styles.deltaDown;

  return (
    <div className={styles.kpiCard}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>{formatter(metric.current)}</span>
      <div className={styles.kpiFooter}>
        <span className={styles.kpiPrev}>Prev: {formatter(metric.previous)}</span>
        <span className={deltaClass}>{formatDelta(metric.changePercent)}</span>
      </div>
    </div>
  );
};

const RankingList = ({
  title,
  subtitle,
  items,
  emptyText,
}: {
  title: string;
  subtitle?: string;
  items: Array<{ name: string; primary: number; secondary?: string }>;
  emptyText: string;
}) => {
  const maxVal = items.reduce((m, item) => Math.max(m, item.primary), 0) || 1;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>{title}</h3>
        {subtitle && <span className={styles.panelSub}>{subtitle}</span>}
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>{emptyText}</div>
      ) : (
        <ul className={styles.barList}>
          {items.map((item) => (
            <li key={item.name} className={styles.barItem}>
              <div className={styles.barTop}>
                <span className={styles.barName} title={item.name}>
                  {item.name}
                </span>
                <span className={styles.barMetric}>
                  {formatNumber(item.primary)}
                  {item.secondary ? ` · ${item.secondary}` : ""}
                </span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${Math.max(3, (item.primary / maxVal) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ============================================================================
 * 1. OVERVIEW
 * ============================================================================ */
export const OverviewSection = ({
  overview,
  traffic,
  realtime,
  pages,
  onRetry,
  onOpenRealtime,
}: {
  overview: LoadState<OverviewResponse>;
  traffic: LoadState<TrafficResponse>;
  realtime: LoadState<RealtimeResponse>;
  pages: LoadState<PagesResponse>;
  onRetry: () => void;
  onOpenRealtime: () => void;
}) => {
  const anyError = overview.error ?? traffic.error;

  return (
    <>
      {anyError && <ErrorBanner message={anyError} onRetry={onRetry} />}

      {/* Compact Realtime Strip */}
      <div className={styles.realtimeBanner}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <span className={styles.realtimeBadge}>
            <Radio size={13} aria-hidden="true" />
            <span>REALTIME TELEMETRY · SEPARATE FROM STANDARD REPORTS</span>
          </span>
          <span className={styles.panelSub}>
            {realtime.error
              ? "Realtime unavailable — retry or open Realtime tab."
              : `Last synced ${formatTimestamp(realtime.data?.updatedAt ?? null)} · Auto-refreshes every 45s`}
          </span>
        </div>

        <div className={styles.realtimeStats}>
          <div className={styles.realtimeStat}>
            <span className={styles.realtimeNumber}>
              {realtime.data ? formatNumber(realtime.data.activeUsers30m) : "—"}
            </span>
            <span className={styles.realtimeLabel}>Active (30 min)</span>
          </div>
          <div className={styles.realtimeStat}>
            <span className={styles.realtimeNumber}>
              {realtime.data ? formatNumber(realtime.data.activeUsers5m) : "—"}
            </span>
            <span className={styles.realtimeLabel}>Active (5 min)</span>
          </div>
          <button
            type="button"
            onClick={onOpenRealtime}
            className={styles.refreshBtn}
            style={{ alignSelf: "center" }}
          >
            Inspect Realtime →
          </button>
        </div>
      </div>

      {/* 8 Overview KPIs */}
      {overview.loading && !overview.data ? (
        <SkeletonGrid count={8} />
      ) : overview.data ? (
        <>
          {!overview.data.hasData && (
            <div className={styles.infoBanner}>
              No GA4 sessions or events have been recorded for{" "}
              <strong>{overview.data.range.label}</strong> yet. Standard GA4
              reports can take up to 24 hours after initial setup; check the{" "}
              <strong>Realtime</strong> panel for live visits.
            </div>
          )}
          <div className={styles.kpiGrid}>
            <KpiCard
              label="Total Users"
              metric={overview.data.metrics.totalUsers}
              formatter={formatNumber}
            />
            <KpiCard
              label="Active Users"
              metric={overview.data.metrics.activeUsers}
              formatter={formatNumber}
            />
            <KpiCard
              label="New Users"
              metric={overview.data.metrics.newUsers}
              formatter={formatNumber}
            />
            <KpiCard
              label="Sessions"
              metric={overview.data.metrics.sessions}
              formatter={formatNumber}
            />
            <KpiCard
              label="Page Views"
              metric={overview.data.metrics.pageViews}
              formatter={formatNumber}
            />
            <KpiCard
              label="Engagement Rate"
              metric={overview.data.metrics.engagementRate}
              formatter={(n) => formatPercent(n)}
            />
            <KpiCard
              label="Avg Engagement Time"
              metric={overview.data.metrics.avgEngagementTime}
              formatter={formatDuration}
            />
            <KpiCard
              label="Event Count"
              metric={overview.data.metrics.eventCount}
              formatter={formatNumber}
            />
          </div>
        </>
      ) : null}

      {/* Interactive Traffic Chart */}
      {traffic.loading && !traffic.data ? (
        <div className={styles.panel}>
          <div className={styles.skeleton} style={{ height: 240 }} />
        </div>
      ) : traffic.data ? (
        <TrafficChart
          data={traffic.data.timeseries}
          rangeLabel={traffic.data.range.label}
        />
      ) : null}

      {/* Quick Snapshot: Top Pages & Acquisition Channels */}
      <div className={styles.twoCol}>
        <RankingList
          title="Top Acquisition Channels"
          subtitle="Sessions"
          items={(traffic.data?.channels ?? []).slice(0, 6).map((c) => ({
            name: c.channel,
            primary: c.sessions,
            secondary: `${formatPercent(c.engagementRate)} eng.`,
          }))}
          emptyText="No channel data recorded for this period."
        />

        <RankingList
          title="Most Visited Pages"
          subtitle="Views"
          items={(pages.data?.pages ?? []).slice(0, 6).map((p) => ({
            name: p.path,
            primary: p.views,
            secondary: `${formatNumber(p.users)} users`,
          }))}
          emptyText="No page view data recorded for this period."
        />
      </div>
    </>
  );
};

/* ============================================================================
 * 2. REALTIME
 * ============================================================================ */
export const RealtimeSection = ({
  realtime,
  autoRefresh,
  onToggleAutoRefresh,
  onRetry,
}: {
  realtime: LoadState<RealtimeResponse>;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onRetry: () => void;
}) => (
  <>
    {realtime.error && <ErrorBanner message={realtime.error} onRetry={onRetry} />}

    <div className={styles.realtimeBanner}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <span className={styles.realtimeBadge}>
          <Radio size={13} aria-hidden="true" />
          <span>GA4 REALTIME API · LIVE STREAM</span>
        </span>
        <span className={styles.panelSub}>
          Updated {formatTimestamp(realtime.data?.updatedAt ?? null)} ·{" "}
          {autoRefresh ? "Auto-refresh every 45s" : "Auto-refresh paused"}
        </span>
      </div>
      <button
        type="button"
        onClick={onToggleAutoRefresh}
        className={styles.refreshBtn}
      >
        {autoRefresh ? "Pause Auto-Refresh" : "Resume Auto-Refresh"}
      </button>
    </div>

    {realtime.loading && !realtime.data ? (
      <SkeletonGrid count={3} />
    ) : realtime.data ? (
      <>
        <div className={styles.threeCol}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Active Users · Last 30 Min</span>
            <span className={styles.kpiValue}>
              {formatNumber(realtime.data.activeUsers30m)}
            </span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Active Users · Last 5 Min</span>
            <span className={styles.kpiValue}>
              {formatNumber(realtime.data.activeUsers5m)}
            </span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Page Views · Last 30 Min</span>
            <span className={styles.kpiValue}>
              {formatNumber(realtime.data.pageViews30m)}
            </span>
          </div>
        </div>

        <div className={styles.twoCol}>
          <RankingList
            title="Active Page Titles"
            subtitle="Active users"
            items={realtime.data.activePages.map((p) => ({
              name: p.title,
              primary: p.activeUsers,
              secondary: `${formatNumber(p.views)} views`,
            }))}
            emptyText="No active visitors on pages in the last 30 minutes."
          />

          <RankingList
            title="Realtime Events"
            subtitle="Event count"
            items={realtime.data.events.map((e) => ({
              name: e.eventName,
              primary: e.count,
            }))}
            emptyText="No realtime events recorded in the last 30 minutes."
          />
        </div>

        <div className={styles.twoCol}>
          <RankingList
            title="Active Countries"
            subtitle="Users"
            items={realtime.data.countries.map((c) => ({
              name: c.country,
              primary: c.activeUsers,
            }))}
            emptyText="No geographic activity in the last 30 minutes."
          />

          <RankingList
            title="Device Categories"
            subtitle="Users"
            items={realtime.data.devices.map((d) => ({
              name: d.device,
              primary: d.activeUsers,
            }))}
            emptyText="No device data in the last 30 minutes."
          />
        </div>
      </>
    ) : null}
  </>
);

/* ============================================================================
 * 3. AUDIENCE
 * ============================================================================ */
function toRankingItems(rows: AudienceEntry[]) {
  return rows.map((r) => ({
    name: r.name,
    primary: r.users,
    secondary: `${formatNumber(r.sessions)} sess · ${formatPercent(r.engagementRate)}`,
  }));
}

export const AudienceSection = ({
  audience,
  onRetry,
}: {
  audience: LoadState<AudienceResponse>;
  onRetry: () => void;
}) => (
  <>
    {audience.error && <ErrorBanner message={audience.error} onRetry={onRetry} />}

    {audience.loading && !audience.data ? (
      <SkeletonGrid count={4} />
    ) : audience.data ? (
      <>
        <div className={styles.twoCol}>
          <RankingList
            title="Countries"
            subtitle="Users · Sessions · Eng."
            items={toRankingItems(audience.data.countries)}
            emptyText="No country data for this period."
          />
          <RankingList
            title="Cities"
            subtitle="Users · Sessions · Eng."
            items={toRankingItems(audience.data.cities)}
            emptyText="No city data available for this period."
          />
        </div>

        <div className={styles.threeCol}>
          <RankingList
            title="Device Categories"
            subtitle="Users"
            items={toRankingItems(audience.data.devices)}
            emptyText="No device data."
          />
          <RankingList
            title="Browsers"
            subtitle="Users"
            items={toRankingItems(audience.data.browsers)}
            emptyText="No browser data."
          />
          <RankingList
            title="Operating Systems"
            subtitle="Users"
            items={toRankingItems(audience.data.operatingSystems)}
            emptyText="No OS data."
          />
        </div>
      </>
    ) : null}
  </>
);

/* ============================================================================
 * 4. TRAFFIC ACQUISITION
 * ============================================================================ */
export const TrafficSection = ({
  traffic,
  onRetry,
}: {
  traffic: LoadState<TrafficResponse>;
  onRetry: () => void;
}) => (
  <>
    {traffic.error && <ErrorBanner message={traffic.error} onRetry={onRetry} />}

    {traffic.loading && !traffic.data ? (
      <SkeletonGrid count={4} />
    ) : traffic.data ? (
      <>
        <TrafficChart
          data={traffic.data.timeseries}
          rangeLabel={traffic.data.range.label}
        />

        <div className={styles.twoCol}>
          <RankingList
            title="Acquisition Channels"
            subtitle="Direct, Organic, Referral, Social, Campaign"
            items={traffic.data.channels.map((c) => ({
              name: c.channel,
              primary: c.sessions,
              secondary: `${formatNumber(c.users)} users · ${formatPercent(c.engagementRate)}`,
            }))}
            emptyText="No channel acquisition data recorded."
          />

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>LinkedIn Attribution</h3>
              <span className={styles.panelSub}>Identifiable LinkedIn referrals</span>
            </div>
            <div className={styles.threeCol}>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Sessions</span>
                <span className={styles.kpiValue}>
                  {formatNumber(traffic.data.linkedin.sessions)}
                </span>
              </div>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Users</span>
                <span className={styles.kpiValue}>
                  {formatNumber(traffic.data.linkedin.users)}
                </span>
              </div>
              <div className={styles.kpiCard}>
                <span className={styles.kpiLabel}>Engagement</span>
                <span className={styles.kpiValue}>
                  {formatPercent(traffic.data.linkedin.engagementRate)}
                </span>
              </div>
            </div>
            {traffic.data.linkedin.sources.length === 0 ? (
              <div className={styles.emptyState}>
                No identifiable LinkedIn referral sessions recorded in this period.
              </div>
            ) : (
              <ul className={styles.barList}>
                {traffic.data.linkedin.sources.map((src) => (
                  <li key={src.sourceMedium} className={styles.barTop}>
                    <span className={styles.barName}>{src.sourceMedium}</span>
                    <span className={styles.barMetric}>
                      {formatNumber(src.sessions)} sessions ·{" "}
                      {formatNumber(src.users)} users
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Source / Medium Breakdown</h3>
            <span className={styles.panelSub}>Top 25 sources</span>
          </div>

          {traffic.data.sourceMedium.length === 0 ? (
            <div className={styles.emptyState}>
              No source / medium data recorded for this period.
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Source / Medium</th>
                    <th className={styles.numCol}>Sessions</th>
                    <th className={styles.numCol}>Users</th>
                    <th className={styles.numCol}>Page Views</th>
                    <th className={styles.numCol}>Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {traffic.data.sourceMedium.map((row) => (
                    <tr key={row.sourceMedium}>
                      <td className={styles.primaryCell}>{row.sourceMedium}</td>
                      <td className={styles.numCol}>{formatNumber(row.sessions)}</td>
                      <td className={styles.numCol}>{formatNumber(row.users)}</td>
                      <td className={styles.numCol}>{formatNumber(row.pageViews)}</td>
                      <td className={styles.numCol}>
                        {formatPercent(row.engagementRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    ) : null}
  </>
);

/* ============================================================================
 * 5. MOST VISITED PAGES
 * ============================================================================ */
export const PagesSection = ({
  pages,
  onRetry,
}: {
  pages: LoadState<PagesResponse>;
  onRetry: () => void;
}) => {
  const [query, setQuery] = useState("");

  const filtered = (pages.data?.pages ?? []).filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.path.toLowerCase().includes(q) || p.title.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {pages.error && <ErrorBanner message={pages.error} onRetry={onRetry} />}

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h3 className={styles.panelTitle}>Most Visited Pages</h3>
            <span className={styles.panelSub}>
              Public portfolio routes (private /admin routes excluded)
            </span>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter path or title…"
            className={styles.searchInput}
            aria-label="Filter pages"
          />
        </div>

        {pages.loading && !pages.data ? (
          <div className={styles.skeleton} style={{ height: 220 }} />
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            {query
              ? "No pages match that filter."
              : "No page view records found for this date range."}
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Page</th>
                  <th className={styles.numCol}>Views</th>
                  <th className={styles.numCol}>Users</th>
                  <th className={styles.numCol}>Avg Engagement</th>
                  <th className={styles.numCol}>Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={`${row.path}::${row.title}`}>
                    <td>
                      <span className={styles.primaryCell}>{row.title}</span>
                      <span className={styles.subCell}>{row.path}</span>
                    </td>
                    <td className={styles.numCol}>{formatNumber(row.views)}</td>
                    <td className={styles.numCol}>{formatNumber(row.users)}</td>
                    <td className={styles.numCol}>
                      {formatDuration(row.avgEngagementTime)}
                    </td>
                    <td className={styles.numCol}>
                      {formatPercent(row.engagementRate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

/* ============================================================================
 * 6. PROJECT ENGAGEMENT
 * ============================================================================ */
export const ProjectsSection = ({
  events,
  onRetry,
}: {
  events: LoadState<EventsResponse>;
  onRetry: () => void;
}) => (
  <>
    {events.error && <ErrorBanner message={events.error} onRetry={onRetry} />}

    {events.loading && !events.data ? (
      <SkeletonGrid count={4} />
    ) : events.data ? (
      <>
        <div className={styles.threeCol}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Project Detail Views</span>
            <span className={styles.kpiValue}>
              {formatNumber(events.data.engagementSummary.projectViews)}
            </span>
            <span className={styles.kpiPrev}>project_view events</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Project Card Clicks</span>
            <span className={styles.kpiValue}>
              {formatNumber(events.data.engagementSummary.projectClicks)}
            </span>
            <span className={styles.kpiPrev}>project_click events</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>External Live Site Visits</span>
            <span className={styles.kpiValue}>
              {formatNumber(events.data.engagementSummary.externalProjectClicks)}
            </span>
            <span className={styles.kpiPrev}>external_project_click events</span>
          </div>
        </div>

        {!events.data.customDimensionsActive && (
          <div className={styles.infoBanner}>
            Per-project case study page views are shown live below. To also
            break down <code>project_click</code> and{" "}
            <code>external_project_click</code> counts per project name, register{" "}
            <code>project_name</code> as an Event-scoped Custom Dimension in GA4
            Admin → Custom definitions.
          </div>
        )}

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Portfolio Project Engagement</h3>
            <span className={styles.panelSub}>
              Case study views &amp; outbound clicks across all 9 projects
            </span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th className={styles.numCol}>Case Study Views</th>
                  <th className={styles.numCol}>Users</th>
                  <th className={styles.numCol}>Avg Time</th>
                  <th className={styles.numCol}>Project Clicks</th>
                  <th className={styles.numCol}>External Visits</th>
                </tr>
              </thead>
              <tbody>
                {events.data.projects.map((proj) => (
                  <tr key={proj.slug}>
                    <td>
                      <span className={styles.primaryCell}>{proj.title}</span>
                      <span className={styles.subCell}>
                        {proj.category} · {proj.path}
                      </span>
                    </td>
                    <td className={styles.numCol}>{formatNumber(proj.pageViews)}</td>
                    <td className={styles.numCol}>{formatNumber(proj.users)}</td>
                    <td className={styles.numCol}>
                      {formatDuration(proj.avgEngagementTime)}
                    </td>
                    <td className={styles.numCol}>
                      {events.data?.customDimensionsActive
                        ? formatNumber(proj.projectClicks)
                        : "—"}
                    </td>
                    <td className={styles.numCol}>
                      {events.data?.customDimensionsActive
                        ? formatNumber(proj.externalClicks)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    ) : null}
  </>
);

/* ============================================================================
 * 7. ENGAGEMENT & CONVERSIONS
 * ============================================================================ */
export const EngagementSection = ({
  events,
  onRetry,
}: {
  events: LoadState<EventsResponse>;
  onRetry: () => void;
}) => (
  <>
    {events.error && <ErrorBanner message={events.error} onRetry={onRetry} />}

    {events.loading && !events.data ? (
      <SkeletonGrid count={4} />
    ) : events.data ? (
      <>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>CV / Résumé Downloads</span>
            <span className={styles.kpiValue}>
              {formatNumber(events.data.engagementSummary.cvDownloads)}
            </span>
            <span className={styles.kpiPrev}>file_download</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>LinkedIn Clicks</span>
            <span className={styles.kpiValue}>
              {formatNumber(events.data.engagementSummary.linkedinClicks)}
            </span>
            <span className={styles.kpiPrev}>linkedin_click</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>GitHub Clicks</span>
            <span className={styles.kpiValue}>
              {formatNumber(events.data.engagementSummary.githubClicks)}
            </span>
            <span className={styles.kpiPrev}>github_click</span>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Contact Actions</span>
            <span className={styles.kpiValue}>
              {formatNumber(events.data.engagementSummary.contactClicks)}
            </span>
            <span className={styles.kpiPrev}>email · copy · phone · X</span>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>All Tracked Events</h3>
            <span className={styles.panelSub}>
              Ranked by frequency for selected period
            </span>
          </div>

          {events.data.events.length === 0 ? (
            <div className={styles.emptyState}>
              No events recorded for this date range yet.
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th className={styles.numCol}>Total Count</th>
                    <th className={styles.numCol}>Unique Users</th>
                  </tr>
                </thead>
                <tbody>
                  {events.data.events.map((evt) => (
                    <tr key={evt.eventName}>
                      <td className={styles.primaryCell}>{evt.eventName}</td>
                      <td className={styles.numCol}>{formatNumber(evt.count)}</td>
                      <td className={styles.numCol}>{formatNumber(evt.users)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    ) : null}
  </>
);
