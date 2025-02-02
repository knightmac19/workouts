// src/hooks/useTimer.js
import { useState, useEffect, useCallback } from "react";

export const useTimer = (initialTime) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = useCallback(() => {
    if (!isActive && time > 0) {
      const id = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(id);
            setIsActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
      setIsActive(true);
    }
  }, [isActive, time]);

  const pauseTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsActive(false);
  }, [intervalId]);

  const resetTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTime(initialTime);
    setIsActive(false);
  }, [initialTime, intervalId]);

  const toggleTimer = useCallback(() => {
    if (isActive) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [isActive, pauseTimer, startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    time,
    isActive,
    toggleTimer,
    resetTimer,
  };
};
