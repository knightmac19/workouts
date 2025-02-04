// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/themeContext";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { Progress } from "./pages/Progress";
import { JiuJitsu } from "./pages/JiuJitsu";
import { ActiveWorkout } from "./pages/ActiveWorkout";
import { Toaster } from "react-hot-toast";

import { seedWorkouts } from "./utils/seedWorkouts";

// Call this once to seed the data
seedWorkouts()
  .then(() => console.log("Successfully seeded workouts"))
  .catch((error) => console.error("Error seeding workouts:", error));

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/jiujitsu" element={<JiuJitsu />} />
              <Route
                path="/workoutTemplates/:templateId"
                element={<ActiveWorkout />}
              />
            </Routes>
          </div>
          <Navigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
