/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" }); // should be before app

mongoose.connect(process.env.DB_URI, {}).then(() => {
  console.log("Database connected");
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"], // arr[1] error message
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"], // arr[1] error message
  },
});

const Tour = mongoose.model("Tour", tourSchema);

const testTour = new Tour({
  name: "Test",
  rating: 4.7,
  price: 232,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("ERROR", err);
  });

// (4) SERVER
//console.log(app.get("env")); // set by express

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
