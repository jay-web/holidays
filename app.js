const express = require("express");

const app = express();
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

// * Applying globally use middleware in app
if(process.env.NODE_ENV === 'development'){
     // logger middleware for console
    app.use(morgan('dev'));    
}
// Set security http header
app.use(helmet());


// Rate limiter middleware to set request limit from any IP
const limiter = rateLimiter({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again after in an hour"
})
app.use("/api", limiter);

// middleware to read req.body
app.use(express.json({ limit:  '10kb'}));    

// middleware to protect from NoSQL query injection ( Data Sanitization)
app.use(mongoSanitize());

// middleware to protect from XSS 
app.use(xss());

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