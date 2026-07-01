import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import SpaceNamePage from "./pages/SpaceNamePage";
import ChecklistPage from "./pages/ChecklistPage";
import AddChecklistItemPage from "./pages/AddChecklistItemPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/space-name" element={<SpaceNamePage />} />
        <Route path="/settings/checklist" element={<ChecklistPage />} />
        <Route
          path="/settings/checklist/add"
          element={<AddChecklistItemPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
