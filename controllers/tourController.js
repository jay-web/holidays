// const fs = require("fs");
// // fetch tours collection from local db file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const { json } = require("express");
const Tour = require("./../models/tourModel");

// * params middleware to check valid passed id
// exports.checkId = (req, res, next, val) => {
//   console.log(typeof val);
//   let tour = tours.find((el) => {
//     return el.id === val * 1;
//   });

//   // if search tour not available as per id
//   if (!tour) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Invalid id",
//     });
//   }

//   next();
// }

// // * custom middleware to check req.body
// exports.checkBody = (req, res, next) => {
//   console.log(req.body);
//   if(!req.body.name){
//     return res.status(400).json({
//       status: "failed",
//       message: "name is mandatory in new tour"
//     })
//   }
//   next();
// }

// Tours Route handlers/controllers
exports.getAllTours = async (req, res) => {
  try {
    // * Build filter query   - STEP ONE
    const queryObject = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObject[el]);

    // * Advanced filtering like lt, lte, gt, gte  - STEP TWO
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

   
    let query = Tour.find(JSON.parse(queryString));

    // * Sorting      -- STEP THREE
    if(req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }else{
      query = query.sort("-createdAt");
    }

    // * Fields Limitation      -- STEP FOUR
    if(req.query.fields){
      const limitFields = req.query.fields.split(",").join(" ");
      query = query.select(limitFields);
    }else{
      query = query.select("-__v"); // exclude this property
    }

    // * Pagination     -- STEP FIVE
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip =(page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if(req.query.page ){
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error("This page doesn't exit");
    }


    // * Execute the query
    const tours = await query;
    res.status(200).json({
      status: "success",
      result: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save()

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};
