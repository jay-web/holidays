const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");
// const { reset } = require("nodemon");

exports.getOverview = catchAsync(async (req, res, next) => {
    // Get the tours from the collection
    const tours = await Tour.find();

    if(!tours){
        return next(new AppError("No tours are available !!!", 404));
    }
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

    if(!tour){
        return next(new AppError(`No tour is available with the name - ${req.params.slug} !!!`, 404));
    }
    // build the template (it will be in views)
    // send the view with data

    res.status(200).render("tour", {
        tour: tour
    })
});

exports.getLoginForm = (req, res) => {
    res.status(200).render("login", {
        title: "Login"
    })
} 

exports.getSignupForm = (req, res) => {
    res.status(200).render("signup", {
        title: "Sign up form"
    })
}

exports.getAccountPage = (req, res ) => {
    res.status(200).render("account", {
        title: "Your account"
    })
}

exports.forgotPassword = (req, res) => {
    res.status(200).render("forgotPassword", {
        title: "Forgot password"
    })
}

exports.passwordInstruction = (req, res) => {
    res.status(200).render("passwordInstruction", {
        title: "Reset password instruction"
    })
}

exports.resetPassword = (req, res) => {
    const resetToken = req.params.resetPasswordToken;
    res.status(200).render("resetPassword", {
        title: "Reset password",
        token : resetToken
    })
}

exports.myBooking = catchAsync(async (req, res, next) => {
    console.log( "user 🧶  ", req.user.id);
    // Get the tours from the collection
    const bookings = await Booking.find({ user: req.user.id});

    const tourId = bookings.map((el)  => el.tour.id);       // array of tour id booked

    const tours = await Tour.find({_id : {$in: tourId}});
    console.log( "bookings 🧶  ", tours);
    
    if(!bookings){
        return next(new AppError("No tour has been booked by you  !!!", 404));
    }
    // Build the template ( it will be in views)

    // Send the data with template
    res.status(200).render("overview", {
        title: "Booked Tours",
        tours: tours
    })
});