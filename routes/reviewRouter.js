const express = require("express");

const reviewController = require("../controllers/reviewController");
const {protect, restrictTo} = require("../controllers/authController");


const reviewRouter = express.Router({ mergeParams : true});

// Protect all the middleware after this.(need to login)
reviewRouter.use(protect);

reviewRouter.get("/", reviewController.getAllReview);
reviewRouter.post("/", restrictTo('user'), reviewController.createNewReview);

// Restrict authorization of middleware to user and admin only after this
reviewRouter.use(restrictTo("user", "admin"));

reviewRouter.patch("/:id", reviewController.updateReview);
reviewRouter.delete("/:id", reviewController.deleteReview);



module.exports = reviewRouter;