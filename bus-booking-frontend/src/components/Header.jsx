import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-blue-900 text-white flex items-center justify-between px-6 py-3 shadow">
      <div className="font-bold text-2xl cursor-pointer" onClick={() => navigate("/")}>BusGo</div>
      <nav className="flex items-center gap-6">
        {!user && (
          <>
            <button onClick={() => navigate("/login")} className="hover:underline">Login</button>
            <button onClick={() => navigate("/register")} className="hover:underline">Register</button>
          </>
        )}
        {user && (
          <div className="flex items-center gap-4">
            <span className="font-semibold flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H3z" />
              </svg>
              {user.name}
            </span>
            <button
              className="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-200"
              onClick={handleLogout}
            >Logout</button>
            <button
              className="underline"
              onClick={() => navigate("/profile")}
            >Profile</button>
          </div>
        )}
      </nav>
    </header>
  );
}
