const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

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

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
