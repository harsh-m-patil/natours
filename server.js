/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("uncaughtException");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config(); // should be before app
const app = require("./app");

mongoose.connect(process.env.DB_URI, {}).then(() => {
  console.log("Database connected");
});
// .catch()

// (4) SERVER
//console.log(app.get("env")); // set by express

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandledRejection");
  server.close(() => {
    process.exit(1);
  });
});
