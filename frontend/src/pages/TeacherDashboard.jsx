import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  console.log("🔵 TeacherDashboard RENDERED");

  const navigate = useNavigate(); // ✅ Correct place
  const [decks, setDecks] = useState([]);
  const token = localStorage.getItem("token");

  // Load decks
  useEffect(() => {
    async function fetchDecks() {
      const res = await fetch("http://localhost:3000/decks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDecks(data);
    }

    fetchDecks();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        background: "#121212",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Teacher Dashboard
      </h1>

      <button
        onClick={() => navigate("/create-deck")}
        style={{
          padding: "12px 20px",
          fontSize: "18px",
          background: "#ff69b4",
          border: "none",
          cursor: "pointer",
          borderRadius: "6px",
          marginBottom: "30px",
        }}
      >
        ➕ Create New Deck
      </button>

      <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>Your Decks</h2>

      {decks.length === 0 ? (
        <p>No decks yet. Create your first one!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {decks.map((deck) => (
            <li
              key={deck.id}
              style={{
                background: "#1e1e1e",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "20px",
              }}
            >
              {deck.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
