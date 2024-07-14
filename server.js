/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" }); // should be before app

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
