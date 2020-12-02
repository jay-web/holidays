// const fs = require("fs");
// // fetch tours collection from local db file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// * params middleware to check valid passed id

// Tours Route handlers/controllers
exports.getAllTours = catchAsync(async (req, res, next) => {
  // * Execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const tours = await features.query;
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if(!tour){
    return next(new AppError("No tour found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save()

  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!tour){
    return next(new AppError("No tour found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if(!tour){
    return next(new AppError("No tour found with that Id", 404));
  }
  
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// * Top five cheap tour filter middleware
exports.aliesTopFive = catchAsync((req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,duration,ratingsAverage,difficulty,summary,price";

  next();
});
