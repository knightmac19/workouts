// src/components/common/Timer.jsx
import { useTimer } from "../../hooks/UseTimer";
import { Play, Pause } from "lucide-react";

export function Timer({ initialTime = 0, onComplete }) {
  const { time, isActive, toggleTimer, resetTimer } = useTimer(initialTime);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = (e) => {
    // Handle double click
    if (e.detail === 2) {
      resetTimer();
      return;
    }
    // Handle single click
    toggleTimer();
  };

  // Optionally call onComplete when timer reaches 0
  if (time === 0 && onComplete) {
    onComplete();
  }

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${
            initialTime === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isActive
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        disabled={initialTime === 0}
      >
        {isActive ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        <span className="font-mono text-lg">{formatTime(time)}</span>
      </button>
    </div>
  );
}
