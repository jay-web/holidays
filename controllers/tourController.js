// const fs = require("fs");
// // fetch tours collection from local db file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");


// * params middleware to check valid passed id

// Tours Route handlers/controllers
exports.getAllTours = factory.getAll(Tour);

exports.getTour = catchAsync(async (req, res, next) => {
  const tour =  await Tour.findById(req.params.id).populate({path: "reviews", select: "-__v -id"});

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

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// * Top five cheap tour filter middleware
exports.aliesTopFive = catchAsync((req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,duration,ratingsAverage,difficulty,summary,price";

  next();
});
