import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Helper to format numbers with commas
const formatCurrency = (n) => n.toLocaleString("en-IN");

export default function BusSearch() {
  const [buses, setBuses] = useState([]);
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 🔥 Image modal state
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();

  // Fetch route suggestions
  const fetchRouteSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      // Fetch all buses to get unique routes for suggestions
      const res = await axios.get("http://localhost:5000/api/buses");
      const uniqueRoutes = [...new Set(res.data.map(bus => bus.route))];
      const filtered = uniqueRoutes.filter(r =>
        r.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  };

  const handleRouteChange = (e) => {
    const value = e.target.value;
    setRoute(value);
    fetchRouteSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setRoute(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (route) params.route = route;
      // Ensure date is sent in YYYY-MM-DD format if present
      if (date) params.date = date; 
      const res = await axios.get("http://localhost:5000/api/buses", { params });
      setBuses(res.data);
      if (!res.data.length) setError("No buses found for your search.");
    } catch (err) {
      console.error("Failed to fetch buses:", err);
      setError("Failed to fetch buses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, []);

  // Get today's date in YYYY-MM-DD format for min attribute on date input
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Buses</h1>

      {/* Search Bar */}
      <form className="flex gap-2 mb-4" onSubmit={handleSearch}>
        <div className="flex-1 relative">
          <input
            className="border p-2 w-full rounded"
            placeholder="Enter route (e.g. Jaffna-Colombo)"
            value={route}
            onChange={handleRouteChange}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border rounded z-10 shadow-lg">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={e => setDate(e.target.value)}
          min={getTodayDate()} // Set minimum date to today
        />

        <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition">
          Search
        </button>
      </form>

      {loading && <div className="text-center py-4 text-gray-600">Loading...</div>}
      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      {/* Bus Cards */}
      {buses.map(bus => (
        <div
          key={bus._id}
          className="mb-6 bg-white flex items-center rounded-xl shadow"
          style={{
            minHeight: "128px",
            padding: "0 1.5rem",
            boxShadow: "0 2px 12px 0 #0001",
          }}
        >
          {/* Image */}
          <div
            className="relative cursor-pointer mr-6"
            style={{
              width: 200,
              height: 112,
              flexShrink: 0,
              borderRadius: 8,
              overflow: "hidden",
            }}
            onClick={() => {
              setSelectedImage(bus.image || "/public/BusGo.png");
              setShowImage(true);
            }}
          >
            <img
              src={bus.image || "/public/BusGo.png"}
              alt="Bus"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs text-center py-1">
              View Bus Photo
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="font-bold text-xl mb-1">{bus.route}</div>
            {/* Format date for display */}
            <div>Date: {new Date(bus.date).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}</div>
            <div>Time: {bus.departureTime}</div>
            <div>Bus Type: {bus.busType || "Normal"}</div>
          </div>

          {/* Price/seats/button right */}
          <div className="flex flex-col items-end justify-center min-w-[150px] ml-8">
            <div className="text-xl font-bold text-blue-800 mb-1">
              Rs. {formatCurrency(bus.price)}
            </div>
            <div className="text-orange-600 font-semibold mb-2">
              Available Seats: {bus.availableSeats}
            </div>
            <button
              className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600 transition font-semibold"
              onClick={() => navigate(`/book/${bus._id}`)}
            >
              Book Seat
            </button>
          </div>
        </div>
      ))}

      {/* 🔥 FULL IMAGE MODAL */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setShowImage(false)}
        >
          <div className="relative max-w-4xl w-full p-4">
            <button
              className="absolute top-2 right-4 text-white text-3xl font-bold"
              onClick={() => setShowImage(false)}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Bus Full View"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}