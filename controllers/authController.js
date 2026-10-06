const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')
const CatchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')
const { promisify } = require('util')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, codeStatus, res) => {
    const token = signToken(user._id);

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production')
        cookieOption.secure = true;

    res.cookie('jwt', token, cookieOption);

    //remove the password from the output
    user.password = undefined;

    res.status(codeStatus).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = CatchAsync(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        passwordConfirm,
        phone,
        avatar
    } = req.body;

    const user = await User.create({
        firstName,
        lastName,
        email,
        role,
        password,
        passwordConfirm,
        phone, 
        avatar
    });
    
    createSendToken(user, 201, res);
});


exports.login = CatchAsync( async (req, res, next) => {
    const { email, password } = req.body;
    
    if( !email || !password )
        return next( new AppError('Please provide email and password!', 400))
    
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password)))
        return next(new AppError('Incorrect email or password!', 401));
    
    createSendToken(user, 200, res);
});

exports.forgetPassword = CatchAsync( async (req, res, next) => {
    const user = await User.findOne({ email : req.body.email });
    if(!user)
        return next(new AppError('There is no user with email address.', 404));

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`;

    const message = `Forget your password? Submit a PATCH request with your new password an password Confirm to ${resetURL}.\nIf you didn't forget passowrd, please ignore this email.`;
    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (vaild for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save();

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPassword = CatchAsync( async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpire: {$gt: Date.now()}});
    if(!user)
        return next(new AppError('Token is invaild or has expire.', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

/////////⚠️ Not listen to the error & not change pass
exports.updatePassword = CatchAsync(async (req, res, next) => {
    if(! req.body.passwordCurrent)
        return next(new AppError('The current password is required!!', 400));

    const user = await User.findById(req.user).select('+password');
    
    if(! await user.correctPassword(req.body.passwordCurrent, user.password))
        return next(new AppError('You current password is wrong!',401));

    if (!req.body.password || req.body.password.length < 8)
        return next(new AppError('The Password must be at least 8 characters!!', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
});

exports.protect = CatchAsync( async (req, res, next) => {
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next(new AppError('The user belonging to this token does no longer exist'));
    }

    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.user = freshUser;

    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role))
            return next(new AppError('You do not have a permission to perform this action', 403));
        next();
    }

}