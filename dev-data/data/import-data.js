/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../model/tourModel");
const Review = require("../../model/reviewModel");
const User = require("../../model/userModel");

const DB_URI = "mongodb://127.0.0.1:27017/natours";

mongoose.connect(DB_URI, {}).then(() => {
  console.log("DB Connected");
});

const tours = JSON.parse(fs.readFileSync("./tours.json", "utf-8"));
const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
const reviews = JSON.parse(fs.readFileSync("./reviews.json", "utf-8"));

// Import DATA into DB
const importData = async () => {
  try {
    const tour = Tour.create(tours);
    const user = User.create(users, { validateBeforeSave: false });
    const review = Review.create(reviews);
    await Promise.all([tour, review, user]);
    console.log("data loaded");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Delete All DATA from DB
const deleteData = async () => {
  try {
    await Promise.all([
      Tour.deleteMany(),
      User.deleteMany(),
      Review.deleteMany(),
    ]);
    console.log("data deleted");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
