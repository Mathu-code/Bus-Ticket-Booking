import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/bookings/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-center p-4">Loading bookings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      
      {error && <div className="text-red-600 p-3 bg-red-100 rounded mb-4">{error}</div>}
      
      {bookings.length === 0 ? (
        <div className="text-center text-gray-600 p-4 bg-gray-100 rounded">
          No bookings yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border p-3 text-left">Bus Name</th>
                <th className="border p-3 text-left">Route</th>
                <th className="border p-3 text-left">Seats</th>
                <th className="border p-3 text-left">Amount</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="hover:bg-gray-100">
                  <td className="border p-3">{booking.bus?.name || "-"}</td>
                  <td className="border p-3">{booking.bus?.route || "-"}</td>
                  <td className="border p-3">{booking.seats?.join(", ") || "-"}</td>
                  <td className="border p-3">Rs.{booking.amount}</td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded text-white ${
                      booking.status === "confirmed" ? "bg-green-500" : 
                      booking.status === "cancelled" ? "bg-red-500" : 
                      "bg-yellow-500"
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="border p-3">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}