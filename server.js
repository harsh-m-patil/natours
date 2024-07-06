/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" }); // should be before app

mongoose.connect(process.env.DB_URI, {}).then(() => {
  console.log("Database connected");
});

// (4) SERVER
//console.log(app.get("env")); // set by express

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
