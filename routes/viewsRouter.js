const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const viewRouter = express.Router();

viewRouter.use(authController.isLoggedIn);

viewRouter.get("/", viewController.getOverview);

viewRouter.get("/tour/:slug", viewController.getTourDetail);

viewRouter.get("/login", viewController.getLoginForm);

viewRouter.get("/signup", viewController.getSignupForm);


module.exports = viewRouter;