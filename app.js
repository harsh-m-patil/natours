const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// (1) Middlerware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//using middleware to get access to body
app.use(express.json()); // get request params
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// unhandled paths
app.all("*", (req, res, next) => {
  //res.status(404).json({
  //  status: "fail",
  //  message: `Can't find ${req.originalUrl}`,
  //});
  const err = new Error(`Can't find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
