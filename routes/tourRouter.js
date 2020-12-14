const express = require("express");
const { 
    getAllTours, 
    getTour, 
    aliesTopFive,
    createTour,
    updateTour, 
    deleteTour,
    
 } = require("./../controllers/tourController");
 const {protect, restrictTo } = require("../controllers/authController");
 const reviewRouter = require("./reviewRouter");


const tourRouter = express.Router();

// tourRouter.param("id", checkId);

// Nested routes ( review routes in tour routes)

tourRouter.use("/:tourId/reviews", reviewRouter);

// * GET request of top five cheap tours from tours collection
tourRouter.get("/top-5-cheap", aliesTopFive, getAllTours);

// * GET request of tours collection resource
tourRouter.get("/", protect, getAllTours);

// * GET request of tours collection resource to get single tour info
tourRouter.get("/:id", getTour);


// * POST request to create/add new tour
tourRouter.post("/", createTour);

// * PATCH request of tour resource to edit/update any tour info
tourRouter.patch("/:id", updateTour);

// * DELETE request of tour resource to delete any tour as per id
tourRouter.delete("/:id", protect, restrictTo("admin", "lead-guide"), deleteTour);

// * Finally export tourRouter to app.js file to use as middleware
// * in main app
module.exports = tourRouter;
