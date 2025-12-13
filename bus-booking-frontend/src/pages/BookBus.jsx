import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout";
import LocationPicker from "../components/LocationPicker";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

// Seats to appear as ORANGE (counter seats)
const COUNTER_SEATS = new Set([
  1, 2, 4, 5, 6, 8, 14, 20, 24, 28, 32, 36, 40, 44, 45, 46, 47, 48, 49, 50,
]);

const formatCurrency = (n) => n?.toLocaleString("en-IN");

export default function BookBus() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/buses/${id}`)
      .then(res => setBus(res.data))
      .catch(() => setError("Failed to load bus details"));
  }, [id]);

  if (!bus) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const toggleSeat = (seatNo) => {
    if (bus.bookedSeats?.includes(seatNo)) return;
    setSelectedSeats(prev =>
      prev.includes(seatNo)
        ? prev.filter(s => s !== seatNo)
        : [...prev, seatNo]
    );
  };

  const totalPrice = selectedSeats.length * bus.price;

  // ========== SEAT LAYOUT ========== //
  const seatRows = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31, 32],
    [33, 34, 35, 36, 37, 38, 39, 40],
    [41, 42, 43, 44, 45, 46, 47, 48],
    [49, 50],
  ];

  return (
    <div className="max-w-5xl mx-auto my-6">

      {/* ========== BUS INFO CARD (Horizontal) ========== */}
      <div className="mb-6 rounded-xl shadow-lg bg-white flex items-center px-3 py-3" style={{ minHeight: 130 }}>
        {/* Bus image */}
        <div
          className="w-52 h-[112px] relative rounded-lg overflow-hidden mr-5 cursor-pointer flex-shrink-0"
          onClick={() => setShowImage(true)}
        >
          <img
            src={bus.image || "/public/BusGo.png"}
            alt="Bus"
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs text-center py-1">
            View Bus Photo
          </div>
        </div>

        {/* Info left */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="font-bold text-xl mb-1">{bus.route}</div>
          <div>Date: {bus.date}</div>
          <div>Time: {bus.departureTime}</div>
          <div>Bus Type: {bus.busType || "Normal"}</div>
        </div>

        {/* Price/seats/button right */}
        <div className="flex flex-col items-end justify-center min-w-[150px]">
          <div className="text-xl font-bold text-blue-800 mb-1">
            Rs. {formatCurrency(bus.price)}
          </div>
          <div className="text-orange-600 font-semibold mb-2">
            Available Seats: {bus.availableSeats}
          </div>
          <button
            className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600 transition font-semibold"
            onClick={() => navigate(-1)}
          >
            Hide Seat Chart
          </button>
        </div>
      </div>

      {/* ========== SEAT LEGEND ========== */}
      <div className="flex gap-6 text-sm mb-4">
        <span className="flex items-center">
          <span className="inline-block w-5 h-5 border rounded mr-1 bg-white" />
          Available Seats
        </span>
        <span className="flex items-center">
          <span className="inline-block w-5 h-5 border rounded mr-1 bg-green-600" />
          Processing Seats
        </span>
        <span className="flex items-center">
          <span className="inline-block w-5 h-5 border rounded mr-1 bg-orange-400" />
          Counter Seats
        </span>
        <span className="flex items-center">
          <span className="inline-block w-5 h-5 border rounded mr-1 bg-red-500" />
          Booked Seats
        </span>
      </div>

      {/* ========== SEAT CHART ========== */}
      <div id="seat-map-section" className="bg-white p-6 rounded shadow flex flex-col gap-2 items-center mb-4">
        {seatRows.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map(seat => {
              let seatClass = "bg-white";
              if (bus.bookedSeats?.includes(seat)) {
                seatClass = "bg-red-500 text-white cursor-not-allowed";
              } else if (selectedSeats.includes(seat)) {
                seatClass = "bg-green-600 text-white";
              } else if (COUNTER_SEATS.has(seat)) {
                seatClass = "bg-orange-400 text-white";
              }
              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  disabled={bus.bookedSeats?.includes(seat)}
                  className={`w-10 h-10 border rounded text-sm font-bold ${seatClass}`}
                >
                  {String(seat).padStart(2, "0")}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ========== LOCATION PICKER ========== */}
      <div className="my-6">
        <LocationPicker
          location={location}
          onLocationSelect={setLocation}
        />
      </div>

      {/* ========== SUMMARY ========== */}
      {selectedSeats.length > 0 && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          Seats: {selectedSeats.join(", ")} <br />
          <b>Total: Rs. {formatCurrency(totalPrice)}</b>
        </div>
      )}

      {/* ========== PAYMENT ========== */}
      {!selectedSeats.length || !location ? (
        <button
          className="w-full bg-gray-300 text-gray-700 py-3 rounded cursor-not-allowed"
          disabled
        >
          Select seats and location to continue
        </button>
      ) : (
        <Elements stripe={stripePromise}>
          <StripeCheckout
            amount={totalPrice}
            busId={id}
            seats={selectedSeats}
            location={location}
            onSuccess={() => navigate("/my-bookings")}
          />
        </Elements>
      )}

      {error && (
        <div className="text-red-600 mt-4 p-2 bg-red-100 rounded">
          {error}
        </div>
      )}

      {/* ========== IMAGE MODAL ========== */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setShowImage(false)}
        >
          <div className="relative max-w-2xl w-full p-4">
            <button
              className="absolute top-2 right-4 text-white text-3xl font-bold"
              onClick={() => setShowImage(false)}
            >
              ✕
            </button>
            <img
              src={bus.image || "/public/BusGo.png"}
              alt="Bus Full"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
