// src/pages/ActiveWorkout.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import WorkoutSession from "../components/workouts/WorkoutSession";
import { CardioSession } from "../components/workouts/CardioSession";

export function ActiveWorkout() {
  const { templateId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        // Use the 'id' from the URL to fetch the workout
        const workoutRef = doc(db, "workoutTemplates", templateId);
        const workoutDoc = await getDoc(workoutRef);

        if (workoutDoc.exists()) {
          // Include the document ID with the data
          setWorkout({
            id: workoutDoc.id,
            ...workoutDoc.data(),
          });
        } else {
          setError("Workout template not found");
        }
      } catch (err) {
        console.error("Error fetching workout:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-900 dark:text-white">
          Loading workout...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {workout ? (
        workout.type === "cardio" ? (
          <CardioSession workout={workout} />
        ) : (
          <WorkoutSession workout={workout} />
        )
      ) : (
        <div className="text-center text-gray-900 dark:text-white">
          No workout data available
        </div>
      )}
    </div>
  );
}
