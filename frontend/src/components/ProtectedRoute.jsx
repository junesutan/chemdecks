import { useEffect, useState } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  useEffect(() => {
    console.log("UE");

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      return;
    }
    if (storedRole !== allowedRole) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [storedRole, token, allowedRole]);

  if (loading) return <h1>Loading</h1>;

  if (!token) return <Navigate to="/" />;

  return children;
}
