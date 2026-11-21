import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyticsTracker from "./components/AnalyticsTracker";
import ScrollManager from "./components/ScrollManager";
import SmoothScroll from "./components/SmoothScroll";
import HomePage from "./pages/HomePage";

const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const AdminLoginPage = lazy(
  () => import("./admin/components/AdminLoginPage")
);
const AdminDashboardPage = lazy(
  () => import("./admin/components/AdminDashboardPage")
);

const RouteFallback = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-subtle)",
      fontSize: "0.875rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}
  >
    Loading…
  </div>
);

const PublicLayout = () => (
  <>
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
    <AnalyticsTracker />
    <SmoothScroll />
    <ScrollManager />
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Private Analytics Dashboard — isolated from public shell and excluded from GA4 */}
        <Route
          path="/admin/analytics/login"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AdminLoginPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/analytics/:section"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />

        {/* Public Portfolio */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/work/:slug"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ProjectDetail />
              </Suspense>
            }
          />
          <Route
            path="/myworks"
            element={
              <Suspense fallback={<RouteFallback />}>
                <MyWorks />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
