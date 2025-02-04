// src/pages/WorkoutDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Loader2 } from "lucide-react";

export function WorkoutDetails() {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);

  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        setLoading(true);
        const workoutRef = doc(db, "completedWorkouts", workoutId);
        const workoutDoc = await getDoc(workoutRef);

        if (!workoutDoc.exists()) {
          setError("Workout not found");
          return;
        }

        const workoutData = {
          id: workoutDoc.id,
          ...workoutDoc.data(),
          completedAt: workoutDoc.data().completedAt?.toDate() || new Date(),
        };

        setWorkout(workoutData);
      } catch (err) {
        console.error("Error fetching workout:", err);
        setError("Failed to load workout details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [workoutId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => navigate("/history")}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Return to History
        </button>
      </div>
    );
  }

  if (!workout) return null;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/history")}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to History
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(workout.completedAt, "MMMM d, yyyy 'at' h:mm a")}
        </span>
      </div>

      {/* Workout Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {workout.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 capitalize">
          {workout.type.replace("_", " ")}
        </p>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {workout.exercises.map((exercise, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <div
              onClick={() =>
                setExpandedExercise(expandedExercise === index ? null : index)
              }
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {exercise.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {exercise.sets.length} sets - Target: {exercise.targetSets}{" "}
                  sets
                </p>
              </div>
              {expandedExercise === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </div>

            {expandedExercise === index && (
              <div className="px-4 pb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                          Set
                        </th>
                        {workout.type === "hypertrophy" && (
                          <>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              Weight
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              Reps
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              RPE
                            </th>
                          </>
                        )}
                        {workout.type !== "hypertrophy" && (
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Completed
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIndex) => (
                        <tr key={setIndex}>
                          <td className="px-4 py-2 text-gray-900 dark:text-white">
                            #{setIndex + 1}
                          </td>
                          {workout.type === "hypertrophy" && (
                            <>
                              <td className="px-4 py-2 text-gray-900 dark:text-white">
                                {set.weight} lbs
                              </td>
                              <td className="px-4 py-2 text-gray-900 dark:text-white">
                                {set.reps}
                              </td>
                              <td className="px-4 py-2 text-gray-900 dark:text-white">
                                {set.rpe}
                              </td>
                            </>
                          )}
                          {workout.type !== "hypertrophy" && (
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded text-sm ${
                                  set.completed
                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                    : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                                }`}
                              >
                                {set.completed ? "Yes" : "No"}
                              </span>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
