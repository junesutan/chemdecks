import { useEffect, useState } from "react";

function DecksPage() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/decks", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setDecks(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Your Decks</h2>
      {decks.map((d) => (
        <p key={d.id}>{d.title}</p>
      ))}
    </div>
  );
}

export default DecksPage;
