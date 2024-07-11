const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"], // arr[1] error message
      unique: true,
      trim: true, // removes whitespace in beginning and end
      maxlength: [40, "A tour name must have less or equal 40 characters"],
      minlength: [10, "A tour name must have more or equal 10 characters"],
    },
    slug: {
      type: String,
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
      required: [true, "A tour must have a difficulty"],
      enum: {
        // only for strings
        values: ["easy", "medium", "difficult"],
        message: "Invalid difficulty type,must be either easy,medium,difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // for numbers and date
      min: [1, "A ratings must be greater than 1.0"],
      max: [1, "A ratings must be less than 5.0"],
    },
    ratingQuantity: {
      type: Number,
      min: [0, "A ratingQuantity must be positive "],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"], // arr[1] error message
      min: [0, "A tour price must be positive "],
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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

//document midleware that runs before a actual action
// runs before .save() and .create() not on .insertMany()
// This points to document
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// runs after save
//tourSchema.post("save", (doc, next) => {
//  console.log(doc);
//  next();
//});

// QUERY MIDDLEWARE
// This points to query
//tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

//tourSchema.post(/^find/, (docs, next) => {
//  console.log(docs);
//  next();
//});

// Aggreate MIDDLEWARE
// This points to aggregation object
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
