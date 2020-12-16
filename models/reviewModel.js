const mongoose = require("mongoose");
const Tour = require("./tourModel");

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
  // this.populate({ path: "tour", select: "-guides name"}).populate({ path: "user", select: "name"})
  this.populate({path: "user", select: "name"});
  next();
})

// Statistic function to calculate average rating
reviewSchema.statics.calcAverageRating = async function(tourId){
  const stats = await this.aggregate([
    {
      $match: {tour : tourId}
    }, 
    {
      $group: {
        _id: '$tour',
        nRatings: {$sum: 1},
        avgRating: { $avg: '$rating'}
      }
    }
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRatings
  })
  
}

// Call the above the statistic function after creating review
reviewSchema.post("save", function(){
  this.constructor.calcAverageRating(this.tour);
})
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
