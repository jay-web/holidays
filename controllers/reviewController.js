const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

const reviewController = {

    // middleware to get all reviews
    getAllReview : catchAsync(async (req, res, next) => {
        
        const allReview = await Review.find();

        res.status(200).json({
            status: "success",
            data: {
                allReview
            }
        })
    }),

    // middleware to create new review
    createNewReview : catchAsync(async (req, res, next) => {
        const review = {
            review : req.body.review,
            rating: req.body.rating,
            createdAt: req.body.createdAt,
            tour: req.body.tour,
            user: req.user.id
        }

        const newReview = await Review.create(review);

        res.status(201).json({
            status: "success",
            data: {
                review: newReview
            }
        })
    })
}

module.exports = reviewController;