import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";

import BusSearch from "./pages/BusSearch";
import BookBus from "./pages/BookBus";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminUserEdit from "./pages/Admin/AdminUserEdit";
import AdminBusList from "./pages/Admin/AdminBusList";
import AdminBusCreate from "./pages/Admin/AdminBusCreate";
import AdminBusEdit from "./pages/Admin/AdminBusEdit";

export default function AppRoutes() {
  const user = useSelector(state => state.auth.user);

  return (
    <Routes>

      {/* ---------- AUTH (NO HEADER / FOOTER) ---------- */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Route>

      {/* ---------- MAIN APP (WITH HEADER / FOOTER) ---------- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bus-search" element={user ? <BusSearch /> : <Navigate to="/login" />} />
        <Route path="/book/:id" element={user ? <BookBus /> : <Navigate to="/login" />} />
        <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/edit/:id" element={<AdminUserEdit />} />
          <Route path="buses" element={<AdminBusList />} />
          <Route path="buses/create" element={<AdminBusCreate />} />
          <Route path="buses/edit/:id" element={<AdminBusEdit />} />
        </Route>
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
