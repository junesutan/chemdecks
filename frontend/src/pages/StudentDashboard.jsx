import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  // temp mock data
  const [student] = useState({ name: "Rachel Lim", weeklyRank: 5 });
  const [homework] = useState({
    chapter: "Acids and Bases",
    deckId: 33,
    title: "Strong Acid vs. Weak Acid",
    cardCount: 24,
  });
  const [leaderboard] = useState([
    { rank: 1, username: "@eenie", score: 1400 },
    { rank: 2, username: "@meenie", score: 1200 },
    { rank: 3, username: "@miney", score: 1000 },
  ]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 100, padding: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <a>Dashboard</a>
          <a>This week’s homework</a>
          <a>Logout</a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 30 }}>
        <h1 style={{ marginBottom: 5 }}>Welcome back, {student.name}!</h1>
        <p style={{ marginBottom: 30 }}>Nice to have you back!</p>

        {/* Homework */}
        <h2>This week’s homework</h2>
        <p>{homework.chapter}</p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 10,
            maxWidth: 500,
          }}
        >
          <div style={{ width: 100, height: 100 }}></div>

          <div style={{ flex: 1 }}>
            <h3>{homework.title}</h3>
            <p>{homework.cardCount} cards</p>

            <button
              onClick={() => navigate(`/study/${homework.deckId}`)}
              style={{
                padding: "8px 16px",
                border: "1px solid #333",
                cursor: "pointer",
              }}
            >
              start now
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div
          style={{
            marginTop: 40,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 10,
            maxWidth: 500,
          }}
        >
          <h2 style={{ marginBottom: 15 }}>Leaderboard</h2>

          <table style={{ width: "100%", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ccc" }}>
                <th>Rank</th>
                <th>Username</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} style={{ borderBottom: "1px solid #eee" }}>
                  <td>{entry.rank}</td>
                  <td>{entry.username}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Profile Section */}
      <aside style={{ width: 250, padding: 30, borderLeft: "1px solid #ddd" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "#ddd",
              margin: "0 auto 15px",
            }}
          ></div>

          <h3 style={{ marginBottom: 10 }}>{student.name}</h3>
          <p style={{ fontSize: 14 }}>
            <strong>Position this week:</strong> {student.weeklyRank}
          </p>
        </div>
      </aside>
    </div>
  );
}
