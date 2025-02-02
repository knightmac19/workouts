// src/components/layout/Header.jsx
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/history":
        return "History";
      case "/progress":
        return "Progress";
      case "/jiujitsu":
        return "Jiu Jitsu";
      default:
        return "Workout Tracker";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        </div>
      </div>
    </header>
  );
}
