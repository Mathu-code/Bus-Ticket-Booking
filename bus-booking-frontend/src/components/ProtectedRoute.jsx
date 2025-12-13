import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ adminOnly, children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Logged in but not an admin, redirect to home or an unauthorized page
    return <Navigate to="/" replace />; 
  }

  // User is logged in and meets admin criteria (if applicable)
  return children ? children : <Outlet />;
}