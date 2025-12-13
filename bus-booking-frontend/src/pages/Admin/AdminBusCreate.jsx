import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Assuming axios is installed and correctly imported

export default function AdminBusCreate() {
  const [busData, setBusData] = useState({
    name: "",          // Renamed 'name' to 'number' to match backend Bus.number
    route: "",           // Matches backend Bus.route
    status: "Active",    // Matches backend Bus.status, with a default value
    price: "",           // NEW: Required by backend
    totalSeats: "",      // NEW: Required by backend (replaces 'capacity' from previous versions for clarity)
    // availableSeats will be set to totalSeats on submission, not a separate input for creation
    date: "",            // NEW: Required by backend
    departureTime: "",   // NEW: Required by backend
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare data for submission, ensuring numbers are numbers and setting availableSeats
    const dataToSend = {
      ...busData,
      totalSeats: Number(busData.totalSeats), // Convert to number
      price: Number(busData.price),           // Convert to number
      availableSeats: Number(busData.totalSeats), // On creation, available seats are usually all total seats
    };

    // Basic client-side validation (optional, backend will also validate)
    for (const key in dataToSend) {
      // Skip availableSeats in this check since it's derived
      if (key !== 'availableSeats' && (dataToSend[key] === "" || dataToSend[key] === null || dataToSend[key] === undefined)) {
        setError(`Please fill in the ${key} field.`);
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Hitting the POST http://localhost:5000/api/buses endpoint
      await axios.post('http://localhost:5000/api/buses', dataToSend, config);
      alert("Bus created successfully!");
      navigate("/admin/buses"); // Redirect to bus list after creation
    } catch (err) {
      console.error("Error creating bus:", err);
      // Attempt to get a more specific error message from the backend response
      setError(err.response?.data?.msg || "Failed to create bus. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Bus</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Bus Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={busData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="route" className="block text-sm font-medium text-gray-700">Route</label>
          <input
            type="text"
            id="route"
            name="route"
            value={busData.route}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="totalSeats" className="block text-sm font-medium text-gray-700">Total Seats</label>
          <input
            type="number"
            id="totalSeats"
            name="totalSeats"
            value={busData.totalSeats}
            onChange={handleChange}
            required
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (per seat)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={busData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01" // Allows for decimal prices
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={busData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">Departure Time</label>
          <input
            type="time"
            id="departureTime"
            name="departureTime"
            value={busData.departureTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={busData.status}
            onChange={handleChange}
            required // Status is also a required field
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/buses")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Bus"}
          </button>
        </div>
      </form>
    </div>
  );
}