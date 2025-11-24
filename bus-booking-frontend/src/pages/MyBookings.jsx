import { useEffect, useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/bookings/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    }).then(res => setBookings(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? <div>No bookings yet.</div> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Bus</th>
              <th>Seats</th>
              <th>Amount</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b.bus?.name}</td>
                <td>{b.seats.join(", ")}</td>
                <td>{b.amount}</td>
                <td>
                  {b.location?.coordinates ? `${b.location.coordinates[1].toFixed(4)}, ${b.location.coordinates[0].toFixed(4)}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
