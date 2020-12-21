const express = require("express");
const viewController = require("../controllers/viewController");

const viewRouter = express.Router();

viewRouter.get("/", viewController.getOverview);

viewRouter.get("/tour/:slug", viewController.getTourDetail);


module.exports = viewRouter;