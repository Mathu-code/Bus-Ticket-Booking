// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔥 Get token from sessionStorage (set by VerifyOtp)
  const token = sessionStorage.getItem("resetToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { token, password }
      );
      setMsg(res.data.msg);
      // Optionally clear session after reset
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetToken");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Bus3.png"
            alt="BusGo Logo"
            className="h-16 w-16 object-contain mb-2 rounded"
          />
          <h2 className="text-3xl font-extrabold text-blue-900 mb-1">
            Reset Password
          </h2>
          <p className="text-blue-500 text-sm text-center">
            Enter a new password for your account below
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-3 text-center text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {msg && (
          <div className="bg-green-100 border border-green-300 text-green-700 p-2 rounded mb-3 text-center text-sm">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-900 mb-1 font-medium">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-blue-900 mb-1 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition bg-blue-700 hover:bg-blue-800 active:bg-blue-900 shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-blue-700">
          Remembered?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
