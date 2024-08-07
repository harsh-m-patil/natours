/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../model/tourModel");

const DB_URI = "mongodb://127.0.0.1:27017/natours";

mongoose.connect(DB_URI, {}).then(() => {
  console.log("DB Connected");
});

const tours = JSON.parse(fs.readFileSync("./tours.json", "utf-8"));

// Import DATA into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("data loaded");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Delete All DATA from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
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
