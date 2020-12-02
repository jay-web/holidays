const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
   
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
}

const sendErrorDev = (err, res ) => {
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res ) => {
   
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }else{
        res.status(500).json({
            status: "error",
            message: "Something went wrong !!!"
        })
    }
     
    
  
}

const globalErrorHandler = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err, res);
    }else if(process.env.NODE_ENV === "production"){
        let error = {...err};

        if(err.name === "CastError") {
            // converting mongodatabase cast error into operational error
            error = handleCastErrorDB(error)
        }
        
        sendErrorProd(error, res);
    }

  
}

module.exports = globalErrorHandler;