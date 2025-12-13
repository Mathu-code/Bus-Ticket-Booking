import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-blue-900 text-white flex items-center justify-between px-6 py-3 shadow">
      {/* Logo */}
      <div
        className="flex items-center gap-2 font-bold text-2xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/Bus3.png"
          alt="BusGo Logo"
          className="h-9 w-9 object-contain mr-1 rounded"
        />
        <span>BusGo</span>
      </div>

      <nav className="flex items-center gap-6">
        {/* If NOT logged in */}
        {!user && (
          <>
            <button onClick={() => navigate("/login")} className="hover:underline">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="hover:underline">
              Register
            </button>
          </>
        )}

        {/* If logged in */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            {/* Profile trigger */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 font-semibold hover:opacity-80"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 bg-white text-blue-900 rounded-full p-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H3z" />
              </svg>
              {user.name}
            </button>

            {/* Dropdown menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded shadow-lg py-2 z-20">
                {/* Profile */}
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>

                {/* Admin Dashboard */}
                {user.isAdmin && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/admin/dashboard");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                )}

                {/* Logout */}
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
