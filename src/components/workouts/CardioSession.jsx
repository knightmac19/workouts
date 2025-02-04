// src/components/workouts/CardioSession.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Timer } from "../common/Timer";
import { Save, ArrowLeft, Clock } from "lucide-react";

export function CardioSession({ workout }) {
  const navigate = useNavigate();
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [intensity, setIntensity] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSaveWorkout = async () => {
    // TODO: Save to Firebase
    const workoutData = {
      type: "cardio",
      workoutId: workout.id,
      name: workout.name,
      duration: duration,
      intensity: intensity,
      notes: notes,
      completed: isCompleted,
      timestamp: new Date().toISOString(),
    };

    console.log("Saving cardio workout:", workoutData);
    navigate("/");
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <button
          onClick={handleSaveWorkout}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Save className="w-4 h-4" />
          Save Workout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {workout.name}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        {workout.id === "tabata" && (
          <div className="mb-4">
            <Timer initialTime={480} /> {/* 8 minutes for Tabata */}
          </div>
        )}

        {/* Duration Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter duration"
          />
        </div>

        {/* Intensity Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Intensity (RPE 1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter RPE"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="3"
            placeholder="Add any notes about your workout..."
          />
        </div>

        {/* Completion Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="completed"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label
            htmlFor="completed"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Mark as completed
          </label>
        </div>
      </div>
    </div>
  );
}
