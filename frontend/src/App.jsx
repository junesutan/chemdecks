import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateDeck from "./pages/CreateDeck";
import CreateCards from "./pages/CreateCardsPage";
import StudyPage from "./pages/StudyPage";
import SignUpPage from "./pages/SignUpPage";
import EditDeckPage from "./pages/EditDeckPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

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

        <Route
          path="/study/:deckId"
          element={
            <ProtectedRoute allowedRole="student">
              <StudyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-deck/:deckId"
          element={
            <ProtectedRoute allowedRole="teacher">
              <EditDeckPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
