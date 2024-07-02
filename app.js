const fs = require("fs");
const express = require("express");

const app = express();

const port = 3000;

//using middleware to get access to body
app.use(express.json());

//app.get("/", (req, res) => {
//  res.status(200).json({ message: "Hello from the server", app: "natour" });
//});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

// :variable can have multiple variables
// :variable? this var will be opitional
app.get("/api/v1/tours/:id", (req, res) => {
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
});

app.post("/api/v1/tours", (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

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
});

app.patch("/api/v1/tours/:id", (req, res) => {
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
});

app.delete("/api/v1/tours/:id", (req, res) => {
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
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
