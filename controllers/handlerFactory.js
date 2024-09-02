const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/**
 * @param {mongoose.Model} Model
 * @returns {Function} Middleware function
 * @description  Delete a document by id
 * @example
 * exports.deleteOne = handlerFactory.deleteOne(Model);
 * app.delete("/api/v1/tours/:id", deleteOne);
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      next(new AppError("No doc find with that id", 404));
      return;
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
