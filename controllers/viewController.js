const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
    // Get the tours from the collection
    const tours = await Tour.find();

    // Build the template ( it will be in views)

    // Send the data with template
    res.status(200).render("overview", {
        title: "All Tours",
        tours: tours
    })
});


exports.getTourDetail = (req, res) => {
    res.status(200).render("tour")
}