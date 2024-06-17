const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = require("express").Router();

function loadWorkoutData() {
  const workouts = JSON.parse(
    fs.readFileSync("./data/workout-log.json", "utf8")
  );
  return workouts;
}

router.get("/workouts", (req, res) => {
  res.json(loadWorkoutData());
});

router.get(".workouts/:id", (req, res) => {
  const workouts = loadWorkoutData();
  const foundWorkout = workouts.find((workout) => workout.id === req.params.id);
  res.json(foundWorkout);
});

router.post("/workouts", (req, res) => {
  const workouts = loadWorkoutData();

  const newWorkout = {
    id: uuidv4(),
    duration: req.params.duration,
    workout_name: req.params.workout_name,
    date: Date.now(),
    exercises: [
      {
        type: req.body.exercises.map((exercise) => ({ type: exercise.type })),
      },
    ],
  };
  workouts.push(newWorkout);

  fs.writeFileSync("../data/workout-log.json", JSON.stringify(workouts));

  res.json(newWorkout);
});

module.exports = router;
