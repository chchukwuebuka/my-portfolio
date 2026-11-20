import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollManager from "./components/ScrollManager";
import SmoothScroll from "./components/SmoothScroll";
import HomePage from "./pages/HomePage";

const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const MyWorks = lazy(() => import("./pages/MyWorks"));

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

const App = () => {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <ScrollManager />
      <Navbar />
      <Routes>
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
