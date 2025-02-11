// src/components/workouts/WorkoutSession.jsx
import React, { useEffect, useCallback } from "react";
import { Timer } from "../common/Timer";
import { ChevronDown, ChevronUp, Info, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-hot-toast";
import {
  usePersistState,
  clearPersistedState,
} from "../../hooks/usePersistState";

export default function WorkoutSession({ workout }) {
  const navigate = useNavigate();

  // Initialize all state with usePersistState
  const [expandedExercise, setExpandedExercise, expandedLoading] =
    usePersistState(`workout_${workout.id}_expanded`, null);

  const [showInfo, setShowInfo, infoLoading] = usePersistState(
    `workout_${workout.id}_showInfo`,
    null
  );

  const [isSaving, setIsSaving, savingLoading] = usePersistState(
    `workout_${workout.id}_saving`,
    false
  );

  const [exerciseData, setExerciseData, dataLoading] = usePersistState(
    `workout_${workout.id}_data`,
    workout.exercises.map((exercise) => ({
      ...exercise,
      sets: Array.from({ length: exercise.sets }, () => ({
        weight: "",
        reps: "",
        rpe: "",
        completed: false,
      })),
    }))
  );

  const isLoading =
    expandedLoading || infoLoading || savingLoading || dataLoading;

  const cleanupState = useCallback(async () => {
    if (!isSaving) {
      try {
        await Promise.all([
          clearPersistedState(`workout_${workout.id}_data`),
          clearPersistedState(`workout_${workout.id}_expanded`),
          clearPersistedState(`workout_${workout.id}_showInfo`),
          clearPersistedState(`workout_${workout.id}_saving`),
        ]);
      } catch (error) {
        console.error("Error clearing persisted state:", error);
      }
    }
  }, [workout.id, isSaving]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cleanupState();
    };
  }, [cleanupState]);

  const handleSetUpdate = (exerciseIndex, setIndex, field, value) => {
    setExerciseData((prevData) => {
      const newData = [...prevData];
      newData[exerciseIndex].sets[setIndex] = {
        ...newData[exerciseIndex].sets[setIndex],
        [field]: value,
      };
      return newData;
    });
  };

  const handleNavigateBack = async () => {
    await cleanupState();
    navigate("/");
  };

  const handleSaveWorkout = async () => {
    try {
      setIsSaving(true);
      const hasEmptySets = exerciseData.some((exercise) =>
        exercise.sets.some(
          (set) =>
            workout.type === "hypertrophy" &&
            (!set.weight || !set.reps || !set.rpe)
        )
      );

      if (hasEmptySets) {
        toast.error("Please complete all set data before saving");
        setIsSaving(false);
        return;
      }

      const workoutToSave = {
        templateId: workout.id,
        name: workout.name,
        type: workout.type || "hypertrophy",
        completedAt: serverTimestamp(),
        exercises: exerciseData.map((exercise) => ({
          name: exercise.name,
          targetSets: exercise.sets.length,
          targetReps: parseInt(exercise.reps) || 0,
          targetRpe: parseInt(exercise.rpe) || 0,
          sets: exercise.sets.map((set) => ({
            weight: parseInt(set.weight) || 0,
            reps: parseInt(set.reps) || 0,
            rpe: parseFloat(set.rpe) || 0,
            completed: Boolean(set.completed),
          })),
        })),
      };

      const workoutRef = await addDoc(
        collection(db, "completedWorkouts"),
        workoutToSave
      );

      toast.success("Workout saved successfully!");
      await cleanupState();
      navigate("/history");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isSaving
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          } text-white`}
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Workout"}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {workout.name}
      </h1>

      {exerciseData.map((exercise, exerciseIndex) => (
        <div
          key={exerciseIndex}
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div
            onClick={() =>
              setExpandedExercise(
                expandedExercise === exerciseIndex ? null : exerciseIndex
              )
            }
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {exercise.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(
                    showInfo === exerciseIndex ? null : exerciseIndex
                  );
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
              >
                <Info size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            {expandedExercise === exerciseIndex ? (
              <ChevronUp
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />
            ) : (
              <ChevronDown
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />
            )}
          </div>

          {showInfo === exerciseIndex && (
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900 border-t border-blue-100 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                {exercise.description || "No description available"}
              </p>
            </div>
          )}

          {expandedExercise === exerciseIndex && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Sets:{" "}
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {workout.exercises[exerciseIndex].sets}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Reps:{" "}
                  </span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {exercise.reps}
                  </span>
                </div>
                {workout.type === "hypertrophy" && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Target RPE:{" "}
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {exercise.rpe}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Add Set Button */}
                <button
                  onClick={() => {
                    setExerciseData((prevData) => {
                      const newData = [...prevData];
                      const currentExercise = { ...newData[exerciseIndex] };
                      currentExercise.sets = [
                        ...currentExercise.sets,
                        {
                          weight: "",
                          reps: "",
                          rpe: "",
                          completed: false,
                        },
                      ];
                      newData[exerciseIndex] = currentExercise;
                      return newData;
                    });
                  }}
                  className="w-full px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                >
                  + Add Set
                </button>

                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-gray-500 dark:text-gray-400">
                        #{setIndex + 1}
                      </span>
                      {/* Remove Set Button */}
                      {exercise.sets.length > 1 && (
                        <button
                          onClick={() => {
                            setExerciseData((prevData) => {
                              const newData = [...prevData];
                              const currentExercise = {
                                ...newData[exerciseIndex],
                              };
                              currentExercise.sets =
                                currentExercise.sets.filter(
                                  (_, i) => i !== setIndex
                                );
                              newData[exerciseIndex] = currentExercise;
                              return newData;
                            });
                          }}
                          className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                          title="Remove set"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {workout.type === "hypertrophy" && (
                      <>
                        <input
                          type="number"
                          value={set.weight || ""}
                          onChange={(e) =>
                            handleSetUpdate(
                              exerciseIndex,
                              setIndex,
                              "weight",
                              e.target.value
                            )
                          }
                          className="w-20 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          placeholder="Weight"
                          min="0"
                        />
                        <input
                          type="number"
                          value={set.reps || ""}
                          onChange={(e) =>
                            handleSetUpdate(
                              exerciseIndex,
                              setIndex,
                              "reps",
                              e.target.value
                            )
                          }
                          className="w-20 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          placeholder="Reps"
                          min="0"
                        />
                        <input
                          type="number"
                          value={set.rpe || ""}
                          onChange={(e) =>
                            handleSetUpdate(
                              exerciseIndex,
                              setIndex,
                              "rpe",
                              e.target.value
                            )
                          }
                          className="w-20 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                          placeholder="RPE"
                          min="0"
                          max="10"
                          step="0.5"
                        />
                      </>
                    )}
                    {workout.type !== "hypertrophy" && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={set.completed || false}
                          onChange={(e) =>
                            handleSetUpdate(
                              exerciseIndex,
                              setIndex,
                              "completed",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-gray-900 dark:text-white">
                          Completed
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {exercise.restPeriod > 0 && (
                  <div className="mt-4">
                    <Timer
                      initialTime={exercise.restPeriod}
                      onComplete={() => console.log("Rest period complete")}
                    />
                  </div>
                )}

                <div className="mt-4">
                  <textarea
                    placeholder="Notes for this exercise..."
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                    rows="2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
