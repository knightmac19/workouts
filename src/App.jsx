import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { Progress } from "./pages/Progress";
import { JiuJitsu } from "./pages/JiuJitsu";
import { ActiveWorkout } from "./pages/ActiveWorkout";
import { WorkoutDetails } from "./pages/WorkoutDetails";
import { ThemeProvider } from "./contexts/themeContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Toaster position="top-right" />
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
              <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
            </Routes>
          </div>
          <Navigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
