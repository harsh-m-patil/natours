const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review cannot be empty"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  //this.populate({
  //  path: "tour",
  //  select: "name",
  //}).populate({
  //  path: "user",
  //  select: "name photo",
  //});

  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// Static Methods availabe on model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // NOTE: this points to current Model
  // Calculate avg review
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour", // by what do you want to group
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingQuantity: stats[0].nRating,
  });
};

reviewSchema.post("save", function () {
  // this points to current review

  // this.constructor
  this.constructor.calcAverageRatings(this.tour);
  //NOTE: Post middleware does not have access to next
  //next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne();
  next();
});

reviewSchema.pre(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
