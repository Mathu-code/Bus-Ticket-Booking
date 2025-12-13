import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BusSearch from "./pages/BusSearch";
import BookBus from "./pages/BookBus";
import MyBookings from "./pages/MyBookings";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

// Admin Page Imports
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminUserEdit from './pages/Admin/AdminUserEdit';
import AdminBusList from "./pages/Admin/AdminBusList";
import AdminBusCreate from "./pages/Admin/AdminBusCreate";
import AdminBusEdit from "./pages/Admin/AdminBusEdit";


export default function App() {
  const user = useSelector(state => state.auth.user);

  return (
    <BrowserRouter>
         <div className="min-h-screen flex flex-col">
      <Header />
          <div className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/bus-search" element={user ? <BusSearch /> : <Navigate to="/login" />} />
        <Route path="/book/:id" element={user ? <BookBus /> : <Navigate to="/login" />} />
        <Route path="/my-bookings" element={user ? <MyBookings /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} /> {/* Redirect /admin to /admin/dashboard */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/edit/:id" element={<AdminUserEdit />} />
          <Route path="buses" element={<AdminBusList />} />
          <Route path="buses/create" element={<AdminBusCreate />} />
          <Route path="buses/edit/:id" element={<AdminBusEdit />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
  
      </Routes>
          </div>
      <Footer />
    </div>
    </BrowserRouter>
  );
}