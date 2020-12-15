const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.getAll = Model => catchAsync(async (req, res, next) => {

  // * Execute the query
  const features = new APIFeatures(Model.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const docs = await features.query;
  res.status(200).json({
    status: "success",
    result: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save()

  const newDoc= await Model.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: newDoc,
    },
  });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
  
    if(!doc){
      return next(new AppError("No doc found with that Id", 404));
    }
    
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!doc){
    return next(new AppError("No document found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});