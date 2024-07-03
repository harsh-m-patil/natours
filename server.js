const app = require("./app");
// (4) SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
