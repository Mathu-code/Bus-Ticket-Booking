import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BusSearch() {
  const [buses, setBuses] = useState([]);
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetch all unique routes for suggestions
  const fetchRouteSuggestions = async (searchTerm) => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/buses");
      const allBuses = res.data;
      
      // Extract unique routes and filter based on search term
      const uniqueRoutes = [...new Set(allBuses.map(bus => bus.route))];
      const filtered = uniqueRoutes.filter(r => 
        r.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
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
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const params = {};
      if (route) params.route = route;
      if (date) params.date = date;
      
      const res = await axios.get("http://localhost:5000/api/buses", { params });
      setBuses(res.data);
      
      if (res.data.length === 0) {
        setError("No buses found for your search criteria.");
      }
    } catch (err) {
      setError("Failed to fetch buses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch({ preventDefault: () => {} });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Buses</h1>
      
      <form className="flex gap-2 mb-4" onSubmit={handleSearch}>
        <div className="flex-1 relative">
          <input 
            className="border p-2 w-full" 
            placeholder="Enter route (e.g. Colombo-Kandy)" 
            value={route} 
            onChange={handleRouteChange}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-t-0 rounded-b z-10 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 hover:bg-blue-100 cursor-pointer border-b last:border-b-0"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <input 
          className="border p-2" 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Search
        </button>
      </form>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      
      {loading && <div className="text-center">Loading...</div>}

      <div>
        {buses.length === 0 && !loading ? (
          <div className="text-center text-gray-600">No buses found</div>
        ) : (
          buses.map(bus => (
            <div key={bus._id} className="border rounded mb-3 p-3 flex flex-col gap-2">
              <div><b>{bus.name}</b> ({bus.route})</div>
              <div>Departure: {bus.date} {bus.departureTime}</div>
              <div>Price: Rs.{bus.price} | Seats left: {bus.availableSeats}</div>
              <button 
                onClick={() => navigate(`/book/${bus._id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}