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

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    });

    const modelName = Model.modelName.toLowerCase();
    if (!updatedDoc) {
      next(new AppError(`No ${modelName} find with that id`, 404));
      return;
    }

    res.status(200).json({
      status: "success",
      data: {
        [modelName]: updatedDoc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    const modelName = Model.modelName.toLowerCase();
    res.status(200).json({
      status: "success",
      data: {
        [modelName]: newDoc,
      },
    });
  });
