import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./firebase";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/themeContext";
import { AuthWrapper } from "./components/auth/AuthWrapper";
import { Header } from "./components/Layout/Header";
import { Navigation } from "./components/Layout/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { JiuJitsu } from "./pages/JiuJitsu";
import { History } from "./pages/History";
import { Progress } from "./pages/Progress";
import { ActiveWorkout } from "./pages/ActiveWorkout";
import { WorkoutDetails } from "./pages/WorkoutDetails";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
          <AuthProvider>
            <AuthWrapper>
              <Header />
              <div className="flex-1 w-full flex justify-center">
                <main className="w-full max-w-7xl px-4 py-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/jiujitsu" element={<JiuJitsu />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route
                      path="/workoutTemplates/:templateId"
                      element={<ActiveWorkout />}
                    />
                    <Route
                      path="/workout/:workoutId"
                      element={<WorkoutDetails />}
                    />
                  </Routes>
                </main>
              </div>
              <Navigation />
            </AuthWrapper>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
