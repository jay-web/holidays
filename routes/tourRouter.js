const express = require("express");
const { 
    getAllTours, 
    getTour, 
    createTour,
    updateTour, 
    deleteTour } = require("./../controllers/tourController");
const tourRouter = express.Router();

// * GET request of tours collection resource
tourRouter.get("/", getAllTours);

// * GET request of tours collection resource to get single tour info
tourRouter.get("/:id", getTour);

// * POST request to create/add new tour
tourRouter.post("/", createTour);

// * PATCH request of tour resource to edit/update any tour info
tourRouter.patch("/:id", updateTour);

// * DELETE request of tour resource to delete any tour as per id
tourRouter.delete("/:id", deleteTour);

// * Finally export tourRouter to app.js file to use as middleware
// * in main app
module.exports = tourRouter;
