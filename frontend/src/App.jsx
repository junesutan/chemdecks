import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateDeck from "./pages/CreateDeck";
import CreateCards from "./pages/CreateCards";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-deck"
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateDeck />
            </ProtectedRoute>
          }
        />

        <Route path="/decks/:deckId/cards" element={<CreateCards />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
