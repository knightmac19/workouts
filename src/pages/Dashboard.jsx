// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { Dumbbell, Brain, Activity, Clock, ChevronRight } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();

  const workoutTypes = {
    hypertrophy: [
      {
        id: "lowerBody1",
        name: "Lower Body 1",
        description: "Focus on squat and hip hinge movements",
      },
      {
        id: "lowerBody2",
        name: "Lower Body 2",
        description: "Focus on deadlift and single-leg work",
      },
      {
        id: "upperPush",
        name: "Upper Body Push",
        description: "Focus on chest, shoulders, and triceps",
      },
      {
        id: "upperPull",
        name: "Upper Body Pull",
        description: "Focus on back muscles",
      },
    ],
    mobility: [
      {
        id: "mobilityShort",
        name: "Mobility Short",
        description: "Quick mobility routine",
      },
      {
        id: "mobilityMedium",
        name: "Mobility Medium",
        description: "Standard mobility work",
      },
      {
        id: "mobilityLong",
        name: "Mobility Long",
        description: "Extended mobility session",
      },
    ],
    other: [
      {
        id: "ironNeck",
        name: "Iron Neck",
        description: "Neck strengthening routine",
      },
      {
        id: "ancillary",
        name: "Ancillary",
        description: "Supporting exercises",
      },
    ],
  };

  const startWorkout = (workoutId) => {
    console.log("Starting workout:", workoutId);
    navigate(`/workoutTemplates/${workoutId}`);
  };

  return (
    <div className="space-y-6">
      {/* Hypertrophy Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hypertrophy Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workoutTypes.hypertrophy.map((workout) => (
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

      {/* Mobility Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Mobility Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workoutTypes.mobility.map((workout) => (
            <button
              key={workout.id}
              onClick={() => startWorkout(workout.id)}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Brain size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium">{workout.name}</h3>
                <p className="text-sm text-gray-600">{workout.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Other Workouts Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Other Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workoutTypes.other.map((workout) => (
            <button
              key={workout.id}
              onClick={() => startWorkout(workout.id)}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Activity size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-medium">{workout.name}</h3>
                <p className="text-sm text-gray-600">{workout.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
