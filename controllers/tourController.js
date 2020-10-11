// const fs = require("fs");
// // fetch tours collection from local db file
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

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
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    // data: {
    //   tours: tours,
    // },
  });
};

exports.getTour = (req, res) => {
  let id = req.params.id * 1; // ? to convert string into int


};

exports.createTour = async (req, res) => {
  try { 
    // const newTour = new Tour({});
    // newTour.save()

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour : newTour
      }
    })

  }catch(err){
    res.status(400).json({
      status: "failed",
      message: err.message
    })
  }


};

exports.updateTour = (req, res) => {
  let id = req.params.id * 1; // convert string into int

 
};

exports.deleteTour = (req, res) => {
  let id = req.params.id * 1; // convert string into int
  
};
