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


exports.getTourDetail = catchAsync(async (req, res, next) => {
    // get the individual tour
    const tour = await Tour.findOne({ slug: req.params.slug}).populate(
        {
            path: "reviews",
            fields: 'review rating user'
        }
    )

    // build the template (it will be in views)
    // send the view with data

    res.status(200).render("tour", {
        tour: tour
    })
});