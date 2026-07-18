const User = require('../models/userModel')
const CatchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken');

exports.signup = CatchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        phone
    } = req.body;

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        phone
    });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
});