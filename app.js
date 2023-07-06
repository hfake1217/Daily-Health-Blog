const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Below is where you keep track of your daily workouts. Please record the date of your workout as the title, and record the exercises, reps, sets, and weights used during your workout. Click below to add a workout.";
const nutritionContent = "This is where you will keep track of your daily meals and snacks. Please record the date of your entry as the title. Then use the text box to list out food items with the total calorie content for the day and the total grams of protein, carbohydrates, and fats consumed for the day.";
const stepsContent = "This section is where you will log your daily step count at the end of the day. This is to help keep track of daily movement.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/checkinDB", {useNewUrlParser: true});


// Workouts Schema and Model
const workoutSchema = {
  title: String,
  content: String
};

const Workout = mongoose.model("Workout", workoutSchema);

// Nutrition Schema and Model
const nutritionSchema = {
  title: String,
  content: String
};

const Nutrition = mongoose.model("Nutrition", nutritionSchema);

// Steps Schema and Model
const stepsSchema = {
  title: String,
  content: String
};

const Steps = mongoose.model("Steps", stepsSchema);

// app.get functions
app.get("/", function(req, res){

  Workout.find().then(workouts =>{
    res.render("home", {
      startingContent: homeStartingContent,
      workouts: workouts
      });
  });
});

app.get("/nutrition", function(req, res){
  
  Nutrition.find().then(nutritions => {
    res.render("nutrition", {
      nutritionContent: nutritionContent,
      nutritions: nutritions
    });
  });
});

app.get("/steps", function(req, res){

  Steps.find().then(steps => {
    res.render("steps", {
      stepsContent: stepsContent,
      steps: steps
    });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/composenutrition", function(req, res){
  res.render("composenutrition");
});

app.get("/composesteps", function(req, res){
  res.render("composesteps");
});

// app.post functions
app.post("/compose", function(req, res){
  const workout = new Workout({
    title: req.body.workoutTitle,
    content: req.body.workoutBody
  });
  workout.save().then(() => {
    console.log('Post added to DB.');
    res.redirect('/');
  })
  .catch(err => {
    res.status(400).send("Unable to save post to database.");
  });
});

app.post("/composenutrition", function(req, res){
  const nutrition = new Nutrition({
    title: req.body.nutritionTitle,
    content: req.body.nutritionBody
  });
  nutrition.save().then(() => {
    console.log('Post added to DB.');
    res.redirect('/nutrition');
  })
  .catch(err => {
    res.status(400).send("Unable to save post to database.");
  });
});

app.post("/composesteps", function(req, res){
  const steps = new Steps({
    title: req.body.stepsTitle,
    content: req.body.stepsBody
  });
  steps.save().then(() => {
    console.log('Post added to DB.');
    res.redirect('/steps');
  })
  .catch(err => {
    res.status(400).send("Unable to save post to database.");
  });
});

// app.get for "Read More" link
app.get("/workouts/:workoutName", function(req, res){
  const requestedWorkoutId = req.params.workoutName;

  Workout.findOne({_id:requestedWorkoutId})
  .then(function (workout) {
    res.render("workout", {
            title: workout.title,
            content: workout.content
          });
    })
    .catch(function(err){
      console.log(err);
    })
});

app.get("/nutritions/:nutritionName", function(req, res){
  const requestedNutritionId = req.params.nutritionName;

  Nutrition.findOne({_id:requestedNutritionId})
  .then(function (workout) {
    res.render("nutritionentry", {
            title: nutritionentry.title,
            content: nutritionentry.content
          });
    })
    .catch(function(err){
      console.log(err);
    })
});

app.get("/steps/:stepsName", function(req, res){
  const requestedStepsId = req.params.stepsName;

  Steps.findOne({_id:requestedStepsId})
  .then(function (workout) {
    res.render("stepsentry", {
            title: stepsentry.title,
            content: stepsentry.content
          });
    })
    .catch(function(err){
      console.log(err);
    })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
