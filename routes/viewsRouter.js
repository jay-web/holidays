const express = require("express");
const viewController = require("../controllers/viewController");

const viewRouter = express.Router();

viewRouter.get("/", viewController.getOverview);

viewRouter.get("/tour", viewController.getTourDetail);


module.exports = viewRouter;