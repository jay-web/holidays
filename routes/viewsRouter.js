const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const viewRouter = express.Router();

viewRouter.get("/", authController.isLoggedIn, viewController.getOverview);

viewRouter.get("/tour/:slug", authController.isLoggedIn, viewController.getTourDetail);

viewRouter.get("/login", viewController.getLoginForm);

viewRouter.get("/forgotPassword", viewController.forgotPassword);

viewRouter.get("/passwordInstruction", viewController.passwordInstruction);

viewRouter.get("/resetPassword/:resetPasswordToken", viewController.resetPassword);

viewRouter.get("/signup", viewController.getSignupForm);

viewRouter.get("/me", authController.protect, viewController.getAccountPage);

viewRouter.get("/my-tour", authController.protect, viewController.myBooking);




module.exports = viewRouter;