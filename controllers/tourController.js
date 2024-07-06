const Tour = require("../model/tourModel");

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "missing name or price",
    });
  }
  next();
};

// (2) ROUTES HANDLERS
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {},
  });
};

exports.getTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {},
  });
};

exports.createTour = (req, res) => {};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "upadated tour here",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
