import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  BarChart3,
  FileText,
  FolderKanban,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  MousePointerClick,
  RefreshCw,
  X,
} from "lucide-react";
import Monogram from "../../components/Monogram";
import {
  AdminApiError,
  clearClientAnalyticsCache,
  fetchAudience,
  fetchEvents,
  fetchOverview,
  fetchPages,
  fetchRealtime,
  fetchSession,
  fetchTraffic,
  logoutSession,
} from "../api";
import { daysAgoIsoUtc, formatTimestamp, todayIsoUtc } from "../format";
import type {
  AudienceResponse,
  DashboardSection,
  DatePreset,
  DateRangeQuery,
  EventsResponse,
  OverviewResponse,
  PagesResponse,
  RealtimeResponse,
  SessionResponse,
  TrafficResponse,
} from "../types";
import { useNoIndex } from "../useNoIndex";
import {
  AudienceSection,
  EngagementSection,
  OverviewSection,
  PagesSection,
  ProjectsSection,
  RealtimeSection,
  TrafficSection,
} from "./DashboardSections";
import styles from "./AdminDashboardPage.module.css";

interface NavItem {
  id: DashboardSection;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    path: "/admin/analytics",
    icon: <LayoutDashboard size={16} aria-hidden="true" />,
  },
  {
    id: "realtime",
    label: "Realtime",
    path: "/admin/analytics/realtime",
    icon: <Activity size={16} aria-hidden="true" />,
  },
  {
    id: "audience",
    label: "Audience",
    path: "/admin/analytics/audience",
    icon: <Globe size={16} aria-hidden="true" />,
  },
  {
    id: "traffic",
    label: "Traffic",
    path: "/admin/analytics/traffic",
    icon: <BarChart3 size={16} aria-hidden="true" />,
  },
  {
    id: "pages",
    label: "Pages",
    path: "/admin/analytics/pages",
    icon: <FileText size={16} aria-hidden="true" />,
  },
  {
    id: "projects",
    label: "Projects",
    path: "/admin/analytics/projects",
    icon: <FolderKanban size={16} aria-hidden="true" />,
  },
  {
    id: "engagement",
    label: "Engagement",
    path: "/admin/analytics/engagement",
    icon: <MousePointerClick size={16} aria-hidden="true" />,
  },
];

const SECTION_TITLES: Record<DashboardSection, string> = {
  overview: "Overview",
  realtime: "Realtime Activity",
  audience: "Audience Insights",
  traffic: "Traffic Acquisition",
  pages: "Most Visited Pages",
  projects: "Project Engagement",
  engagement: "Engagement & Actions",
};

const PRESETS: Array<{ id: DatePreset; label: string }> = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
  { id: "custom", label: "Custom" },
];

interface AsyncSlice<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function createSlice<T>(): AsyncSlice<T> {
  return { data: null, loading: false, error: null };
}

function resolveSection(raw?: string): DashboardSection {
  if (!raw) return "overview";
  const match = NAV_ITEMS.find((item) => item.id === raw);
  return match ? match.id : "overview";
}

export const AdminDashboardPage = () => {
  const { section: rawSection } = useParams<{ section?: string }>();
  const section = resolveSection(rawSection);
  const navigate = useNavigate();

  useNoIndex(`${SECTION_TITLES[section]} — Private Analytics`);

  const [session, setSession] = useState<SessionResponse | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefreshRealtime, setAutoRefreshRealtime] = useState(true);

  const [range, setRange] = useState<DateRangeQuery>({ preset: "30d" });
  const [customStart, setCustomStart] = useState(() => daysAgoIsoUtc(14));
  const [customEnd, setCustomEnd] = useState(() => todayIsoUtc());
  const [customError, setCustomError] = useState<string | null>(null);

  const [overview, setOverview] = useState<AsyncSlice<OverviewResponse>>(createSlice);
  const [traffic, setTraffic] = useState<AsyncSlice<TrafficResponse>>(createSlice);
  const [realtime, setRealtime] = useState<AsyncSlice<RealtimeResponse>>(createSlice);
  const [pages, setPages] = useState<AsyncSlice<PagesResponse>>(createSlice);
  const [audience, setAudience] = useState<AsyncSlice<AudienceResponse>>(createSlice);
  const [events, setEvents] = useState<AsyncSlice<EventsResponse>>(createSlice);

  const latestUpdatedAt =
    section === "realtime"
      ? realtime.data?.updatedAt
      : overview.data?.updatedAt ??
      traffic.data?.updatedAt ??
      pages.data?.updatedAt ??
      audience.data?.updatedAt ??
      events.data?.updatedAt ??
      null;

  const handleAuthFailure = useCallback(
    (err: unknown): boolean => {
      if (err instanceof AdminApiError && (err.status === 401 || err.status === 403)) {
        clearClientAnalyticsCache();
        navigate("/admin/analytics/login?error=session_expired", { replace: true });
        return true;
      }
      return false;
    },
    [navigate]
  );

  // Verify server-side session on mount
  useEffect(() => {
    let mounted = true;
    fetchSession()
      .then((res) => {
        if (!mounted) return;
        if (!res.authenticated) {
          const returnTo = encodeURIComponent(window.location.pathname);
          navigate(`/admin/analytics/login?returnTo=${returnTo}`, { replace: true });
          return;
        }
        setSession(res);
        setAuthChecking(false);
      })
      .catch(() => {
        if (!mounted) return;
        navigate("/admin/analytics/login", { replace: true });
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const loadSlice = useCallback(
    async <T,>(
      setter: React.Dispatch<React.SetStateAction<AsyncSlice<T>>>,
      fetcher: () => Promise<T>
    ) => {
      setter((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetcher();
        setter({ data, loading: false, error: null });
      } catch (err) {
        if (handleAuthFailure(err)) return;
        const message =
          err instanceof AdminApiError
            ? err.message
            : "Unable to load analytics data.";
        setter((prev) => ({ ...prev, loading: false, error: message }));
      }
    },
    [handleAuthFailure]
  );

  const loadSectionData = useCallback(
    async (targetSection: DashboardSection, activeRange: DateRangeQuery, force = false) => {
      const tasks: Promise<void>[] = [];

      if (targetSection === "overview") {
        tasks.push(
          loadSlice(setOverview, () => fetchOverview(activeRange, force)),
          loadSlice(setTraffic, () => fetchTraffic(activeRange, force)),
          loadSlice(setPages, () => fetchPages(activeRange, force)),
          loadSlice(setRealtime, () => fetchRealtime(force))
        );
      } else if (targetSection === "realtime") {
        tasks.push(loadSlice(setRealtime, () => fetchRealtime(force)));
      } else if (targetSection === "audience") {
        tasks.push(loadSlice(setAudience, () => fetchAudience(activeRange, force)));
      } else if (targetSection === "traffic") {
        tasks.push(loadSlice(setTraffic, () => fetchTraffic(activeRange, force)));
      } else if (targetSection === "pages") {
        tasks.push(loadSlice(setPages, () => fetchPages(activeRange, force)));
      } else if (targetSection === "projects" || targetSection === "engagement") {
        tasks.push(loadSlice(setEvents, () => fetchEvents(activeRange, force)));
      }

      await Promise.all(tasks);
    },
    [loadSlice]
  );

  useEffect(() => {
    if (authChecking || !session?.authenticated) return;
    if (range.preset === "custom" && (!range.startDate || !range.endDate)) return;
    void loadSectionData(section, range, false);
  }, [authChecking, session?.authenticated, section, range, loadSectionData]);

  // Poll realtime every 45s while Overview or Realtime is visible in an active tab
  const realtimeSectionRef = useRef(section);
  realtimeSectionRef.current = section;

  useEffect(() => {
    if (authChecking || !session?.authenticated || !autoRefreshRealtime) return;
    if (section !== "realtime" && section !== "overview") return;

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (
        realtimeSectionRef.current === "realtime" ||
        realtimeSectionRef.current === "overview"
      ) {
        void loadSlice(setRealtime, () => fetchRealtime(false));
      }
    }, 45_000);

    return () => window.clearInterval(interval);
  }, [authChecking, session?.authenticated, autoRefreshRealtime, section, loadSlice]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    clearClientAnalyticsCache();
    await loadSectionData(section, range, true);
    setRefreshing(false);
  };

  const handlePresetClick = (preset: DatePreset) => {
    setCustomError(null);
    if (preset === "custom") {
      setRange({ preset: "custom", startDate: customStart, endDate: customEnd });
    } else {
      setRange({ preset });
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStart || !customEnd) {
      setCustomError("Select both start and end dates.");
      return;
    }
    if (customStart > customEnd) {
      setCustomError("Start date must be on or before end date.");
      return;
    }
    setCustomError(null);
    setRange({ preset: "custom", startDate: customStart, endDate: customEnd });
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutSession(session?.csrfToken ?? "");
    } finally {
      navigate("/admin/analytics/login", { replace: true });
    }
  };

  if (authChecking) {
    return <div className={styles.fullCenter}>Verifying authorized session…</div>;
  }

  const initials = (session?.user?.name ?? "CE")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={styles.shell}>
      {drawerOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ""}`}
        aria-label="Analytics navigation"
      >
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <Monogram size={28} />
            <div className={styles.brandText}>
              <span className={styles.brandName}>Analytics</span>
              <span className={styles.brandSub}>GA4 · Private</span>
            </div>
          </div>

          <nav>
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={`${styles.navItem} ${section === item.id ? styles.navItemActive : ""
                      }`}
                    aria-current={section === item.id ? "page" : undefined}
                  >
                    <span className={styles.navItemLeft}>
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    {item.id === "realtime" && (
                      <span className={styles.livePill} aria-hidden="true" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          {session?.user && (
            <div className={styles.userCard}>
              {session.user.picture ? (
                <img
                  src={session.user.picture}
                  alt={session.user.name}
                  className={styles.avatar}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className={styles.avatarFallback}>{initials}</span>
              )}
              <div className={styles.userInfo}>
                <span className={styles.userName}>{session.user.name}</span>
                <span className={styles.userEmail}>{session.user.email}</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={styles.logoutBtn}
          >
            <LogOut size={14} aria-hidden="true" />
            <span>{loggingOut ? "Signing out…" : "Sign out"}</span>
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topBar}>
          <div className={styles.topLeft}>
            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              className={styles.mobileMenuBtn}
              aria-label={drawerOpen ? "Close sidebar" : "Open sidebar"}
            >
              {drawerOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h1 className={styles.pageHeading}>{SECTION_TITLES[section]}</h1>
          </div>

          <div className={styles.topControls}>
            {section !== "realtime" && (
              <div className={styles.rangeGroup} role="group" aria-label="Date range">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetClick(preset.id)}
                    className={`${styles.rangeBtn} ${range.preset === preset.id ? styles.rangeBtnActive : ""
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing}
              className={styles.refreshBtn}
            >
              <RefreshCw
                size={13}
                className={refreshing ? styles.spin : undefined}
                aria-hidden="true"
              />
              <span>Refresh</span>
            </button>

            <span className={styles.updatedMeta}>
              Updated {formatTimestamp(latestUpdatedAt ?? null)}
            </span>
          </div>
        </header>

        {section !== "realtime" && range.preset === "custom" && (
          <form onSubmit={handleApplyCustom} className={styles.customDateBar}>
            <label>
              From{" "}
              <input
                type="date"
                value={customStart}
                max={todayIsoUtc()}
                onChange={(e) => setCustomStart(e.target.value)}
                className={styles.dateInput}
              />
            </label>
            <label>
              To{" "}
              <input
                type="date"
                value={customEnd}
                max={todayIsoUtc()}
                onChange={(e) => setCustomEnd(e.target.value)}
                className={styles.dateInput}
              />
            </label>
            <button type="submit" className={styles.applyBtn}>
              Apply
            </button>
            {customError && (
              <span style={{ color: "#d97686" }}>{customError}</span>
            )}
          </form>
        )}

        <main className={styles.content}>
          {session && !session.ga4Configured && (
            <div className={styles.infoBanner}>
              <strong>GA4 Reporting API setup pending:</strong>{" "}
              {session.ga4MissingKeys && session.ga4MissingKeys.length > 0 ? (
                <>
                  Missing or invalid Netlify Function env var(s):{" "}
                  <code>{session.ga4MissingKeys.join(", ")}</code>. Ensure the{" "}
                  <strong>Functions</strong> scope is enabled in Netlify and
                  trigger a redeploy.
                </>
              ) : (
                <>
                  Add <code>GA4_PROPERTY_ID=565407830</code>,{" "}
                  <code>GA4_SERVICE_ACCOUNT_EMAIL</code>, and{" "}
                  <code>GA4_PRIVATE_KEY</code> in your Netlify environment
                  variables and grant the service account <strong>Viewer</strong>{" "}
                  access on your GA4 property.
                </>
              )}
            </div>
          )}

          {section === "overview" && (
            <OverviewSection
              overview={overview}
              traffic={traffic}
              realtime={realtime}
              pages={pages}
              onRetry={handleManualRefresh}
              onOpenRealtime={() => navigate("/admin/analytics/realtime")}
            />
          )}

          {section === "realtime" && (
            <RealtimeSection
              realtime={realtime}
              autoRefresh={autoRefreshRealtime}
              onToggleAutoRefresh={() => setAutoRefreshRealtime((v) => !v)}
              onRetry={handleManualRefresh}
            />
          )}

          {section === "audience" && (
            <AudienceSection audience={audience} onRetry={handleManualRefresh} />
          )}

          {section === "traffic" && (
            <TrafficSection traffic={traffic} onRetry={handleManualRefresh} />
          )}

          {section === "pages" && (
            <PagesSection pages={pages} onRetry={handleManualRefresh} />
          )}

          {section === "projects" && (
            <ProjectsSection events={events} onRetry={handleManualRefresh} />
          )}

          {section === "engagement" && (
            <EngagementSection events={events} onRetry={handleManualRefresh} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
