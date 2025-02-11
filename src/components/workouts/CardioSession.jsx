// src/components/workouts/CardioSession.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TabataTimer } from "../common/TabataTimer";
import { Save, ArrowLeft, Clock } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import {
  usePersistState,
  clearPersistedState,
} from "../../hooks/usePersistState";

export function CardioSession({ workout }) {
  const navigate = useNavigate();
  const [duration, setDuration] = usePersistState(
    `cardio_${workout.id}_duration`,
    ""
  );
  const [notes, setNotes] = usePersistState(`cardio_${workout.id}_notes`, "");
  const [intensity, setIntensity] = usePersistState(
    `cardio_${workout.id}_intensity`,
    ""
  );
  const [isCompleted, setIsCompleted] = usePersistState(
    `cardio_${workout.id}_completed`,
    false
  );
  const [distance, setDistance] = usePersistState(
    `cardio_${workout.id}_distance`,
    ""
  );
  const [equipment, setEquipment] = usePersistState(
    `cardio_${workout.id}_equipment`,
    ""
  );

  // Handle cleanup when navigating away
  useEffect(() => {
    const cleanup = () => {
      Promise.all([
        clearPersistedState(`cardio_${workout.id}_duration`),
        clearPersistedState(`cardio_${workout.id}_notes`),
        clearPersistedState(`cardio_${workout.id}_intensity`),
        clearPersistedState(`cardio_${workout.id}_completed`),
        clearPersistedState(`cardio_${workout.id}_distance`),
        clearPersistedState(`cardio_${workout.id}_equipment`),
      ]).catch((error) => {
        console.error("Error clearing persisted state:", error);
      });
    };

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
      cleanup();
    };
  }, [workout.id]);

  const handleNavigateBack = async () => {
    // Clear persisted state before navigating
    await Promise.all([
      clearPersistedState(`cardio_${workout.id}_duration`),
      clearPersistedState(`cardio_${workout.id}_notes`),
      clearPersistedState(`cardio_${workout.id}_intensity`),
      clearPersistedState(`cardio_${workout.id}_completed`),
      clearPersistedState(`cardio_${workout.id}_distance`),
      clearPersistedState(`cardio_${workout.id}_equipment`),
    ]);

    navigate("/");
  };

  const handleSaveWorkout = async () => {
    try {
      // Basic validation
      if (!duration) {
        toast.error("Please enter a duration");
        return;
      }
      if (!intensity) {
        toast.error("Please enter an intensity");
        return;
      }
      if (workout.id === "zone2" && !distance) {
        toast.error("Please enter a distance");
        return;
      }
      if (workout.id === "zone2" && !equipment) {
        toast.error("Please select equipment");
        return;
      }

      const workoutData = {
        type: "cardio",
        templateId: workout.id,
        name: workout.name,
        duration: parseInt(duration),
        intensity: parseInt(intensity),
        notes: notes.trim(),
        completed: isCompleted,
        completedAt: serverTimestamp(),
        distance: distance ? parseFloat(distance) : null,
        equipment: equipment || null,
      };

      // Save to Firebase
      const workoutRef = await addDoc(
        collection(db, "completedWorkouts"),
        workoutData
      );

      console.log("Saved workout with ID:", workoutRef.id);
      toast.success("Workout saved successfully!");

      // Clear persisted state after successful save
      await Promise.all([
        clearPersistedState(`cardio_${workout.id}_duration`),
        clearPersistedState(`cardio_${workout.id}_notes`),
        clearPersistedState(`cardio_${workout.id}_intensity`),
        clearPersistedState(`cardio_${workout.id}_completed`),
        clearPersistedState(`cardio_${workout.id}_distance`),
        clearPersistedState(`cardio_${workout.id}_equipment`),
      ]);

      navigate("/history");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout");
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleNavigateBack}
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
            <TabataTimer
              onComplete={() => {
                setIsCompleted(true);
                setDuration("4"); // 4 minutes total for Tabata
                setIntensity("10"); // Maximum intensity
              }}
            />
          </div>
        )}

        {workout.id === "zone2" && (
          <>
            {/* Equipment Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Equipment
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select equipment...</option>
                <option value="treadmill">Treadmill</option>
                <option value="bike">Stationary Bike</option>
                <option value="jogging">Jogging Outside</option>
                <option value="rowing">Rowing Machine</option>
                <option value="elliptical">Elliptical</option>
                <option value="stairmaster">Stairmaster</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Distance Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Distance (miles)
              </label>
              <input
                type="number"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter distance"
              />
            </div>
          </>
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
