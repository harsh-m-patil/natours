const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// (1) GLOBAL Middlerware

// SET security HTTP Headers
app.use(helmet());

// DEV LOGGING
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// LIMIT requests from same API
const limiter = rateLimit({
  max: 100, // max no of reqs
  windowMs: 60 * 60 * 1000, // window size of max requests
  message: "Too many requests from this IP,please try again in a hour!!",
});

app.use("/api", limiter);

//using middleware to get access to body (body-parser)
app.use(
  express.json({
    limit: "10kb",
  }),
); // get request params

// DATA santization against NOSQL query injection
app.use(mongoSanitize());

// DATA santization against XSS
app.use(xss());

// SERVE static files
app.use(express.static(`${__dirname}/public`));

// TEST Middlerware
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
