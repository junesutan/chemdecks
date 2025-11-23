import { useEffect, useState } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/users/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const user = await res.json();
          setRole(user.role);
        }
      } catch (err) {
        console.error("Auth verification failed: ", err);
      }

      setLoading(false);
    }
    verify();
  }, [token]);

  if (loading) return <div>Loading..</div>;

  // 2. Wrong role → redirect away
  if (role !== allowedRole) return <Navigate to="/" />;

  // 3. If everything is correct → render children
  return children;
}
