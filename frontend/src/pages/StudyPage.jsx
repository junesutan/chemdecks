import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StudyPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [lastAnswer, setLastAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function loadCards() {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/cards/deck/${deckId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setCards(data);
      console.log(data);
    }
    loadCards();
  }, [deckId]);

  if (cards.length === 0) return <p>no cards in this deck...</p>;

  const card = cards[index];
  const question = card.question;
  const parts = question.split("_");

  const progressPercentage = cards.length
    ? Math.min(100, ((index + 1) / cards.length) * 100)
    : 0;

  // Helper function for clean comparison
  const isCorrect = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

  const handleSubmit = async () => {
    if (input.trim() === "") {
      setMessage("Please enter a valid input or click 'skip'.");
      return;
    }

    const token = localStorage.getItem("token");
    const card = cards[index];

    const correct = isCorrect(input, card.answer);

    // ⭐ Save student's actual answer BEFORE clearing input
    setLastAnswer(input);

    // POST student response
    try {
      const res = await fetch("http://localhost:3000/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_id: card.id,
          deck_id: card.deck_id,
          student_answer: input,
          is_correct: correct,
        }),
      });

      const data = await res.json();
      console.log("Saved response:", data);
    } catch (err) {
      console.error("Failed to POST student response:", err);
    }

    // Clear input AFTER saving lastAnswer
    setInput("");

    // Last card?
    if (index === cards.length - 1) {
      setIsFinished(true);
      setShowAnswer(true);
      return;
    }

    setShowAnswer(true);
  };

  const nextCard = () => {
    setShowAnswer(false);
    setIndex(index + 1);
  };

  const skipCard = () => {
    if (cards.length === 0) return;
    setShowAnswer(false);
    setIndex((current) => (current + 1) % cards.length);
  };

  const goBack = () => {
    setIndex((current) => Math.max(0, current - 1));
  };

  return (
    <div className="study-container">
      {/* TOP BAR */}
      <div className="study-topbar">
        <button className="study-btn" onClick={goBack}>
          back
        </button>

        {!showAnswer && (
          <button className="study-btn" onClick={skipCard}>
            skip
          </button>
        )}

        {showAnswer &&
          (isFinished ? (
            <button
              className="study-submit"
              onClick={() => navigate("/student")}
            >
              Return to Dashboard
            </button>
          ) : (
            <button className="study-btn" onClick={nextCard}>
              Next
            </button>
          ))}
      </div>

      {/* MAIN CARD */}
      <div className="study-card">
        <div className="study-question">
          {parts[0]}

          {showAnswer ? (
            <strong style={{ textDecoration: "underline" }}>
              {card.answer}
            </strong>
          ) : (
            <input
              className="study-input"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          )}

          {parts[1]}
        </div>

        {message && <p style={{ color: "red", fontSize: "11px" }}>{message}</p>}

        {!showAnswer && (
          <button onClick={handleSubmit} className="study-submit">
            submit
          </button>
        )}

        {/* FEEDBACK */}
        {showAnswer && (
          <div>
            <strong>Feedback:</strong>{" "}
            {isCorrect(lastAnswer, card.answer)
              ? card.feedback_if_right
              : card.feedback_if_wrong}
          </div>
        )}

        {/* PROGRESS BAR */}
        <div className="progress-section">
          <p className="progress-label">Progress</p>

          <div className="progress-bar">
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
                margin: "10px 0",
              }}
            >
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="progress-text">
            {index + 1} of {cards.length}
          </div>
        </div>
      </div>
    </div>
  );
}
