import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateCards() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Deck info
  const [deck, setDeck] = useState(null);

  // Start with 5 rows
  const [cards, setCards] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

  // Fetch deck title & description
  useEffect(() => {
    async function fetchDeck() {
      const res = await fetch(`http://localhost:3000/decks/${deckId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("data: ", data);
      setDeck(data);
    }
    fetchDeck();
  }, [deckId, token]);

  function handleChange(index, field, value) {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  }

  function addRow() {
    setCards([...cards, { question: "", answer: "" }]);
  }

  function deleteRow(index) {
    setCards(cards.filter((_, i) => i !== index));
  }
  async function finish() {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `http://localhost:3000/decks/${deckId}/cards/bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cards }),
      }
    );

    if (res.ok) {
      console.log("post successful, returning to teacher dashboard");
      navigate("/teacher"); // go back after saving
    } else {
      console.log("error saving cards");
    }
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>
      {/* Deck title + description */}
      {deck && (
        <div style={{ marginBottom: "30px" }}>
          <h1>{deck.title}</h1>
          <p style={{ color: "#ccc" }}>{deck.description}</p>
        </div>
      )}

      {/* Column headers */}
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <div style={{ flex: 1 }}>FRONT</div>
        <div style={{ flex: 1 }}>BACK</div>
      </div>

      {/* Rows */}
      {cards.map((card, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Row number */}
          <div style={{ width: "25px", color: "#888" }}>{index + 1}</div>

          {/* Question */}
          <textarea
            value={card.question}
            onChange={(e) => handleChange(index, "question", e.target.value)}
            style={{
              flex: 1,
              height: "150px",
              padding: "10px",
              border: "1px solid #ddd",
            }}
          />

          {/* Answer */}
          <textarea
            value={card.answer}
            onChange={(e) => handleChange(index, "answer", e.target.value)}
            style={{
              flex: 1,
              height: "150px",
              padding: "10px",
              border: "1px solid #ddd",
              marginLeft: "20px",
            }}
          />

          {/* Delete button */}
          <button
            onClick={() => deleteRow(index)}
            style={{
              marginLeft: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            🗑
          </button>
        </div>
      ))}

      {/* Add + Finish buttons */}
      <button onClick={addRow} style={{ marginRight: "15px" }}>
        + Add Card
      </button>

      <button
        onClick={finish}
        style={{
          background: "#ff69b4",
          border: "none",
          padding: "10px 20px",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Finish
      </button>
    </div>
  );
}
