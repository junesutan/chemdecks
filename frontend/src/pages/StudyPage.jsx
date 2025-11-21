import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StudyPage() {
  const { deckId } = useParams();

  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

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

  //TODO: write next card function
  //TODO: write skip card function

  return (
    <div>
      {/* TOP BAR */}
      <div>
        <button>skip</button>
        {/* TODO: ADD SKIP FUNCTION TO THIS */}

        {showAnswer && <button>next</button>}
        {/* TODO: ADD NEXT FUNCTION TO THIS */}
      </div>

      {/* MAIN CONTENT */}
      <div>
        {/* QUESTION BOX */}
        <div>{card.question}</div>

        {/* SHOW ANSWER BUTTON */}
        {!showAnswer && (
          <button onClick={() => setShowAnswer(true)} style={{}}>
            show answer
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
