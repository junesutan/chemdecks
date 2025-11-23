import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDeckPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([]);

  const token = localStorage.getItem("token");

  // LOAD DECK + CARDS
  useEffect(() => {
    async function loadData() {
      // Load deck
      const deckRes = await fetch(`http://localhost:3000/decks/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deckData = await deckRes.json();
      console.log("deckData: ", deckData);

      setTitle(deckData.title);
      setDescription(deckData.description);

      // Load cards
      const cardRes = await fetch(
        `http://localhost:3000/cards/deck/${deckId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const cardData = await cardRes.json();
      console.log("cardData: ", cardData);

      setCards(cardData);
    }

    loadData();
  }, [deckId, token]);

  /* ---------------- Update card fields ---------------- */
  const updateCard = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  /* ---------------- Add new blank card ---------------- */
  const addCard = () => {
    setCards([...cards, { question: "", answer: "" }]);
  };

  /* ---------------- Remove card ---------------- */
  const deleteCard = (index) => {
    const updated = cards.filter((_, i) => i !== index);
    setCards(updated);
  };

  /* ---------------- SAVE CHANGES ---------------- */
  const saveChanges = async () => {
    // Update deck
    await fetch(`http://localhost:3000/decks/${deckId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    // Update cards
    await fetch(`http://localhost:3000/cards/deck/${deckId}/bulk-edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cards }),
    });

    navigate("/teacher");
  };

  return (
    <div className="page-center">
      <div className="signup-card" style={{ width: 600 }}>
        <h1>Edit Deck</h1>

        {/* Deck Info */}
        <label>
          Deck Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Description
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <h2 style={{ marginTop: 20 }}>Edit Cards</h2>

        {cards.map((card, i) => (
          <>
            <div className="card-group" key={card.id || i}>
              <label>Question</label>
              <input
                value={card.question}
                onChange={(e) => updateQuestion(i, e.target.value)}
              />

              <label>Answer</label>
              <input
                value={card.answer}
                onChange={(e) => updateAnswer(i, e.target.value)}
              />
            </div>

            <button className="delete-card-btn" onClick={() => deleteCard(i)}>
              Delete Card
            </button>
          </>
        ))}

        <button
          onClick={addCard}
          className="homework-btn"
          style={{ marginTop: 15 }}
        >
          Add New Card
        </button>

        <button
          onClick={saveChanges}
          className="study-submit"
          style={{ marginTop: 30 }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
