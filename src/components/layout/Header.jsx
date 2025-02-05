import { ThemeToggle } from "../Common/ThemeToggle";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function Header() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will happen automatically due to AuthWrapper
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow w-full">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Training Log
            </h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
