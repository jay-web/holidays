const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Please mentioned your review"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must be belong to Tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Query Middleware 
reviewSchema.pre(/^find/, function(next){
  this.populate({ path: "tour", select: "-guides name"}).populate({ path: "user", select: "name"})
  next();
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
