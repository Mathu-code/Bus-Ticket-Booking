import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SelectPlaceMap from "../components/SelectPlaceMap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout";

const stripePromise = loadStripe("pk_test_51234567890abcdefghij"); // Replace with your Stripe publishable key

export default function BookBus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/buses/${id}`);
        setBus(res.data);
      } catch (err) {
        setError("Failed to load bus details");
        console.error(err);
      }
    };
    fetchBus();
  }, [id]);

  const handleSeatChange = (e) => {
    const value = Number(e.target.value);
    setSeats(seats.includes(value) ? seats.filter(s => s !== value) : [...seats, value]);
  };

  const handleBook = async () => {
    setError("");
    if (!seats.length || !location) {
      setError("Select at least one seat and location.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/bookings",
        {
          busId: bus._id,
          seats,
          amount: bus.price * seats.length,
          location: {
            type: "Point",
            coordinates: [location.lng, location.lat],
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/my-bookings");
    } catch (err) {
      setError(err.response?.data?.msg || "Booking failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!bus) return <div className="text-center p-4">Loading...</div>;

  const totalSeats = bus.totalSeats || 40;
  const totalPrice = bus.price * seats.length;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{bus.name}</h2>
      <div className="mb-2">Route: {bus.route}</div>
      <div className="mb-2">Departure: {bus.date} {bus.departureTime}</div>
      <div className="mb-4">Price per seat: Rs.{bus.price}</div>

      <div className="mb-4">
        <div className="font-bold mb-2">Select seats:</div>
        <div className="grid grid-cols-8 gap-1 mb-2">
          {Array.from({ length: totalSeats }, (_, i) => i + 1).map(seat => (
            <label 
              key={seat} 
              className={`block border p-2 text-center cursor-pointer rounded ${
                bus.bookedSeats?.includes(seat) 
                  ? 'bg-red-300 cursor-not-allowed' 
                  : seats.includes(seat) 
                  ? 'bg-green-300' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                value={seat}
                disabled={bus.bookedSeats?.includes(seat)}
                checked={seats.includes(seat)}
                onChange={handleSeatChange}
                className="mr-1"
              />
              {seat}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="font-bold mb-2">Select boarding place on map:</div>
        <SelectPlaceMap onSelect={setLocation} />
        {location && (
          <div className="text-sm text-gray-600">
            Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        )}
      </div>

      {seats.length > 0 && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <div>Seats: {seats.join(", ")}</div>
          <div className="font-bold">Total: Rs.{totalPrice}</div>
        </div>
      )}

      {!seats.length || !location ? (
        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded w-full cursor-not-allowed" disabled>
          Select seats and location to proceed
        </button>
      ) : (
        <Elements stripe={stripePromise}>
          <StripeCheckout
            amount={totalPrice}
            onSuccess={handleBook}
            busId={id}
            seats={seats}
            location={location}
            loading={loading}
          />
        </Elements>
      )}

      {error && <div className="text-red-600 mt-4 p-2 bg-red-100 rounded">{error}</div>}
    </div>
  );
}