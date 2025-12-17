import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      // Save email for next step
      sessionStorage.setItem("resetEmail", email);
      setMsg("OTP sent to your email.");
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        "There was an error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Bus3.png"
            alt="BusGo Logo"
            className="h-14 w-14 object-contain mb-2 rounded"
          />
          <h2 className="text-2xl font-extrabold text-blue-900 mb-1">
            Forgot Password
          </h2>
          <div className="text-blue-500 mb-2 text-sm text-center">
            Enter your email address and we'll send you a password reset OTP.
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-3 text-center text-sm">
            {error}
          </div>
        )}
        {msg && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-2 rounded mb-3 text-center text-sm">
            {msg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white transition bg-blue-700 hover:bg-blue-800 active:bg-blue-900 shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
