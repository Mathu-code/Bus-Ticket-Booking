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
import Profile from "./pages/Profile"; // comment/remove if you don't use
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
        <Route path="*" element={<Navigate to="/" />} />
  
      </Routes>
          </div>
      <Footer />
    </div>
    </BrowserRouter>
  );
}
