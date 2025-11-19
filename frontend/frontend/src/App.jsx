import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DecksPage from "./pages/DecksPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/decks" element={<DecksPage />} />
    </Routes>
  );
}

export default App;
