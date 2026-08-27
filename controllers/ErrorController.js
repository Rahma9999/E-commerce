const AppError = require('../utils/appError')

const handleJWTError = err => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = err => new AppError('Your token has expired!', 401);


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });

    if(process.env.NODE_ENV === 'development'){
        // sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if(error.name === 'JsonWebTokenError') handleJWTError(error);
        if(error.name === 'TokenExpiredError') handleJWTExpiredError(errpr);
    }

    // console.log('Error Details:', {
    //     name: err.name,
    //     code: err.code,
    //     message: err.message,
    //     keyValue: err.keyValue
    // });

    // if (process.env.NODE_ENV === 'development') {

    //     return res.status(err.statusCode).json({
    //     status: err.status,
    //     error: err,
    //     message: err.message,
    //     stack: err.stack
    //     });

    // } else {
    //     // MongoDB duplicate key
    //     if (err.code === 11000) {
    //     const field = Object.keys(err.keyValue)[0];
    //     const value = err.keyValue[field];
    //     err.isOperational = true;
    //     return res.status(400).json({
    //         status: 'fail',
    //         message: `Duplicate field value: '${value}'. Please use another ${field}!`
    //     });
    //     }

    //     // CastError (invalid id)
    //     if (err.name === 'CastError') {
    //     err.isOperational = true;
    //     return res.status(400).json({
    //         status: 'fail',
    //         message: `Invalid ${err.path}: ${err.value}`
    //     });
    //     }

    //     // Validation error
    //     if (err.name === 'ValidationError') {
    //     err.isOperational = true;
    //     const errors = Object.values(err.errors).map(el => el.message);
    //     const message = `Invalid input data. ${errors.join('. ')}`;
    //     return res.status(400).json({
    //         status: 'fail',
    //         message
    //     });
    //     }
    // }
}