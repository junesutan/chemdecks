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
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [error, setError] = useState(null);

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
    setSelectedDeck(deck);
    setShowAssignModal(true);

    try {
      const res = await fetch("http://localhost:3000/users/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("res: ", res);
      const data = await res.json();
      setStudents(data); // array of students
      setSelectedStudents([]); // reset selection
      console.log("students:", data);
    } catch (err) {
      console.log("Failed to load students:", err);
    }
  };

  return (
    <div>
      <div className="teacher-dashboard">
        <h1>Teacher Dashboard</h1>

        <button
          className="create-deck-btn"
          onClick={() => navigate("/create-deck")}
        >
          + Create New Deck
        </button>

        <h2 className="teacher-section-title">Your Decks</h2>

        {decks.length === 0 ? (
          <p className="dashboard-empty">
            No decks yet. Create your first one!
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {decks.map((deck) => (
              <li key={deck.id} className="teacher-card">
                <span>{deck.title}</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => navigate(`/edit-deck/${deck.id}`)}
                    className="study-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openAssignModal(deck)}
                    className="study-btn"
                  >
                    Assign
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/*modal*/}
      {showAssignModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#1f1f1f",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
            }}
          >
            <h2>Assign: {selectedDeck?.title}</h2>
            <div
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                marginTop: "20px",
              }}
            >
              {students.map((s) => (
                <label
                  key={s.id}
                  style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(s.id)}
                    onChange={() =>
                      setSelectedStudents((prev) =>
                        prev.includes(s.id)
                          ? prev.filter((x) => x !== s.id)
                          : [...prev, s.id]
                      )
                    }
                  />
                  {s.name}
                </label>
              ))}
            </div>
            {/* ASSIGN TO SELECTED STUDENTS BUTTON IN MODAL */}
            <button
              onClick={async () => {
                await fetch("http://localhost:3000/assignments", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    deck_id: selectedDeck.id,
                    student_id: selectedStudents,
                  }),
                });
                console.log("assigned to students:", selectedStudents);
                setShowAssignModal(false);
              }}
              style={{
                width: "100%",
                padding: "10px",
                background: "#ff4d79",
                border: "none",
                borderRadius: "6px",
                color: "white",
                marginTop: "20px",
                cursor: "pointer",
              }}
            >
              Assign to {selectedStudents.length} Selected{" "}
              {selectedStudents.length === 1 ? "Student" : "Students"}
            </button>
            <button
              onClick={() => setShowAssignModal(false)}
              style={{
                width: "100%",
                padding: "10px",
                background: "#444",
                border: "none",
                borderRadius: "6px",
                color: "white",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
