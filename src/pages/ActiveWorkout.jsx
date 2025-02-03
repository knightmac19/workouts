import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";
import WorkoutSession from "../components/workouts/WorkoutSession";

export function ActiveWorkout() {
  // const { workoutId } = useParams();
  // const [workout, setWorkout] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const { templateId } = useParams();

  const workoutData = {
    "lower-1": {
      id: "lower-1",
      type: "hypertrophy",
      name: "Lower Body 1",
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
    },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {workoutData[templateId] ? (
        <WorkoutSession workout={workoutData[templateId]} />
      ) : (
        <div className="text-center">Workout template not found</div>
      )}
    </div>
  );
}
