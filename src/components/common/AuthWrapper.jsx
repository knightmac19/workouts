import React, { useState } from "react";
import { Login, SignUp } from "./auth/AuthForms";
import { useAuth } from "../contexts/AuthContext";

export function AuthWrapper({ children }) {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <Login onToggleForm={() => setShowLogin(false)} />
    ) : (
      <SignUp onToggleForm={() => setShowLogin(true)} />
    );
  }

  return children;
}
