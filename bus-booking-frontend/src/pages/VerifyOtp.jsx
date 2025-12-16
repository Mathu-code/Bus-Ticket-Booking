// src/pages/VerifyOtp.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail");

  if (!email) {
    // If user reloads, go back to ForgotPassword
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      // Backend will validate OTP, then return a token
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      const { token } = res.data;
      // Save reset token for password reset
      sessionStorage.setItem("resetToken", token);
      navigate("/reset-password");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        "Invalid OTP. Try again."
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
            OTP Verification
          </h2>
          <div className="text-blue-500 mb-2 text-sm text-center">
            Enter the OTP sent to <b>{email}</b>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-3 text-center text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            maxLength={6}
          />
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white transition bg-blue-700 hover:bg-blue-800 active:bg-blue-900 shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
