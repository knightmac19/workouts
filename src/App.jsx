// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Navigation } from "./components/layout/Navigation";
import { Dashboard } from "./pages/Dashboard";
import { History } from "./pages/History";
import { Progress } from "./pages/Progress";
import { JiuJitsu } from "./pages/JiuJitsu";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/jiujitsu" element={<JiuJitsu />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
