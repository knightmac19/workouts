// src/components/workouts/WorkoutSession.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Timer } from "../common/Timer";
import { ChevronDown, ChevronUp, Info, Save, ArrowLeft } from "lucide-react";

export default function WorkoutSession() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  // Load workout template
  useEffect(() => {
    const loadWorkout = async () => {
      try {
        // In production, you'd fetch this from Firebase
        // For now, we'll use the Lower Body 1 template as an example
        const workoutData = {
          id: "lower-1",
          name: "Lower Body 1",
          type: "hypertrophy",
          exercises: [
            {
              name: "Back squat",
              sets: 3,
              reps: "10",
              rpe: 7,
              restPeriod: 150,
            },
            {
              name: "Romanian deadlift",
              sets: 3,
              reps: "12",
              rpe: 7,
              restPeriod: 120,
            },
            {
              name: "Barbell hip thrust",
              sets: 3,
              reps: "12",
              rpe: 8,
              restPeriod: 90,
            },
            {
              name: "Leg extension",
              sets: 3,
              reps: "15",
              rpe: 9,
              restPeriod: 60,
            },
            {
              name: "Leg curl",
              sets: 3,
              reps: "15",
              rpe: 9,
              restPeriod: 60,
            },
            {
              name: "Hip abduction",
              sets: 3,
              reps: "8",
              rpe: 7,
              restPeriod: 45,
            },
            // Abs circuit
            {
              name: "Abs: side-to-side",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 0,
            },
            {
              name: "Abs: elbow-knee",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 30,
            },
            {
              name: "Abs: push-thru",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 0,
            },
            {
              name: "Abs: 4x legs",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 30,
            },
            {
              name: "Abs: slide-up-knee",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 0,
            },
            {
              name: "Abs: leg-up-hand-to-heel",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 30,
            },
            {
              name: "Abs: x-arm crunch",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 0,
            },
            {
              name: "Abs: double crunch",
              sets: 1,
              reps: "30",
              rpe: 7,
              restPeriod: 30,
            },
          ],
        };

        setWorkout(workoutData);
        setExercises(
          workoutData.exercises.map((exercise) => ({
            ...exercise,
            sets: Array(exercise.sets).fill({
              weight: "",
              reps: "",
              rpe: "",
              completed: false,
            }),
          }))
        );
        setLoading(false);
      } catch (err) {
        setError("Error loading workout");
        console.error(err);
        setLoading(false);
      }
    };

    loadWorkout();
  }, [templateId]);

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setExercises((prev) => {
      const newExercises = [...prev];
      newExercises[exerciseIndex].sets[setIndex] = {
        ...newExercises[exerciseIndex].sets[setIndex],
        [field]: value,
      };
      return newExercises;
    });
  };

  const markSetComplete = (exerciseIndex, setIndex) => {
    updateSet(exerciseIndex, setIndex, "completed", true);
  };

  const saveWorkout = async () => {
    try {
      // Save workout progress to Firebase
      const workoutSession = {
        templateId,
        date: new Date(),
        exercises,
        completed: true,
      };

      // In production, you'd save this to Firebase
      console.log("Saving workout:", workoutSession);

      // Navigate to workout summary
      navigate("/history");
    } catch (err) {
      console.error("Error saving workout:", err);
    }
  };

  if (loading) return <div>Loading workout...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!workout) return <div>No workout found</div>;

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
          onClick={saveWorkout}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Save className="w-4 h-4" />
          Save Workout
        </button>
      </div>

      {/* Workout Title */}
      <h1 className="text-2xl font-bold">{workout.name}</h1>

      {/* Exercises */}
      {exercises.map((exercise, exerciseIndex) => (
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

          {/* Exercise Info */}
          {showInfo === exerciseIndex && (
            <div className="px-4 py-2 bg-blue-50">
              <p className="text-sm text-blue-800">
                {exercise.description || "No description available"}
              </p>
            </div>
          )}

          {/* Exercise Details */}
          {expandedExercise === exerciseIndex && (
            <div className="p-4 border-t">
              <div className="space-y-4">
                {/* Sets */}
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-4">
                    <span className="w-8 text-gray-500">#{setIndex + 1}</span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(
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
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(
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
                      value={set.rpe}
                      onChange={(e) =>
                        updateSet(
                          exerciseIndex,
                          setIndex,
                          "rpe",
                          e.target.value
                        )
                      }
                      className="w-20 p-2 border rounded"
                      placeholder="RPE"
                    />
                  </div>
                ))}

                {/* Timer */}
                <div className="mt-4">
                  <Timer
                    initialTime={exercise.restPeriod}
                    onComplete={() => console.log("Rest period complete")}
                  />
                </div>

                {/* Notes */}
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
