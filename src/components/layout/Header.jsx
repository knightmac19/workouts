// src/components/layout/Header.jsx
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "../common/ThemeToggle";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export function Header() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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
        <div className="py-4 flex justify-between items-start relative">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
            <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
              <div>
                {format(currentTime, "EEEE")}
                <br />
                {format(currentTime, "MMM d, yyyy")}
              </div>
              <div className="font-mono self-end">
                {format(currentTime, "HH:mm")}
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Workouts
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
