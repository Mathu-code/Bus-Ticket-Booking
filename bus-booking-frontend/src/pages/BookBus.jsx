import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout";
import LocationPicker from "../components/LocationPicker";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

export default function BookBus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  //const [loading, setLoading] = useState(false);

  // Fetch bus details
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

  // Seat selection logic
  const handleSeatChange = (e) => {
    const value = Number(e.target.value);
    setSeats(seats.includes(value) ? seats.filter(s => s !== value) : [...seats, value]);
  };

  // Handle location selection
  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  // Handle successful booking
  const handleBookSuccess = () => {
    navigate("/my-bookings");
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

      <LocationPicker onLocationSelect={handleLocationSelect} location={location} />

      {seats.length > 0 && (
        <div className="mb-4 p-3 bg-gray-100 rounded">
          <div>Seats: {seats.join(", ")}</div>
          <div className="font-bold">Total: Rs.{totalPrice}</div>
        </div>
      )}

      {!seats.length || !location ? (
        <button 
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded w-full cursor-not-allowed" 
          disabled
        >
          {!seats.length ? "Select seats" : "Select location"} to proceed
        </button>
      ) : (
        <Elements stripe={stripePromise}>
          <StripeCheckout
            amount={totalPrice}
            onSuccess={handleBookSuccess}
            busId={id}
            seats={seats}
            location={location}
          />
        </Elements>
      )}

      {error && <div className="text-red-600 mt-4 p-2 bg-red-100 rounded">{error}</div>}
    </div>
  );
}