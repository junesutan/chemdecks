import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StudyPage() {
  const { deckId } = useParams();
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);

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
    }
    loadCards();
  }, [deckId]);

  if (cards.length === 0) return <p>no cards in this deck...</p>;

  const card = cards[index];

  return (
    <div>
      <h1>Study Mode</h1>
      <p>{card.question}</p>
      <p>{card.answer}</p>
    </div>
  );
}
