import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BusSearch() {
  const [buses, setBuses] = useState([]);
  const [route, setRoute] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        <input 
          className="border p-2 flex-1" 
          placeholder="Route" 
          value={route} 
          onChange={e => setRoute(e.target.value)} 
        />
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