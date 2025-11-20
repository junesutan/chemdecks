import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DecksPage from "./pages/DecksPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/decks" element={<DecksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
