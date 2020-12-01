const express = require("express");

const app = express();
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

// * Applying globally use middleware in app
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));     // logger middleware for console
}

app.use(express.json());    // middleware to read req.body
app.use(express.static(`${__dirname}/public`));

// * Applying middleware as per requested route
app.use("/api/v1/users", userRouter);
app.use('/api/v1/tours', tourRouter);       // mounting routes

// * Middleware to handle undefined routes
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// * Middleware to handle error
app.use(globalErrorHandler);

module.exports = app;