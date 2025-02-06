import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ChevronDown, ChevronUp, Plus, X, AlertCircle } from "lucide-react";

export function WeeklySchedule() {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Initialize from localStorage, default to false
    const stored = localStorage.getItem("weeklyScheduleExpanded");
    return stored ? JSON.parse(stored) : false;
  });
  const [schedule, setSchedule] = useState({});
  const [availableWorkouts, setAvailableWorkouts] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [error, setError] = useState(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("weeklyScheduleExpanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  // Initial schedule data
  const defaultSchedule = {
    Monday: ["mobility medium", "ancillary", "lower body 1"],
    Tuesday: [
      "mobility short",
      "iron neck",
      "ancillary",
      "upper body push",
      "tabata",
    ],
    Wednesday: ["mobility long", "ancillary"],
    Thursday: ["mobility short", "iron neck", "ancillary", "lower body 2"],
    Friday: ["mobility medium", "upper body pull", "zone 2"],
    Saturday: ["mobility long", "iron neck", "ancillary"],
    Sunday: ["mobility long"],
  };

  const normalizeWorkoutName = (name) => {
    return name
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleRef = doc(db, "settings", "weeklySchedule");
        const scheduleDoc = await getDoc(scheduleRef);

        if (!scheduleDoc.exists()) {
          // Initialize with default schedule if none exists
          await setDoc(scheduleRef, { schedule: defaultSchedule });
          setSchedule(defaultSchedule);
        } else {
          setSchedule(scheduleDoc.data().schedule);
        }
      } catch (err) {
        setError("Failed to load schedule");
        console.error("Error loading schedule:", err);
      }
    };

    const fetchAvailableWorkouts = async () => {
      try {
        const workoutRef = doc(db, "workoutTemplates", "available");
        const workoutDoc = await getDoc(workoutRef);

        if (workoutDoc.exists()) {
          setAvailableWorkouts(workoutDoc.data().workouts);
        }
      } catch (err) {
        console.error("Error loading available workouts:", err);
      }
    };

    fetchSchedule();
    fetchAvailableWorkouts();
  }, []);

  const handleAddWorkout = async (day) => {
    if (!selectedWorkout) return;

    try {
      const updatedSchedule = {
        ...schedule,
        [day]: [...(schedule[day] || []), selectedWorkout],
      };

      const scheduleRef = doc(db, "settings", "weeklySchedule");
      await updateDoc(scheduleRef, { schedule: updatedSchedule });

      setSchedule(updatedSchedule);
      setSelectedWorkout("");
      setSelectedDay(null);
    } catch (err) {
      setError("Failed to add workout");
      console.error("Error adding workout:", err);
    }
  };

  const handleDeleteWorkout = async (day, workout) => {
    try {
      const updatedSchedule = {
        ...schedule,
        [day]: schedule[day].filter((w) => w !== workout),
      };

      const scheduleRef = doc(db, "settings", "weeklySchedule");
      await updateDoc(scheduleRef, { schedule: updatedSchedule });

      setSchedule(updatedSchedule);
    } catch (err) {
      setError("Failed to delete workout");
      console.error("Error deleting workout:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div
        className="p-4 flex justify-between items-center cursor-pointer border-b border-gray-200 dark:border-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Weekly Schedule
        </h2>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 m-4 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {isExpanded && (
        <div className="p-4 space-y-4">
          {days.map((day) => (
            <div key={day} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {day}
                </h3>
                <button
                  onClick={() => setSelectedDay(day)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {schedule[day]?.map((workout) => (
                  <div
                    key={workout}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {workout}
                    </span>
                    <button
                      onClick={() => handleDeleteWorkout(day, workout)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Workout Modal */}
          {selectedDay && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-medium mb-4">
                  Add Workout to {selectedDay}
                </h3>
                <select
                  value={selectedWorkout}
                  onChange={(e) => setSelectedWorkout(e.target.value)}
                  className="w-full mb-4 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                >
                  <option value="">Select a workout</option>
                  {availableWorkouts.map((workout) => (
                    <option key={workout} value={workout}>
                      {workout}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddWorkout(selectedDay)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
