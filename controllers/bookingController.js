const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync( async (req, res, next) => {
    // Get the tour
    const tour = await Tour.findById(req.params.tourID);


    // Create checkout session

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url : `${req.protocol}://${req.get('host')}/`,
        cancel_url : `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email : req.user.email,
        client_reference_id: req.params.tourID , // it should be on live domain
        line_items: [
            {
                name: tour.name,
                description: tour.summary,
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`], // only on live domain
                amount: tour.price * 100,// convert into cents
                currency: 'usd',
                quantity: 1

            }
        ]
    });

    // Create session as response
    res.status(200).json({
        status: "success",
        session: session
    })
});