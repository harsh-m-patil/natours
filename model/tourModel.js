const mongoose = require("mongoose");

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
module.exports = Tour;