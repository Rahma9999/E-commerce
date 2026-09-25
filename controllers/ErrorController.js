const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}
const handleDuplicateValueDB = err => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    message = `Duplicate field value: '${value}'. Please use another ${field}!`;
    return new AppError(message, 400);
}
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}
const handleJWTError = err => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = err => {
    return new AppError('Your token has expired!', 401);
}

//unexpected errors such as TypeError, ReferenceError, etc. will return HTTP 500
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    console.error('Error 💣: ', err);

    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }else {
        res.status(500).json({
            status: 'error',
            message: 'something went is very wrong!!'
        });
    }
}

module.exports = (err, req, res, next) => {

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateValueDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);       
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        sendErrorProd(error, res);
    }
}