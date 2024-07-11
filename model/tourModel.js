const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"], // arr[1] error message
      unique: true,
      trim: true, // removes whitespace in beginning and end
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group Size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a group difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"], // arr[1] error message
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true, // removes whitespace in beginning and end
      required: [true, "A tour must have summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // hide from the output
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// cant use in a query
tourSchema.virtual("durationWeek").get(function () {
  // ()=> does not have this keyword
  return this.duration / 7;
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
