const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const router = require("express").Router();

const filePath = path.join(__dirname, "../data/workout-log.json");

function loadWorkoutData() {
  if (!fs.existsSync(filePath)) {
    return []; // Return an empty array if the file does not exist
  }
  const workouts = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return workouts;
}

router.get("/workouts", (req, res) => {
  res.json(loadWorkoutData());
});

router.get("/workouts/:id", (req, res) => {
  const workouts = loadWorkoutData();
  const foundWorkout = workouts.find((workout) => workout.id === req.params.id);
  res.json(foundWorkout);
});

router.post("/workouts", (req, res) => {
  const workouts = loadWorkoutData();

  if (!Array.isArray(req.body.exercises)) {
    return res.status(400).json({ message: "Exercises must be an array" });
  }

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

  fs.writeFileSync(filePath, JSON.stringify(workouts, null, 2));

  res.status(201).json(newWorkout);
});

module.exports = router;
