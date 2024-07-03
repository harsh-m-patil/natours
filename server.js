const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // should be before app

const app = require("./app");
// (4) SERVER
//console.log(app.get("env")); // set by express

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
