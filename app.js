const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// ! Security packages 
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
// ! ===================


const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRouter");
const viewRouter = require("./routes/viewsRouter");
const bookingRouter = require("./routes/bookingRouter");
const bookingController = require("./controllers/bookingController");

app.enable('trust-proxy');
app.use(cors());    // enabling header - Access Control Allow ORIGIN

app.options("*", cors()); // enabling patch, put, delete request on cors

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


// * Applying globally use middleware in app
if(process.env.NODE_ENV === 'development'){
     // logger middleware for console
    app.use(morgan('dev'));    
}
// Set security http header
app.use(helmet({
    contentSecurityPolicy: false,
  }));


// Rate limiter middleware to set request limit from any IP
const limiter = rateLimiter({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again after in an hour"
})
app.use("/api", limiter);

app.use(compression());

app.post('/webhook-checkout', express.raw({ type: 'application/json'}), bookingController.webhookCheckout);

// middleware to read req.body
app.use(express.json({ limit:  '10kb'}));    

// middleware to read cookies
app.use(cookieParser());

// middleware to protect from NoSQL query injection ( Data Sanitization)
app.use(mongoSanitize());

// middleware to protect from XSS 
app.use(xss());

// middleware to protect from http parameter pollution
app.use(hpp());

app.use(express.static(path.join(__dirname, "public")));

// * Applying middleware as per requested route

app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use('/api/v1/tours', tourRouter);       // mounting routes
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

// * Middleware to handle undefined routes
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// * Middleware to handle error
app.use(globalErrorHandler);

module.exports = app;