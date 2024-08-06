const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// (1) GLOBAL Middlerware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100, // max no of reqs
  windowMs: 60 * 60 * 1000, // window size of max requests
  message: "Too many requests from this IP,please try again in a hour!!",
});

app.use("/api", limiter);

//using middleware to get access to body
app.use(express.json()); // get request params
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.responseTime = new Date().toISOString();
  next();
});
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// unhandled paths
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
