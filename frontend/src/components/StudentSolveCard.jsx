import { useState } from "react";

export default function SolveCard({ card, onNext }) {
  const [showFeedback, setShowFeedback] = useState(false);

  function handleSubmit() {
    setShowFeedback(true);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onNext}>skip</button>
        <button onClick={onNext}>next</button>
      </div>

      <h2 style={{ marginTop: "40px" }}>{card.question}</h2>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="type your answer"
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "200px",
            textAlign: "center",
          }}
        />
      </div>

      <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
        Check
      </button>

      <div style={{ marginTop: "40px" }}>
        <div style={{ fontSize: "14px", marginBottom: "6px" }}>Progress</div>
        <div
          style={{
            height: "16px",
            width: "100%",
            background: "#eee",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "50%",
              background: "#acd1ff",
            }}
          ></div>
        </div>
      </div>

      {showFeedback && (
        <div
          style={{
            marginTop: "25px",
            padding: "12px",
            background: "#f5f5f5",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          <strong>Feedback:</strong> {card.feedback}
        </div>
      )}
    </div>
  );
}
