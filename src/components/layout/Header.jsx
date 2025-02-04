// src/components/layout/Header.jsx
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "../common/ThemeToggle";

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
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container mx-auto px-4">
        <div className="py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
