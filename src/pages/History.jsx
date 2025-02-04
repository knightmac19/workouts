import { useState, useEffect } from "react";
import { format } from "date-fns";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function History() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workoutTypes = [
    { value: "all", label: "All" },
    { value: "mobility", label: "Mobility" },
    { value: "iron_neck", label: "Iron Neck" },
    { value: "ancillary", label: "Ancillary" },
    { value: "hypertrophy", label: "Hypertrophy" },
    { value: "cardio", label: "Cardio" },
    { value: "jiujitsu", label: "Jiu Jitsu" },
  ];

  useEffect(() => {
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

    fetchWorkouts();
  }, []);

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
        {error}
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
              <div className="flex justify-end">
                <button
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
