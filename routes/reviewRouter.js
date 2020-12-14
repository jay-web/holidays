const express = require("express");

const reviewController = require("../controllers/reviewController");
const {protect, restrictTo} = require("../controllers/authController");


const reviewRouter = express.Router({ mergeParams : true});

reviewRouter.get("/", protect, reviewController.getAllReview);
reviewRouter.post("/", protect, restrictTo('user'), reviewController.createNewReview);
reviewRouter.delete("/:id", reviewController.deleteReview);



module.exports = reviewRouter;