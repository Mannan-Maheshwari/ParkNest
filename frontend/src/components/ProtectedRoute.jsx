import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { isLoading, isAuthenticated, isOwner, isUser } = useAuth();

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">Loading ParkNest...</div>;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === "owner" && !isOwner) return <Navigate to="/dashboard" replace />;
  if (role === "user" && !isUser) return <Navigate to="/owner/dashboard" replace />;

  return <Outlet />;
}