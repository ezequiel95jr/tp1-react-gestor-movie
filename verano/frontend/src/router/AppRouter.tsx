import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import AdminShell from "../components/layout/AdminShell";
import HomePage from "../pages/HomePage";
import ReportsPage from "../pages/ReportsPage";
import AboutPage from "../pages/AboutPage";
import ReportDetailPage from "../pages/ReportDetailPage";
import CreateReportPage from "../pages/CreateReportPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";
import GuestRoute from "./GuestRoute";
import MapReportsPage from "../pages/MapReport";
import AdminPage from "../pages/AdminPage";
import AdminRoute from "./AdminRoute";
import StatsPage from "../pages/StatsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas con Layout (Header + padding + Footer) */}
        <Route element={<Layout />}>
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/"         element={<HomePage />} />
          <Route path="/reports"  element={<ReportsPage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/details/:id" element={<ReportDetailPage />} />
          <Route path="/map"      element={<MapReportsPage />} />
          <Route path="/create"   element={<ProtectedRoute><CreateReportPage /></ProtectedRoute>} />
          <Route path="/reports/:id/edit" element={<ProtectedRoute><CreateReportPage /></ProtectedRoute>} />
          <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>

        {/* Rutas admin con AdminShell (Header + sidebar, sin padding extra) */}
        <Route
          path="/admin"
          element={<AdminRoute><AdminShell /></AdminRoute>}
        >
          <Route index element={<Navigate to="/admin/users" replace />} />
          <Route path="users" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="stats" element={<StatsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
