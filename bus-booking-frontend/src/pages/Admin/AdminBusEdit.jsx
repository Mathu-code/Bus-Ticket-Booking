import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Using direct axios import as typically configured

export default function AdminBusEdit() {
  const { id } = useParams(); // Get bus ID from URL
  const navigate = useNavigate();
  const [busData, setBusData] = useState({
    name: "",
    route: "",
    status: "Active",
    price: "",
    totalSeats: "",
    availableSeats: "", // Ensure this is part of the state as it's required by backend
    date: "",
    departureTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusDetails = async () => {
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
        };
        // Hitting the GET http://localhost:5000/api/buses/:id endpoint
        const response = await axios.get(`http://localhost:5000/api/buses/${id}`, config);
        
        // Format date and time for input fields
        const fetchedBus = response.data;
        const formattedDate = fetchedBus.date ? new Date(fetchedBus.date).toISOString().split('T')[0] : '';
        const formattedTime = fetchedBus.departureTime || '';

        setBusData({
          name: fetchedBus.name || "",
          route: fetchedBus.route || "",
          status: fetchedBus.status || "Active",
          price: fetchedBus.price || "",
          totalSeats: fetchedBus.totalSeats || "",
          availableSeats: fetchedBus.availableSeats || "", // Initialize availableSeats from fetched data
          date: formattedDate,
          departureTime: formattedTime,
        });
      } catch (err) {
        console.error("Error fetching bus details:", err);
        setError(err.response?.data?.msg || "Failed to fetch bus details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBusDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Prepare data for submission, ensuring numbers are numbers
    const dataToSend = {
      ...busData,
      totalSeats: Number(busData.totalSeats),
      price: Number(busData.price),
      availableSeats: Number(busData.availableSeats), // Ensure availableSeats is also a number
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        setSubmitting(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Hitting the PUT http://localhost:5000/api/buses/:id endpoint for update
      await axios.put(`http://localhost:5000/api/buses/${id}`, dataToSend, config);
      alert("Bus updated successfully!");
      navigate("/admin/buses"); // Redirect to bus list after update
    } catch (err) {
      console.error("Error updating bus:", err);
      setError(err.response?.data?.msg || "Failed to update bus. Check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading bus details...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  // Check if busData.name is empty AND not loading AND no error, indicates bus not found.
  if (!busData.name && !loading && !error) return <div className="text-center py-8 text-gray-600">Bus not found.</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Bus (ID: {id})</h1>

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
          <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700">Available Seats</label>
          <input
            type="number"
            id="availableSeats"
            name="availableSeats"
            value={busData.availableSeats}
            onChange={handleChange}
            required
            min="0"
            max={busData.totalSeats} // Available seats cannot exceed total seats
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
            step="0.01"
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
            required
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
            disabled={submitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}