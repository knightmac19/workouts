import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Play, Loader2 } from "lucide-react";

export function TodayWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayWorkouts = async () => {
      try {
        setLoading(true);
        const today = new Date().toLocaleDateString("en-US", {
          weekday: "long",
        });
        console.log("Fetching workouts for:", today);

        // Fetch weekly schedule
        const scheduleRef = doc(db, "settings", "weeklySchedule");
        const scheduleDoc = await getDoc(scheduleRef);

        if (!scheduleDoc.exists()) {
          setWorkouts([]);
          return;
        }

        const schedule = scheduleDoc.data().schedule;
        const todaysWorkouts = schedule[today] || [];
        console.log("Today's scheduled workouts:", todaysWorkouts);

        const workoutDetails = await Promise.all(
          todaysWorkouts.map(async (workoutName) => {
            // Normalize the workout name to camelCase for the document ID
            const normalizedName = workoutName
              .split(" ")
              .map((word, index) =>
                index === 0
                  ? word.toLowerCase()
                  : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join("");

            console.log("Looking for workout template:", normalizedName);
            const workoutRef = doc(db, "workoutTemplates", normalizedName);
            const workoutDoc = await getDoc(workoutRef);

            if (workoutDoc.exists()) {
              console.log("Found workout template:", workoutDoc.data());
              return {
                id: normalizedName, // Keep the normalized name for routing
                name: workoutName, // Keep original name for display
                templateId: normalizedName, // Add explicit template ID
                ...workoutDoc.data(),
              };
            } else {
              console.log("Workout template not found:", normalizedName);
              // Return a basic workout object if template doesn't exist
              return {
                id: normalizedName,
                name: workoutName,
                templateId: normalizedName,
                type: workoutName.toLowerCase(),
                description: `${workoutName} workout`,
              };
            }
          })
        );

        console.log("Final workout details:", workoutDetails);
        setWorkouts(workoutDetails.filter(Boolean));
      } catch (err) {
        console.error("Error fetching today's workouts:", err);
        setError("Failed to load today's workouts");
      } finally {
        setLoading(false);
      }
    };

    fetchTodayWorkouts();
  }, []);

  const handleStartWorkout = (templateId) => {
    console.log("Starting workout with template ID:", templateId);
    navigate(`/workoutTemplates/${templateId}`);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          No workouts scheduled for today
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Today's Workouts
        </h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {workout.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {workout.type || "General workout"}
                </p>
              </div>
              <button
                onClick={() => handleStartWorkout(workout.templateId)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Play size={16} />
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
