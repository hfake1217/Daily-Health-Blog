const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Below is where you keep track of your daily workouts. Please record the date of your workout as the title, and record the exercises, reps, sets, and weights used during your workout. Click below to add a workout.";
const aboutContent = "This is where you will keep track of your daily meals and snacks. Please record the date of your entry as the title. Then use the text box to list out food items with the total calorie content for the day and the total grams of protein, carbohydrates, and fats consumed for the day.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/checkinDB", {useNewUrlParser: true});

// let workouts = [];

const workoutSchema = {
  title: String,
  content: String
};

const Workout = mongoose.model("Workout", workoutSchema);

app.get("/", function(req, res){

  Workout.find().then(workouts =>{
    res.render("home", {
      startingContent: homeStartingContent,
      workouts: workouts
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
