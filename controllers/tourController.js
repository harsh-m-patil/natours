const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  next();
};

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
  //console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  //console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    //results: tours.length,
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newTour = { id: newId, ...req.body };

  //console.log(newTour);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "sucess",
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  //console.log(req.body);
  res.status(200).json({
    status: "success",
    data: {
      tour: "upadated tour here",
    },
  });
};

exports.deleteTour = (req, res) => {
  //console.log(req.body);
  // will not we shown
  res.status(204).json({
    status: "success",
    data: null,
  });
};
