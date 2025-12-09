import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/Bus.png')", // Make sure the file is in public/
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for readability */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black/60">
        <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">BusGo - Online Bus Ticket Booking</h1>
        <p className="mb-6 text-lg text-blue-100">Book your bus seats easily. Fast, reliable, secure.</p>
        {!user ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-800 transition"
            onClick={() => navigate("/login")}
          >
            Log in to Book Tickets
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-green-800 transition"
            onClick={() => navigate("/bus-search")}
          >
            Search Buses
          </button>
        )}
      </div>
    </div>
  );
}
