const fs = require("fs");

const tours = JSON.parse(
  // eslint-disable-next-line no-undef
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

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

  //if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

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
  const newTour = Object.assign({ id: newId }, req.body);

  //console.log(newTour);
  tours.push(newTour);
  fs.writeFile(
    // eslint-disable-next-line no-undef
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    // eslint-disable-next-line no-unused-vars
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
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  //console.log(req.body);
  res.status(200).json({
    status: "success",
    data: {
      tour: "upadated tour here",
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  //console.log(req.body);
  // will not we shown
  res.status(204).json({
    status: "success",
    data: null,
  });
};
