const express = require("express");

const app = express();
const morgan = require("morgan");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

// * Applying globally use middleware in app
app.use(morgan('dev'));     // logger middleware for console
app.use(express.json());    // middleware to read req.body

// * Applying middleware as per requested route
app.use("/api/v1/users", userRouter);
app.use('/api/v1/tours', tourRouter);       // mounting routes

module.exports = app;