const express = require("express");
const authController = require("../controllers/authController");
const tourController = require("../controllers/tourController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

//router.param("id", tourController.checkID);
//router
//  .route("/:tourId/reviews")
//  .post(
//    authController.protect,
//    authController.restrictTo("user"),
//    reviewController.createReview,
//  );

//NOTE: nested routes
router.use("/:tourId/reviews", reviewRouter);

//NOTE: Exposed API
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMontlyPlan,
  );

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour,
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

module.exports = router;
