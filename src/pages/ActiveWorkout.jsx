// src/pages/ActiveWorkout.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import WorkoutSession from "../components/workouts/WorkoutSession";

export function ActiveWorkout() {
  const { templateId } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        console.log("Fetching workout with templateId:", templateId);
        const workoutRef = doc(db, "workoutTemplates", templateId);
        console.log("Created document reference");

        const workoutDoc = await getDoc(workoutRef);
        console.log(
          "Fetched document:",
          workoutDoc.exists(),
          workoutDoc.data()
        );

        if (workoutDoc.exists()) {
          setWorkout(workoutDoc.data());
        } else {
          setError("Workout template not found");
        }
      } catch (err) {
        console.error("Error fetching workout:", err);
        setError("Error loading workout");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading workout...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {workout ? (
        <WorkoutSession workout={workout} />
      ) : (
        <div className="text-center">No workout data available</div>
      )}
    </div>
  );
}
