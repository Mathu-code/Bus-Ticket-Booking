import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

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
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Helper: Convert image to base64
  function toDataUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  // === Generate Ticket PDF ===
  const downloadTicket = async (booking) => {
    try {
      const doc = new jsPDF();

      // Add logo (small, top-left)
      try {
        const logo = await toDataUrl("/Bus1.jpg"); // Use your logo path here
        doc.addImage(logo, "PNG", 12, 10, 24, 24); // x=12, y=10, width=24, height=24
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.warn("Logo missing or failed to load.");
      }

      // Ticket title aligned with logo
      doc.setFontSize(18);
      doc.text("BusGo - Bus Ticket", 42, 26); // Next to logo, baseline aligned
      let y = 40;

      // Ticket Details
      doc.setFontSize(12);
      doc.text(`Booking ID: ${booking._id}`, 20, y); y += 10;
      doc.text(`Bus Name: ${booking.bus?.name || "-"}`, 20, y); y += 10;
      doc.text(`Route: ${booking.bus?.route || "-"}`, 20, y); y += 10;
      doc.text(`Departure: ${booking.bus?.date || "-"} ${booking.bus?.departureTime || "-"}`, 20, y); y += 10;
      doc.text(`Seat No: ${booking.seats?.join(", ")}`, 20, y); y += 10;
      doc.text(`Amount: Rs.${booking.amount}`, 20, y); y += 10;
      doc.text(`Status: ${booking.status}`, 20, y); y += 10;
      doc.text(`Booked On: ${new Date(booking.createdAt).toLocaleString()}`, 20, y);

      // QR code content (all ticket details)
      const qrText = `
BusGo Ticket
Booking ID: ${booking._id}
Bus Name: ${booking.bus?.name || "-"}
Route: ${booking.bus?.route || "-"}
Departure: ${booking.bus?.date || "-"} ${booking.bus?.departureTime || "-"}
Seat No: ${booking.seats?.join(", ") || "-"}
Amount: Rs.${booking.amount}
Status: ${booking.status}
Booked On: ${new Date(booking.createdAt).toLocaleString()}
      `;

      // Add QR Code with full ticket details
      try {
        const qrData = await QRCode.toDataURL(qrText);
        doc.addImage(qrData, "PNG", 150, 50, 40, 40);
      } catch {
        console.warn("QR Code failed.");
      }

      // Table (autoTable)
      autoTable(doc, {
        startY: y + 12,
        styles: { fontSize: 10 },
        head: [["#", "Field", "Value"]],
        body: [
          [1, "Bus Name", booking.bus?.name || "-"],
          [2, "Route", booking.bus?.route || "-"],
          [3, "Seat No", booking.seats?.join(", ") || "-"],
          [4, "Amount", `Rs.${booking.amount}`],
          [5, "Status", booking.status],
          [6, "Booked On", new Date(booking.createdAt).toLocaleString()]
        ],
      });

      doc.save(`Ticket_${booking._id}.pdf`);
    } catch (err) {
      alert("PDF Error: " + err.message);
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading bookings...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">My Bookings</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-md rounded-xl overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Bus Name</th>
              <th className="p-4 text-left">Route</th>
              <th className="p-4 text-left">Seat No</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Ticket</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-blue-50 transition">
                <td className="border-b p-4">{b.bus?.name}</td>
                <td className="border-b p-4">{b.bus?.route}</td>
                <td className="border-b p-4">{b.seats?.join(", ")}</td>
                <td className="border-b p-4">Rs.{b.amount}</td>
                <td className="border-b p-4">{b.status}</td>
                <td className="border-b p-4">
                  {new Date(b.createdAt).toLocaleDateString()}
                </td>
                <td className="border-b p-4">
                  <button
                    onClick={() => downloadTicket(b)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-800"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
