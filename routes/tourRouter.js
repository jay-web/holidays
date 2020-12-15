const express = require("express");
const tourController = require("./../controllers/tourController");
 const {protect, restrictTo } = require("../controllers/authController");
 const reviewRouter = require("./reviewRouter");


const tourRouter = express.Router();

// tourRouter.param("id", checkId);

// **** Nested route ( review routes in tour routes)
tourRouter.use("/:tourId/reviews", reviewRouter);

// * GET request of tours collection resource
tourRouter.get("/", tourController.getAllTours);       // ! not protected, so it can be universally used

// All the routes need to login after this
tourRouter.use(protect);

// * GET request of top five cheap tours from tours collection
tourRouter.get("/top-5-cheap", tourController.aliesTopFive, tourController.getAllTours);

// * GET request of tours collection resource to get single tour info
tourRouter.get("/:id", tourController.getTour);

// All the routes restriced authorization to admin and lead-guide after this
tourRouter.use(restrictTo("admin", "lead-guide"));

// * POST request to create/add new tour
tourRouter.post("/", tourController.createTour);

// * PATCH request of tour resource to edit/update any tour info
tourRouter.patch("/:id", tourController.updateTour);

// * DELETE request of tour resource to delete any tour as per id
tourRouter.delete("/:id", tourController.deleteTour);





// * Finally export tourRouter to app.js file to use as middleware
// * in main app
module.exports = tourRouter;
