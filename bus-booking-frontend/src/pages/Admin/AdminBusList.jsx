import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assuming axios is installed and correctly imported

export default function AdminBusList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const navigate = useNavigate();

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { // Add params for query parameters
          search: searchQuery, // Send the search query
        }
      };
      // Hitting the GET /api/buses endpoint which is protected by adminMiddleware
      const response = await axios.get('http://localhost:5000/api/buses', config);
      setBuses(response.data);
    } catch (err) {
      console.error("Error fetching buses:", err);
      setError(err.response?.data?.msg || "Failed to fetch buses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce the search input to avoid excessive API calls
    const handler = setTimeout(() => {
      fetchBuses();
    }, 500); // Wait 500ms after the user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // Rerun fetchBuses when searchQuery changes

  const handleDeleteBus = async (busId) => {
    if (window.confirm("Are you sure you want to delete this bus? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // Hitting the DELETE /api/buses/:id endpoint
        await axios.delete(`http://localhost:5000/api/buses/${busId}`, config);
        setBuses(buses.filter((bus) => bus._id !== busId));
        alert("Bus deleted successfully!");
      } catch (err) {
        console.error("Error deleting bus:", err);
        alert("Failed to delete bus: " + (err.response?.data?.msg || err.message));
      }
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading buses...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Buses</h1>

      <div className="flex justify-between items-center mb-4"> {/* Adjusted for search and button alignment */}
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, route or status..."
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => navigate("/admin/buses/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
        >
          Add New Bus
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b border-gray-200">Bus Name</th>
              <th className="py-3 px-6 border-b border-gray-200">Route</th>
              <th className="py-3 px-6 border-b border-gray-200">Seats</th> {/* Simplified header */}
              <th className="py-3 px-6 border-b border-gray-200">Price</th>
              <th className="py-3 px-6 border-b border-gray-200">Date</th>
              <th className="py-3 px-6 border-b border-gray-200">Time</th> {/* Simplified header */}
              <th className="py-3 px-6 border-b border-gray-200">Status</th>
              <th className="py-3 px-6 border-b border-gray-200 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-base font-normal"> {/* Updated font styles */}
            {buses.length === 0 && !loading && !error ? (
              <tr>
                <td colSpan="8" className="py-4 px-6 text-center text-gray-600">No buses found.</td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{bus.name}</td> {/* Removed whitespace-nowrap */}
                  <td className="py-3 px-6">{bus.route}</td>
                  <td className="py-3 px-6">{bus.availableSeats}/{bus.totalSeats}</td> {/* Combined seats */}
                  <td className="py-3 px-6">{bus.price}</td>
                  <td className="py-3 px-6">
                    {bus.date ? new Date(bus.date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 px-6">{bus.departureTime}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      bus.status === "Active" ? "bg-green-200 text-green-800" :
                      bus.status === "Maintenance" ? "bg-orange-200 text-orange-800" :
                      "bg-red-200 text-red-800"
                    }`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/buses/edit/${bus._id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBus(bus._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}