const mongoose = require("mongoose");
const slugify = require("slugify");
//const User = require("./userModel");

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
      max: [5, "A ratings must be less than 5.0"],
      // NOTE: Runs everytime this value is set
      set: (val) => Math.round(val * 10) / 10,
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
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//NOTE: indexing 1 ascending,-1 descending
//SET according to keys that are qeuried frequently
//tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
// real points on earth-like sphere
tourSchema.index({ startLocation: "2dsphere" });

// cant use in a query
tourSchema.virtual("durationWeek").get(function () {
  // ()=> does not have this keyword
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

//document midleware that runs before a actual action
// runs before .save() and .create() not on .insertMany()
// This points to document
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//tourSchema.pre("save", async function (next) {
//  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//  this.guides = await Promise.all(guidesPromises);
//  next();
//});

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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});
//tourSchema.post(/^find/, (docs, next) => {
//  console.log(docs);
//  next();
//});

// Aggreate MIDDLEWARE
// This points to aggregation object
//tourSchema.pre("aggregate", function (next) {
//  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//  next();
//});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
