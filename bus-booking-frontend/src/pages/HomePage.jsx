import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">BusGo - Online Bus Ticket Booking</h1>
        <p className="mb-6 text-lg">Book your bus seats easily. Fast, reliable, secure.</p>
        {!user ? (
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/login")}
          >
            Log in to Book Tickets
          </button>
        ) : (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
            onClick={() => navigate("/bus-search")}
          >
            Search Buses
          </button>
        )}
      </div>
    </div>
  );
}
