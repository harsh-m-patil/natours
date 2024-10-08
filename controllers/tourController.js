const Tour = require("../model/tourModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

// middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.sort = "ratingsAverage,price";
  req.query.limit = "5";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// (2) ROUTES HANDLERS
exports.getAllTours = factory.getAll(Tour);

// NOTE: popultate options
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" }, // how to group
        numOfTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 for ascending order
    },
    //{
    //  $match: { _id: { $ne: "EASY" } },
    //},
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats: stats,
    },
  });
});

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 }, // 0 means dont show 1 to show
    },
    {
      $sort: { numTourStarts: -1 },
    },
    //{
    //  $limit: 6,
    //},
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
