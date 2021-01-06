const mongoose = require("mongoose");
const Tour = require("./tourModel");
const User = require("./userModel");

const bookingSchema = mongoose.Schema({
    tour : {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, "A tour must be include in booking"]
    },
    user : {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A tour must belong to user"]
    },
    price: {
        type: Number,
        require: [true, "A booking must include its price"]
    },
    createdAt : {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre(/^find/, function(next){
    this.populate("user").populate({
        path: "tour",
        select: "name"
    })
})


const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;