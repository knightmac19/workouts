// src/utils/seedData.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const workoutTemplates = {
  // Hypertrophy Workouts
  lowerBody1: {
    type: "hypertrophy",
    subtype: "lower_1",
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

  lowerBody2: {
    type: "hypertrophy",
    subtype: "lower_2",
    name: "Lower Body 2",
    exercises: [
      {
        name: "Deadlift",
        sets: 3,
        reps: "8",
        rpe: 7,
        restPeriod: 150,
      },
      {
        name: "Pistol squats",
        sets: 3,
        reps: "10",
        rpe: 7,
        restPeriod: 45,
      },
      {
        name: "Dumbbell walking lunge",
        sets: 3,
        reps: "12",
        rpe: 7,
        restPeriod: 120,
      },
      {
        name: "Leg extension",
        sets: 3,
        reps: "15",
        rpe: 9,
        restPeriod: 45,
      },
      {
        name: "Leg curl",
        sets: 3,
        reps: "15",
        rpe: 9,
        restPeriod: 45,
      },
      {
        name: "Duck walks w/overhead weight",
        sets: 3,
        reps: "10",
        rpe: 7,
        restPeriod: 45,
      },
      {
        name: "Standing Calf Raise",
        sets: 3,
        reps: "15",
        rpe: 7,
        restPeriod: 45,
      },
    ],
  },

  upperPull: {
    type: "hypertrophy",
    subtype: "upper_pull",
    name: "Upper Body Pull",
    exercises: [
      {
        name: "Lat pulldown",
        sets: 3,
        reps: "12",
        rpe: 7,
        restPeriod: 60,
      },
      {
        name: "T-bar row",
        sets: 3,
        reps: "12",
        rpe: 7,
        restPeriod: 60,
      },
      {
        name: "Reverse flye",
        sets: 3,
        reps: "15",
        rpe: 9,
        restPeriod: 45,
      },
      {
        name: "Dumbbell supinated curl",
        sets: 3,
        reps: "15",
        rpe: 9,
        restPeriod: 45,
      },
      {
        name: "Seated face pull",
        sets: 3,
        reps: "10",
        rpe: 7,
        restPeriod: 45,
      },
      {
        name: "Dumbbell hammer curl",
        sets: 3,
        reps: "12",
        rpe: 7,
        restPeriod: 45,
      },
      // Same abs circuit as Lower Body 1
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

  upperPush: {
    type: "hypertrophy",
    subtype: "upper_push",
    name: "Upper Body Push",
    exercises: [
      {
        name: "Bench press",
        sets: 3,
        reps: "10",
        rpe: 7,
        restPeriod: 120,
      },
      {
        name: "Overhead press",
        sets: 3,
        reps: "10",
        rpe: 7,
        restPeriod: 120,
      },
      {
        name: "Dips",
        sets: 3,
        reps: "15",
        rpe: 7,
        restPeriod: 60,
      },
      {
        name: "Triceps Rope extension",
        sets: 3,
        reps: "15",
        rpe: 7,
        restPeriod: 45,
      },
      {
        name: "Dumbbell lateral raise",
        sets: 3,
        reps: "15",
        rpe: 7,
        restPeriod: 45,
      },
      // Same abs circuit
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

  // Iron Neck Workout
  ironNeck: {
    type: "iron_neck",
    subtype: "standard",
    name: "Iron Neck",
    exercises: [
      {
        name: "Spin left",
        sets: 1,
        reps: "4",
        rpe: 6,
        restPeriod: 0,
      },
      {
        name: "Spin right",
        sets: 1,
        reps: "4",
        rpe: 6,
        restPeriod: 60,
      },
      {
        name: "Spin left",
        sets: 1,
        reps: "4",
        rpe: 6,
        restPeriod: 0,
      },
      {
        name: "Spin right",
        sets: 1,
        reps: "4",
        rpe: 6,
        restPeriod: 60,
      },
      {
        name: "Spin left",
        sets: 1,
        reps: "4",
        rpe: 6,
        restPeriod: 0,
      },
      {
        name: "Spin right",
        sets: 1,
        reps: "4",
        rpe: 6,
        restPeriod: 60,
      },
      {
        name: "Look L-R",
        sets: 3,
        reps: "12",
        rpe: 6,
        restPeriod: 60,
      },
    ],
  },

  // Mobility Workouts
  mobilityShort: {
    type: "mobility",
    subtype: "short",
    name: "Mobility Short",
    exercises: [
      {
        name: "Saludar al sol",
        sets: 1,
        reps: "10",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Neck CARs",
        sets: 1,
        reps: "6",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Shoulder CARs",
        sets: 1,
        reps: "6",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Dead hangs",
        sets: 3,
        reps: "45 seconds",
        rpe: 7,
        restPeriod: 60,
      },
      {
        name: "Cat-cow",
        sets: 1,
        reps: "10",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Hip CARs",
        sets: 2,
        reps: "6",
        rpe: 7,
        restPeriod: 0,
      },
    ],
  },

  mobilityMedium: {
    type: "mobility",
    subtype: "medium",
    name: "Mobility Medium",
    exercises: [
      {
        name: "Saludar al sol",
        sets: 1,
        reps: "12",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Neck CARs",
        sets: 1,
        reps: "8",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Shoulder CARs",
        sets: 1,
        reps: "8",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Dead hangs",
        sets: 3,
        reps: "60 seconds",
        rpe: 7,
        restPeriod: 60,
      },
      {
        name: "Cat-cow",
        sets: 1,
        reps: "10",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Hip CARs",
        sets: 2,
        reps: "6",
        rpe: 7,
        restPeriod: 0,
      },
      {
        name: "Scapular CARs",
        sets: 1,
        reps: "6",
        rpe: 6,
        restPeriod: 0,
      },
      {
        name: "Knee-toe walk",
        sets: 2,
        reps: "10",
        rpe: 6,
        restPeriod: 30,
      },
      {
        name: "Side-side sumo squats",
        sets: 2,
        reps: "8",
        rpe: 6,
        restPeriod: 30,
      },
      {
        name: "Handstand",
        sets: 3,
        reps: "20 seconds",
        rpe: 7,
        restPeriod: 30,
      },
    ],
  },

  mobilityLong: {
    type: "mobility",
    subtype: "long",
    name: "Mobility Long",
    exercises: [
      {
        name: "Saludar al sol",
        sets: 2,
        reps: "12",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Neck CARs",
        sets: 2,
        reps: "8",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Shoulder CARs",
        sets: 2,
        reps: "8",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Dead hangs",
        sets: 3,
        reps: "60 seconds",
        rpe: 7,
        restPeriod: 60,
      },
      {
        name: "Cat-cow",
        sets: 2,
        reps: "10",
        rpe: 5,
        restPeriod: 0,
      },
      {
        name: "Hip CARs",
        sets: 3,
        reps: "6",
        rpe: 7,
        restPeriod: 0,
      },
      {
        name: "Scapular CARs",
        sets: 1,
        reps: "6",
        rpe: 6,
        restPeriod: 0,
      },
      {
        name: "Knee-toe walk",
        sets: 3,
        reps: "10",
        rpe: 6,
        restPeriod: 30,
      },
      {
        name: "Side-side sumo squats",
        sets: 2,
        reps: "8",
        rpe: 6,
        restPeriod: 30,
      },
      {
        name: "Handstand",
        sets: 3,
        reps: "20 seconds",
        rpe: 7,
        restPeriod: 30,
      },
      {
        name: "Bridge",
        sets: 3,
        reps: "6",
        rpe: 7,
        restPeriod: 90,
      },
      {
        name: "90-90 Hip",
        sets: 2,
        reps: "15",
        rpe: 8,
        restPeriod: 45,
      },
      {
        name: "Handstand",
        sets: 2,
        reps: "8",
        rpe: 7,
        restPeriod: 30,
      },
    ],
  },

  // Ancillary Workout
  ancillary: {
    type: "ancillary",
    subtype: "short",
    name: "Ancillary",
    exercises: [
      {
        name: "Kegels",
        sets: 8,
        reps: "40",
        rpe: 7,
        restPeriod: 30,
      },
      {
        name: "Jaw",
        sets: 8,
        reps: "40",
        rpe: 6,
        restPeriod: 30,
      },
      {
        name: "Hand Extensions",
        sets: 8,
        reps: "30",
        rpe: 6,
        restPeriod: 40,
      },
    ],
  },

  // Cardio Workouts
  tabata: {
    type: "cardio",
    subtype: "short",
    name: "Tabata",
    exercises: [
      {
        name: "Tabata",
        sets: 8,
        reps: "20 seconds",
        rpe: 10,
        restPeriod: 10,
      },
    ],
  },
  zone2: {
    type: "cardio",
    subtype: "long",
    name: "Zone 2",
    exercises: [
      {
        name: "Stairmaster / Jog",
        sets: 1,
        reps: "40-60 minutes",
        rpe: 6,
        restPeriod: 0,
      },
    ],
  },
};

export const seedWorkoutTemplates = async () => {
  try {
    const workoutTemplatesRef = collection(db, "workoutTemplates");

    for (const [key, template] of Object.entries(workoutTemplates)) {
      await addDoc(workoutTemplatesRef, {
        ...template,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("Successfully seeded workout templates");
  } catch (error) {
    console.error("Error seeding workout templates:", error);
  }
};
