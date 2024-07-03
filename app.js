/* eslint-disable no-unused-vars */
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

const port = 3000;

// (1) Middlerware
app.use(morgan("dev"));

//using middleware to get access to body
app.use(express.json()); // get request params

//app.use((req, res, next) => {
//  console.log("Hello from middleware");
//  next();
//});
//
//app.use((req, res, next) => {
//  req.requestTime = new Date().toISOString();
//  next();
//});

//app.get("/", (req, res) => {
//  res.status(200).json({ message: "Hello from the server", app: "natour" });
//});

const tours = JSON.parse(
  // eslint-disable-next-line no-undef
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

// (2) ROUTES HANDLERS
const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
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

const createTour = (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  //console.log(newTour);
  tours.push(newTour);
  fs.writeFile(
    // eslint-disable-next-line no-undef
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined",
  });
};

// (3) ROUTES
// :variable can have multiple variables
// :variable? this var will be opitional
//app.get("/api/v1/tours", getAllTours);
//app.get("/api/v1/tours/:id", getTour);
//app.post("/api/v1/tours", createTour);
//app.patch("/api/v1/tours/:id", updateTour);
//app.delete("/api/v1/tours/:id", deleteTour);

const tourRouter = express.Router();
const userRouter = express.Router();
tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route("/api/v1/users").get(getAllUsers).post(createUser);

userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
// (4) SERVER
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
