const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
// (3) ROUTES
// :variable can have multiple variables
// :variable? this var will be opitional
//app.get("/api/v1/tours", getAllTours);
//app.get("/api/v1/tours/:id", getTour);
//app.post("/api/v1/tours", createTour);
//app.patch("/api/v1/tours/:id", updateTour);
//app.delete("/api/v1/tours/:id", deleteTour);

const router = express.Router();

router.post("/signup", authController.signup);

router
  .route("/api/v1/users")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
