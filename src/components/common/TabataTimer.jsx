// src/components/common/TabataTimer.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export function TabataTimer({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [isWorkPeriod, setIsWorkPeriod] = useState(true);
  const TOTAL_SETS = 8;
  const WORK_TIME = 20;
  const REST_TIME = 10;

  const resetTimer = useCallback(() => {
    setTimeLeft(WORK_TIME);
    setCurrentSet(0);
    setIsActive(false);
    setIsWorkPeriod(true);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time period completed
            if (isWorkPeriod) {
              // Work period just finished
              if (currentSet < TOTAL_SETS - 1) {
                // More sets to go
                setIsWorkPeriod(false);
                return REST_TIME;
              } else {
                // Last set completed
                setIsActive(false);
                if (onComplete) onComplete();
                return 0;
              }
            } else {
              // Rest period just finished
              setCurrentSet((prev) => prev + 1);
              setIsWorkPeriod(true);
              return WORK_TIME;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, currentSet, isWorkPeriod, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Generate set indicators
  const renderSetIndicators = () => {
    return Array(TOTAL_SETS)
      .fill(null)
      .map((_, index) => (
        <div
          key={index}
          className={`h-2 w-8 rounded-full ${
            index <= currentSet && !isWorkPeriod
              ? "bg-green-500"
              : index < currentSet
              ? "bg-green-500"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
      ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            isWorkPeriod
              ? "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
          }`}
        >
          {isActive ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          <span
            className={`font-mono text-2xl ${
              isWorkPeriod
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {timeLeft}
          </span>
        </button>
      </div>

      <div className="flex justify-center items-center gap-2">
        {renderSetIndicators()}
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-300">
        Set {currentSet + 1} of 8 - {isWorkPeriod ? "Work" : "Rest"}
      </div>
    </div>
  );
}
