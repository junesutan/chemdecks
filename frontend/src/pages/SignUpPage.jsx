import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      // save token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // redirect based on role
      if (data.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="page-center">
      <div className="signup-card">
        <h1>Sign Up</h1>

        <form
          onSubmit={handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <label>
            Name
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

            Email
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            I'm signing up as a:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" style={{ padding: "10px 20px", marginTop: 10 }}>
            Sign Up
          </button>

          <div className="signup-footer">
            Already have an account yet? <a href="/login">Log in</a> instead
          </div>
        </form>
      </div>
    </div>
  );
}
