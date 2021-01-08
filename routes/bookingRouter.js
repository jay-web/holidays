const express = require("express");

const bookingController = require("../controllers/bookingController");
const {protect, restrictTo} = require("../controllers/authController");

const bookingRouter = express.Router();


bookingRouter.get("/checkout-session/:tourID", protect, bookingController.getCheckoutSession);

bookingRouter.post("/webhook-checkout", protect, bookingController.webhookCheckout)


module.exports = bookingRouter;