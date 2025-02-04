import React, { useState, useEffect } from "react";
import { Timer } from "../common/Timer";
import { ChevronDown, ChevronUp, Info, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkoutSession({ workout }) {
  const navigate = useNavigate();
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  // Log the workout prop for debugging
  console.log("Workout prop:", JSON.stringify(workout, null, 2));

  // Initialize exercise data with explicit type checking
  const [exerciseData, setExerciseData] = useState(() => {
    return (workout.exercises || []).map((exercise) => {
      const setCount = typeof exercise.sets === "number" ? exercise.sets : 0;
      return {
        ...exercise,
        sets: Array.from({ length: setCount }, () => ({
          weight: "",
          reps: "",
          rpe: "",
          completed: false,
        })),
      };
    });
  });

  // Log exercise data for debugging
  console.log("Exercise data:", JSON.stringify(exerciseData, null, 2));

  const handleSetUpdate = (exerciseIndex, setIndex, field, value) => {
    setExerciseData((prevData) => {
      const newData = [...prevData];
      if (
        newData[exerciseIndex] &&
        newData[exerciseIndex].sets &&
        newData[exerciseIndex].sets[setIndex]
      ) {
        newData[exerciseIndex].sets[setIndex] = {
          ...newData[exerciseIndex].sets[setIndex],
          [field]: value,
        };
      }
      return newData;
    });
  };

  const handleSaveWorkout = async () => {
    console.log("Saving workout data:", exerciseData);
    navigate("/");
  };

  // Render nothing if no workout data
  if (!workout || !workout.exercises) {
    return (
      <div className="text-center text-gray-900 dark:text-white">
        No workout data available
      </div>
    );
  }

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
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          <Save className="w-4 h-4" />
          Save Workout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {workout.name || "Unnamed Workout"}
      </h1>

      {exerciseData.map((exercise, exerciseIndex) => {
        // Ensure exercise has all required properties
        const exerciseName = exercise?.name || "Unnamed Exercise";
        const exerciseSets =
          typeof exercise?.sets === "number" ? exercise.sets : 0;
        const exerciseReps = exercise?.reps?.toString() || "";
        const exerciseRpe = exercise?.rpe?.toString() || "";

        return (
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
                  {exerciseName}
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
                  <Info
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />
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
                      {exerciseReps}
                    </span>
                  </div>
                  {workout.type === "hypertrophy" && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Target RPE:{" "}
                      </span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {exerciseRpe}
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

                  {exercise.sets &&
                    exercise.sets.map((_, setIndex) => (
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
                        {workout.type === "hypertrophy" ? (
                          <>
                            <input
                              type="number"
                              value={exercise.sets[setIndex]?.weight || ""}
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
                              value={exercise.sets[setIndex]?.reps || ""}
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
                              value={exercise.sets[setIndex]?.rpe || ""}
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
                        ) : (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                exercise.sets[setIndex]?.completed || false
                              }
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
        );
      })}
    </div>
  );
}
