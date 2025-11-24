import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BusSearch from "./pages/BusSearch";
import BookBus from "./pages/BookBus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* ...auth routes */}
        <Route path="/" element={<BusSearch />} />
        <Route path="/book/:id" element={<BookBus />} />
        <Route path="/my-bookings" element={<MyBookings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;