import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StudyPage() {
  const { deckId } = useParams();

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

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

  //POST STUDENTS RESPONSES TO THE STUDENT_RESPONSES TABLE BACKEND
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    const body = {
      card_id: card.id,
      deck_id: deckId,
      student_answer: input,
      is_correct: input.trim() === card.answer.trim(), // check whether answer correct or not
    };

    try {
      const res = await fetch("http://localhost:3000/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Saved:", data);

      // reveal the answer
      setShowAnswer(true);
    } catch (err) {
      console.error("Error saving response:", err);
    }
  };

  const nextCard = () => {
    if (cards.length === 0) return;
    setShowAnswer(false);
    setIndex((current) => (current + 1) % cards.length);
  };
  const skipCard = () => {
    if (cards.length === 0) return;
    setShowAnswer(false);
    setIndex((current) => (current + 1) % cards.length);
  };

  return (
    <div style={{ outline: "solid" }}>
      {/* TOP BAR */}
      <div>
        <button onClick={skipCard} style={{ margin: "10px" }}>
          skip
        </button>

        {showAnswer && <button onClick={nextCard}>next</button>}
      </div>

      {/* MAIN CONTENT */}
      <div>
        {/* QUESTION BOX */}
        <div style={{ margin: "10px" }}>
          {parts[0]}
          {showAnswer ? (
            <strong style={{ textDecoration: "underline" }}>
              {card.answer}
            </strong>
          ) : (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></input>
          )}
          {parts[1]}
        </div>

        {/* SHOW ANSWER BUTTON */}
        {!showAnswer && (
          <button onClick={handleSubmit} style={{ margin: "10px" }}>
            submit
          </button>
        )}

        {/* FEEDBACK BOX */}
        {showAnswer && (
          <div>
            <strong>Feedback:</strong> {card.feedback_if_right}
            {/* TODO: HANDLE FEEDBACK IF CORRECT OR INCORRECT */}
          </div>
        )}

        {/* PROGRESS BAR */}
        <div>
          <p>Progress</p>
          <div>
            <div>
              {index + 1} of {cards.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
