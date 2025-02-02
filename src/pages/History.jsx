// src/pages/History.jsx
import { useState } from "react";
import { format } from "date-fns";

export function History() {
  const [selectedType, setSelectedType] = useState("all");

  // Placeholder data - will be replaced with Firebase data
  const workoutHistory = [
    {
      id: 1,
      date: new Date("2025-02-01"),
      type: "hypertrophy",
      name: "Lower Body 1",
      completed: true,
    },
    {
      id: 2,
      date: new Date("2025-02-01"),
      type: "jiujitsu",
      name: "Evening No-Gi",
      completed: true,
    },
    // Add more placeholder items as needed
  ];

  const workoutTypes = [
    { value: "all", label: "All" },
    { value: "mobility", label: "Mobility" },
    { value: "iron-neck", label: "Iron Neck" },
    { value: "ancillary", label: "Ancillary" },
    { value: "hypertrophy", label: "Hypertrophy" },
    { value: "cardio", label: "Cardio" },
    { value: "jiujitsu", label: "Jiu Jitsu" },
  ];

  const filteredWorkouts =
    selectedType === "all"
      ? workoutHistory
      : workoutHistory.filter((workout) => workout.type === selectedType);

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
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredWorkouts.map((workout) => (
          <div
            key={workout.id}
            className="bg-white rounded-lg shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium capitalize">{workout.name}</h3>
                <p className="text-sm text-gray-500 capitalize">
                  {workout.type}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {format(workout.date, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-sm ${
                  workout.completed ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {workout.completed ? "Completed" : "In Progress"}
              </span>
              <button className="text-blue-600 text-sm hover:underline">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
