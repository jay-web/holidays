const express = require("express");

const app = express();
const morgan = require("morgan");
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

module.exports = app;