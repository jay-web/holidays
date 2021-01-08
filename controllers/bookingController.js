const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
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
                images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`], // only on live domain
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

const createBookingCheckout = async (session) => {
    console.log("session 🧶 ", session);
    const tour = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email})).id;
    const price = session.display_items[0].amount / 100;
    console.log("data 🧳 ", tour, user, price);
    await Booking.create({ tour, user, price})
}

exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];

    let event;
    try {   
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_KEY
        );

    }catch(err){
        return res.status(400).send(`Webhook error : ${err.message}`)
    }

    if(event.type === "checkout.session.completed"){
        createBookingCheckout(event.data.object);
    }

    res.status(200).json({ received : true});

}