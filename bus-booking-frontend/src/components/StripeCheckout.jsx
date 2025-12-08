import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";

export default function StripeCheckout({ amount, onSuccess, busId, seats, location }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      if (!busId || !seats || seats.length === 0) {
        setError("Invalid bus or seats selection");
        setLoading(false);
        return;
      }

      if (!location) {
        setError("Please select a boarding location");
        setLoading(false);
        return;
      }

      // 1. Create payment intent
      const paymentRes = await axios.post(
        "http://localhost:5000/api/payments/create-payment-intent",
        { 
          amount: Math.round(amount * 100),
          currency: "usd",
          busId,
          seats,
          location
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!paymentRes.data.clientSecret) {
        setError("Failed to initialize payment. Please try again.");
        setLoading(false);
        return;
      }

      const clientSecret = paymentRes.data.clientSecret;

      // 2. Confirm payment with card
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        setSuccess("Payment successful! Creating booking...");
        
        // 3. Create booking after successful payment
        try {
          const bookingRes = await axios.post(
            "http://localhost:5000/api/bookings/create",
            {
              busId,
              seats,
              amount,
              paymentIntentId: result.paymentIntent.id,
              location: {
                type: "Point",
                coordinates: [location.lng, location.lat],
                address: location.address
              }
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setSuccess("Booking confirmed successfully!");
          console.log("Booking created:", bookingRes.data);
          
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } catch (bookingErr) {
          console.error("Booking creation error:", bookingErr);
          setError(
            bookingErr.response?.data?.msg || 
            "Booking failed after payment. Please contact support with Payment ID: " + result.paymentIntent.id
          );
          setLoading(false);
        }
      } else {
        setError("Payment was not completed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || 
        err.message || 
        "Payment failed. Please try again."
      );
      console.error("Payment error:", err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-3 rounded bg-white">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <button 
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full disabled:bg-gray-400"
        type="submit" 
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay Rs.${amount}`}
      </button>
      {error && (
        <div className="text-red-600 p-3 bg-red-100 rounded border border-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 p-3 bg-green-100 rounded border border-green-400">
          {success}
        </div>
      )}
    </form>
  );
}