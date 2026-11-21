export type DatePreset = "today" | "7d" | "30d" | "90d" | "custom";

export type DashboardSection =
  | "overview"
  | "realtime"
  | "audience"
  | "traffic"
  | "pages"
  | "projects"
  | "engagement";

export interface DateRangeQuery {
  preset: DatePreset;
  startDate?: string;
  endDate?: string;
}

export interface DateWindow {
  startDate: string;
  endDate: string;
}

export interface ResolvedDateRange {
  preset: DatePreset;
  label: string;
  current: DateWindow;
  previous: DateWindow;
  days: number;
}

export interface SessionUser {
  email: string;
  name: string;
  picture?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  oauthConfigured: boolean;
  ga4Configured: boolean;
  csrfToken?: string;
  expiresAt?: number;
  user?: SessionUser;
}

export interface MetricDelta {
  current: number;
  previous: number;
  changePercent: number | null;
}

export interface OverviewResponse {
  range: ResolvedDateRange;
  hasData: boolean;
  metrics: {
    totalUsers: MetricDelta;
    activeUsers: MetricDelta;
    newUsers: MetricDelta;
    sessions: MetricDelta;
    pageViews: MetricDelta;
    engagementRate: MetricDelta;
    avgEngagementTime: MetricDelta;
    eventCount: MetricDelta;
  };
  cached: boolean;
  updatedAt: string;
}

export interface TrafficPoint {
  date: string;
  previousDate: string;
  users: number;
  sessions: number;
  pageViews: number;
  previousUsers: number;
  previousSessions: number;
  previousPageViews: number;
}

export interface TrafficChannel {
  channel: string;
  sessions: number;
  users: number;
  engagementRate: number;
  pageViews: number;
}

export interface SourceMediumRow {
  sourceMedium: string;
  sessions: number;
  users: number;
  engagementRate: number;
  pageViews: number;
}

export interface TrafficResponse {
  range: ResolvedDateRange;
  timeseries: TrafficPoint[];
  channels: TrafficChannel[];
  sourceMedium: SourceMediumRow[];
  linkedin: {
    sessions: number;
    users: number;
    engagementRate: number;
    sources: SourceMediumRow[];
  };
  cached: boolean;
  updatedAt: string;
}

export interface RealtimeResponse {
  activeUsers30m: number;
  activeUsers5m: number;
  pageViews30m: number;
  activePages: Array<{ title: string; activeUsers: number; views: number }>;
  events: Array<{ eventName: string; count: number }>;
  countries: Array<{ country: string; activeUsers: number }>;
  devices: Array<{ device: string; activeUsers: number }>;
  cached: boolean;
  updatedAt: string;
}

export interface PageMetricRow {
  path: string;
  title: string;
  views: number;
  users: number;
  avgEngagementTime: number;
  engagementRate: number;
}

export interface PagesResponse {
  range: ResolvedDateRange;
  pages: PageMetricRow[];
  cached: boolean;
  updatedAt: string;
}

export interface AudienceEntry {
  name: string;
  users: number;
  sessions: number;
  engagementRate: number;
}

export interface AudienceResponse {
  range: ResolvedDateRange;
  countries: AudienceEntry[];
  cities: AudienceEntry[];
  devices: AudienceEntry[];
  browsers: AudienceEntry[];
  operatingSystems: AudienceEntry[];
  cached: boolean;
  updatedAt: string;
}

export interface ProjectMetricRow {
  slug: string;
  title: string;
  category: string;
  path: string;
  pageViews: number;
  users: number;
  avgEngagementTime: number;
  engagementRate: number;
  projectClicks: number;
  externalClicks: number;
  projectViewEvents: number;
}

export interface EventsResponse {
  range: ResolvedDateRange;
  customDimensionsActive: boolean;
  engagementSummary: {
    cvDownloads: number;
    linkedinClicks: number;
    githubClicks: number;
    contactClicks: number;
    projectViews: number;
    projectClicks: number;
    externalProjectClicks: number;
  };
  projects: ProjectMetricRow[];
  events: Array<{ eventName: string; count: number; users: number }>;
  cached: boolean;
  updatedAt: string;
}
