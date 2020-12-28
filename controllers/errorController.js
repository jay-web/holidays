const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const value = err.keyValue["name"];
  const message = `Duplicate field value "${value}". Please use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data - ${errors.join(". ")}`;

  return new AppError(message, 400);
};

// * Error handling in development
const sendErrorDev = (err, req,  res) => {
  // handling error coming while accessing api
  if(req.originalUrl.startsWith("/api")){
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stack: err.stack,
    });
  }else {
    // handling error coming while accessing website
    return res.status(err.statusCode).render("error", {
      title: "Error from website",
      msg: err.message
    })
  }
  
};

// * Error handling in production
const sendErrorProd = (err, req, res) => {
  // handling error coming while accessing api
  if(req.originalUrl.startsWith("/api")){
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Something went wrong !!!",
      });
    }
  }else{
      // handling error coming while accessing website
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        title: "Error from website",
        msg: err.message,
      });
    } else {
      res.status(500).render("error", {
        title: "Error from website",
        msg: "Something went wrong, please try again !!!",
      });
    }
  }
};

const handleJsonWebTokenError = () => {
  return new AppError("Invalid token, please login again !!!", 401);
};

const handleTokenExpiredError = () => {
  return new AppError("Token expired, please login again !!!", 401);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (err.name === "CastError") {
      // converting mongodatabase cast error into operational error
      error = handleCastErrorDB(error);
    }

    if (err.code === 11000) {
      // converting mongo database duplicate filed error into operational error
      error = handleDuplicateFieldDB(error);
    }

    if (err.name === "ValidationError") {
      // converting mongo database validation error into operational error
      error = handleValidationErrorDB(error);
    }

    if (err.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError();
    }

    if (err.name === "TokenExpiredError") {
      error = handleTokenExpiredError();
    }
    sendErrorProd(error, req,  res);
  }
};

module.exports = globalErrorHandler;
