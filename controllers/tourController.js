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
const multer = require("multer");
const sharp = require("sharp");

// !============IMAGE UPLOAD AND PROCESSING STARTS==================
//  * if want to hold the image on buffer for processing
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.getUploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // Processing image cover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg}`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // Processing images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
// !============IMAGE UPLOAD AND PROCESSING ENDS==================

// Tours Route handlers/controllers
exports.getAllTours = factory.getAll(Tour);

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: "reviews",
    select: "-__v -id",
  });

  if (!tour) {
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

// * Get tours within distance as per your location
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  // converting distance into radian
  // divide the distance with radius of the earth
  // in miles 3963.2 is the radius of the earth
  // in kilimeter 6378.1 is the radius of the earth
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    // ! Note use longitude first then lat as per mongo doc
  });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.0001;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format lat, lng",
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",

    data: {
      data: distances,
    },
  });
});
