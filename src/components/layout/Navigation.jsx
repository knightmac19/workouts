// src/components/layout/Navigation.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  History as HistoryIcon,
  LineChart,
  Dumbbell,
} from "lucide-react";

export function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/history", icon: HistoryIcon, label: "History" },
    { path: "/progress", icon: LineChart, label: "Progress" },
    { path: "/jiujitsu", icon: Dumbbell, label: "Jiu Jitsu" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-3">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center ${
                isActive(path) ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
