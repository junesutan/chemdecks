import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateDeck() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("token: ", token);
    console.log("title: ", title);
    console.log("description: ", description);
    const res = await fetch("http://localhost:3000/decks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      const data = await res.json();
      navigate(`/decks/${data.id}/cards`); // ← GO TO CARD CREATION PAGE
    } else {
      console.log("error creating deck");
    }
  }

  return (
    <div style={{ padding: "40px", color: "white", minHeight: "100vh" }}>
      <h1>Create New Deck</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", width: "300px" }}
      >
        <label>Deck Title</label>
        <input
          type="text"
          placeholder="e.g. Chemical Bonding"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "10px", marginBottom: "15px" }}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "10px", marginBottom: "15px" }}
          rows={3}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            background: "#ff69b4",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Create Deck
        </button>
      </form>
    </div>
  );
}
