import { Navigate } from "react-router";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  // 1. No token → redirect to login
  if (!token) return <Navigate to="/" />;

  // 2. Wrong role → redirect away
  if (storedRole !== allowedRole) return <Navigate to="/" />;

  // 3. If everything is correct → render children
  return children;
}
