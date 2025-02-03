// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { Dumbbell, Brain, Activity, Clock, ChevronRight } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();

  const hypertrophyWorkouts = [
    {
      id: "lower-1",
      name: "Lower Body 1",
      description: "Focus on squat and hip hinge movements",
    },
    {
      id: "upper-push",
      name: "Upper Push",
      description: "Chest, shoulders, and triceps",
    },
    {
      id: "lower-2",
      name: "Lower Body 2",
      description: "Focus on deadlift and single-leg work",
    },
    { id: "upper-pull", name: "Upper Pull", description: "Back and biceps" },
  ];

  const startWorkout = (templateId) => {
    navigate(`/workout/new/${templateId}`);
  };

  return (
    <div className="space-y-6">
      {/* Quick Start Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hypertrophy Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hypertrophyWorkouts.map((workout) => (
            <button
              key={workout.id}
              onClick={() => startWorkout(workout.id)}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Dumbbell size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{workout.name}</h3>
                  <p className="text-sm text-gray-600">{workout.description}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </button>
          ))}
        </div>
      </section>

      {/* Other Workout Types */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Other Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Brain size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Mobility</h3>
              <p className="text-sm text-gray-600">Short, medium, or long</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Iron Neck</h3>
              <p className="text-sm text-gray-600">Neck strengthening</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Cardio</h3>
              <p className="text-sm text-gray-600">Tabata or Zone 2</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
