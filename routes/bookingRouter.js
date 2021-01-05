const express = require("express");

const bookingController = require("../controllers/bookingController");
const {protect, restrictTo} = require("../controllers/authController");

const bookingRouter = express.Router();


bookingRouter.get("/checkout-session/:tourID", protect, bookingController.getCheckoutSession);


module.exports = bookingRouter;