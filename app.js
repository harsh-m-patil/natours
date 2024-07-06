const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// (1) Middlerware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//using middleware to get access to body
app.use(express.json()); // get request params

app.use(express.static(`${__dirname}/public`));
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
