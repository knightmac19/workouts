import React, { useState } from "react";
import { Timer } from "./common/Timer";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const WorkoutSession = ({ workout }) => {
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showInfo, setShowInfo] = useState(null);

  const toggleExercise = (exerciseId) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
    setShowInfo(null); // Close any open info panels
  };

  const toggleInfo = (exerciseId, e) => {
    e.stopPropagation(); // Prevent exercise expansion
    setShowInfo(showInfo === exerciseId ? null : exerciseId);
  };

  const handleSetComplete = (exerciseId) => {
    // Future enhancement: Mark set as completed
    console.log(`Set completed for exercise ${exerciseId}`);
  };

  return (
    <div className="space-y-4 pb-16">
      <Card>
        <CardHeader>
          <CardTitle>{workout.name}</CardTitle>
        </CardHeader>
      </Card>

      {workout.exercises.map((exercise, index) => (
        <Card key={index} className="overflow-hidden">
          <div
            onClick={() => toggleExercise(index)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{exercise.name}</span>
              <button
                onClick={(e) => toggleInfo(index, e)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <Info size={16} className="text-gray-500" />
              </button>
            </div>
            {expandedExercise === index ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </div>

          {showInfo === index && (
            <div className="px-4 py-2 bg-blue-50 border-y border-blue-100">
              <p className="text-sm text-blue-700">
                Exercise description and tips will go here.
              </p>
            </div>
          )}

          {expandedExercise === index && (
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Exercise Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Sets:</span>
                    <span className="ml-2 font-medium">{exercise.sets}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Reps:</span>
                    <span className="ml-2 font-medium">{exercise.reps}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">RPE:</span>
                    <span className="ml-2 font-medium">{exercise.rpe}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Rest:</span>
                    <span className="ml-2 font-medium">
                      {exercise.restPeriod}s
                    </span>
                  </div>
                </div>

                {/* Sets Input */}
                <div className="space-y-2">
                  {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-4">
                      <span className="w-8 text-gray-500">#{setIndex + 1}</span>
                      <input
                        type="number"
                        placeholder="Weight"
                        className="w-20 p-2 border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        className="w-20 p-2 border rounded"
                      />
                      {workout.type === "hypertrophy" && (
                        <input
                          type="number"
                          placeholder="RPE"
                          className="w-20 p-2 border rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Rest Timer */}
                <div className="pt-4">
                  <Timer
                    initialTime={exercise.restPeriod}
                    onComplete={() => handleSetComplete(index)}
                  />
                </div>

                {/* Notes */}
                <div className="pt-4">
                  <textarea
                    placeholder="Notes for this exercise..."
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WorkoutSession;
