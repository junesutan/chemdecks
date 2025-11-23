import { useState } from "react";
import { useNavigate, Link } from "react-router";

function LoginPage() {
  console.log("LOGIN PAGE RENDERED");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    console.log("LOGIN FUNCTION STARTED");
    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);
    console.log("ROLE FROM BACKEND:", data.role);
    console.log("TOKEN FROM BACKEND:", data.token);

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); //@JS to remove in the future

      if (data.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    }
  };

  return (
    <div className="page-center">
      <div className="signup-card">
        <form
          className="signup-form"
          onSubmit={login}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <label>
            Email
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit">Login</button>

          <div className="signup-footer">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
