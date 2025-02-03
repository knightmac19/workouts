// src/components/workouts/WorkoutSession.jsx
import React, { useState } from "react";
import { Timer } from "../common/Timer";
import { ChevronDown, ChevronUp, Info, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkoutSession({ workout }) {
  const navigate = useNavigate();
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showInfo, setShowInfo] = useState(null);
  const [exerciseData, setExerciseData] = useState(
    workout.exercises.map((exercise) => ({
      ...exercise,
      sets: Array(exercise.sets).fill({
        weight: "",
        reps: "",
        rpe: "",
        completed: false,
      }),
    }))
  );

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

  const handleSaveWorkout = async () => {
    // TODO: Implement save to Firebase
    console.log("Saving workout data:", exerciseData);
    navigate("/");
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900"
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

      <h1 className="text-2xl font-bold mb-6">{workout.name}</h1>

      {exerciseData.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="bg-white rounded-lg shadow">
          <div
            onClick={() =>
              setExpandedExercise(
                expandedExercise === exerciseIndex ? null : exerciseIndex
              )
            }
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{exercise.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(
                    showInfo === exerciseIndex ? null : exerciseIndex
                  );
                }}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <Info size={16} className="text-gray-500" />
              </button>
            </div>
            {expandedExercise === exerciseIndex ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>

          {showInfo === exerciseIndex && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
              <p className="text-sm text-blue-700">
                {exercise.description || "No description available"}
              </p>
            </div>
          )}

          {expandedExercise === exerciseIndex && (
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Sets:</span>
                  <span className="ml-2 font-medium">{exercise.sets}</span>
                </div>
                <div>
                  <span className="text-gray-600">Reps:</span>
                  <span className="ml-2 font-medium">{exercise.reps}</span>
                </div>
                {workout.type === "hypertrophy" && (
                  <div>
                    <span className="text-gray-600">Target RPE:</span>
                    <span className="ml-2 font-medium">{exercise.rpe}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-4">
                    <span className="w-8 text-gray-500">#{setIndex + 1}</span>
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
                          className="w-20 p-2 border rounded"
                          placeholder="Weight"
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
                          className="w-20 p-2 border rounded"
                          placeholder="Reps"
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
                          className="w-20 p-2 border rounded"
                          placeholder="RPE"
                        />
                      </>
                    )}
                    {workout.type !== "hypertrophy" && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={set.completed}
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
                        <span>Completed</span>
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
                    className="w-full p-2 border rounded"
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
