import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function StudyPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    //retrieve cards
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
  const progressPercentage = cards.length //calculating the progress % of the progress bar bar
    ? Math.min(100, ((index + 1) / cards.length) * 100)
    : 0;

  //POST STUDENTS RESPONSES TO THE STUDENT_RESPONSES TABLE BACKEND

  const handleSubmit = async () => {
    // 1. Validate input
    if (input.trim() === "") {
      setMessage("Please enter a valid input or click 'skip'.");
      return;
    }

    const token = localStorage.getItem("token");
    const card = cards[index];

    // 2. is it correct?
    const correct =
      input.trim().toLowerCase() === card.answer.trim().toLowerCase();

    // 3. POST student response to backend
    try {
      const res = await fetch("http://localhost:3000/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_id: card.id,
          deck_id: card.deck_id, // or use deckId from params
          student_answer: input,
          is_correct: correct,
        }),
      });

      const data = await res.json();
      console.log("Saved response:", data);
    } catch (err) {
      console.error("Failed to POST student response:", err);
    }
    //4. clear input after submit
    setInput("");

    // 5. end game if it's the last card
    if (index === cards.length - 1) {
      setIsFinished(true);
      setShowAnswer(true);
      return;
    }

    // 6.reveal answer
    setShowAnswer(true);
  };

  const nextCard = () => {
    if (index < cards.length) setShowAnswer(false);
    setIndex(index + 1);
  };

  const skipCard = () => {
    if (cards.length === 0) return;
    setShowAnswer(false);
    setIndex((current) => (current + 1) % cards.length);
  };

  const goBack = () => {
    setIndex((current) => Math.max(0, current - 1)); // never become negative
  };

  return (
    <div className="study-container">
      {/* TOP BAR WITH BACK SKIP NEXT BUTTONS */}
      <div className="study-topbar">
        {/* BACK BUTTON */}
        <button className="study-btn" onClick={goBack}>
          back
        </button>

        {/* SKIP BUTTON */}
        {!showAnswer && (
          <button className="study-btn" onClick={skipCard}>
            skip
          </button>
        )}

        {/* NEXT BUTTON becomes return to dashboard when it ends*/}
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

      {/* MAIN CONTENT */}
      <div className="study-card">
        {/* QUESTION BOX */}
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
                setMessage(""); //clear message
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            ></input>
          )}

          {parts[1]}
        </div>
        {message && <p style={{ color: "red", fontSize: "11px" }}>{message}</p>}

        {/* SUBMIT BUTTON */}
        {!showAnswer && (
          <button onClick={handleSubmit} className="study-submit">
            submit
          </button>
        )}

        {/* FEEDBACK BOX */}

        {showAnswer && (
          <div>
            <strong>Feedback:</strong>{" "}
            {input.trim() === (card.answer ?? "").trim()
              ? card.feedback_if_right
              : card.feedback_if_wrong}
          </div>
        )}

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
              ></div>
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
