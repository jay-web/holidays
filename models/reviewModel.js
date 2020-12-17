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
reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: "tour", select: "-guides name"}).populate({ path: "user", select: "name"})
  this.populate({ path: "user", select: "name" });
  next();
});

// Statistic function to calculate average rating
reviewSchema.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if(stats.length > 0){
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRatings,
    });
  }else{
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0
    });
  }
  
};

// indexing, so only single review per user for per tour
reviewSchema.index({ tour: 1, user: 1}, { unique: true});

// Call the above the statistic function after creating review
reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.tour);
});

// !To run the static function on update or delete query
// ! We don't have document middleware to get the document on findById queries
// ! We will we implement below middleware one by one

// First - findOneAnd for findByIdAndupdate and findByIdAndDelete query
reviewSchema.pre(/^findOneAnd/, async function(next){
  // here we await the query 
  this.r = await this.findOne(); // Save the doc in new property of object
  next();
});

// Second - to run the static function on doc
reviewSchema.post(/^findOneAnd/, async function(){
  // ! we can't use this.findOne() here, since query is already executed before this middleware
  await this.r.constructor.calcAverageRating(this.r.tour);
})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
