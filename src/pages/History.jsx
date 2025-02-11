// src/pages/History.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Loader2, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function History() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingWorkout, setDeletingWorkout] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const workoutTypes = [
    { value: "all", label: "All" },
    { value: "mobility", label: "Mobility" },
    { value: "iron_neck", label: "Iron Neck" },
    { value: "ancillary", label: "Ancillary" },
    { value: "hypertrophy", label: "Hypertrophy" },
    { value: "cardio", label: "Cardio" },
    { value: "jiujitsu", label: "Jiu Jitsu" },
  ];

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const workoutsRef = collection(db, "completedWorkouts");
      const q = query(workoutsRef, orderBy("completedAt", "desc"));
      const querySnapshot = await getDocs(q);

      const workoutData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      }));

      setWorkouts(workoutData);
      setError(null);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      setError("Failed to load workout history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDeleteClick = (workout) => {
    setDeletingWorkout(workout);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingWorkout) return;

    try {
      await deleteDoc(doc(db, "completedWorkouts", deletingWorkout.id));

      // Remove the workout from local state
      setWorkouts(workouts.filter((w) => w.id !== deletingWorkout.id));

      setShowDeleteConfirm(false);
      setDeletingWorkout(null);
    } catch (err) {
      console.error("Error deleting workout:", err);
      setError("Failed to delete workout");
    }
  };

  const filteredWorkouts =
    selectedType === "all"
      ? workouts
      : workouts.filter((workout) => workout.type === selectedType);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-2">
          {workoutTypes.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedType(value)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedType === value
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filteredWorkouts.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          No workouts found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {workout.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {workout.type.replace("_", " ")}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(workout.completedAt, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {workout.exercises &&
                  workout.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {exercise.name}
                      {workout.type === "hypertrophy" && (
                        <span className="ml-1">
                          ({exercise.sets.length} sets)
                        </span>
                      )}
                    </div>
                  ))}
              </div>
              <div className="flex justify-end items-center gap-4">
                <button
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteClick(workout)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  aria-label="Delete workout"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete Workout?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this workout? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingWorkout(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
