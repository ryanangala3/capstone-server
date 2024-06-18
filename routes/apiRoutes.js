const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = require("express").Router();

const filePath = path.join(__dirname, "../data/workout-log.json");

// function to get workoutdata
function loadWorkoutData() {
  if (!fs.existsSync(filePath)) {
    return []; // Return an empty array if the file does not exist
  }
  const workouts = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return workouts;
}

// function to write to JSON file
function saveWorkoutData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Get all workouts
router.get("/workouts", (req, res) => {
  res.json(loadWorkoutData());
});

// Get a specific workout
router.get("/workouts/:id", (req, res) => {
  const workouts = loadWorkoutData();
  const foundWorkout = workouts.find((workout) => workout.id === req.params.id);
  res.json(foundWorkout);
});

// Delete a workout
router.delete("/workouts/:id", (req, res) => {
  const workouts = loadWorkoutData();
  const { id } = req.params;

  const workoutIndex = workouts.findIndex((workout) => workout.id === id);

  if (workoutIndex !== -1) {
    workouts.splice(workoutIndex, 1);
    saveWorkoutData(workouts);
    res.json({ message: "workout successfully deleted!" });
  } else {
    res.status({ message: "workout not found" });
  }
});

// post a workout
router.post("/workouts", (req, res) => {
  const workouts = loadWorkoutData();

  const newWorkout = {
    id: uuidv4(),
    duration: req.body.duration,
    workout_name: req.body.workout_name,
    date: new Date().toISOString().split("T")[0],
    exercises: req.body.exercises.map((exercise) => ({
      exercise_name: exercise.exercise_name,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      type: exercise.type,
    })),
  };
  workouts.push(newWorkout);

  saveWorkoutData(workouts);

  res.status(201).json(newWorkout);
});

module.exports = router;
