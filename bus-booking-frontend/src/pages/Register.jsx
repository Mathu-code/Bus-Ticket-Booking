import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(state => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (!res.error) navigate("/login");
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border" type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input className="w-full p-2 border" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="w-full p-2 border" type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-blue-600 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
      {success && <div className="text-green-600">{success}</div>}
    </div>
  );
}
