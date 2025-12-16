import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (!res.error) navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Bus3.png"
            alt="BusGo Logo"
            className="h-16 w-16 object-contain mb-2 rounded"
          />
          <h2 className="text-3xl font-extrabold text-blue-900 mb-1">Login to BusGo</h2>
          <div className="text-blue-500 mb-2 text-sm">Welcome back! Please sign in to continue.</div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-3 text-center text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-900 mb-1 font-medium">Email Address</label>
            <input
              className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="email"
              name="email"
              placeholder="you@email.com"
              value={form.email}
              autoComplete="email"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-blue-900 mb-1 font-medium">Password</label>
            <input
              className="w-full p-3 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              autoComplete="current-password"
              required
              onChange={handleChange}
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white transition bg-blue-700 hover:bg-blue-800 active:bg-blue-900 shadow-md ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-blue-700">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
