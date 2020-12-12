const express = require("express");

const reviewController = require("../controllers/reviewController");
const {protect, restrictTo} = require("../controllers/authController");


const reviewRouter = express.Router();

reviewRouter.get("/", protect, reviewController.getAllReview);
reviewRouter.post("/", protect, restrictTo('user'), reviewController.createNewReview);



module.exports = reviewRouter;