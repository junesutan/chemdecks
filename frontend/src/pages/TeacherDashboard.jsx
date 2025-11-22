import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  console.log("🔵 TeacherDashboard RENDERED");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();
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

      if (!res.ok) {
        console.log("Failed to fetch decks:", res.status);
        setDecks([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setDecks(data);
      } else {
        console.log("Not an array:", data);
        setDecks([]);
      }
    }

    if (token) fetchDecks();
  }, [token]);

  const openAssignModal = async (deck) => {
    const token = localStorage.getItem("token");

    // Save which deck is being assigned
    setSelectedDeck(deck);
    setShowAssignModal(true);

    try {
      // Fetch student list
      const res = await fetch("http://localhost:3000/users/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setStudents(data); // Save array of students
      setSelectedStudents([]); // Clear previous selection
    } catch (err) {
      console.log("Failed to load students:", err);
    }
  };

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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{deck.title}</span>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => navigate(`/edit-deck/${deck.id}`)}
                  style={{
                    padding: "6px 12px",
                    background: "#444",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => openAssignModal(deck)}
                  style={{
                    padding: "6px 12px",
                    background: "#ff4d79",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Assign
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
