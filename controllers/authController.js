const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const CatchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
// const sendEmail = require('../utils/email')
const Email = require('../utils/email');
const { promisify } = require('util')
const OTP = require('../models/otpModel')

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
        password,
        passwordConfirm,
        phone, 
        avatar
    });
    
    sendOTP(user, res, next);
});


exports.login = CatchAsync( async (req, res, next) => {
    const { email, password } = req.body;
    
    if( !email || !password )
        return next( new AppError('Please provide email and password!', 400))
    
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password)))
        return next(new AppError('Incorrect email or password!', 401));
    
    if(!user.verified)
    return next(new AppError("Email not verified.", 403));

    createSendToken(user, 200, res);
});


exports.forgetPassword = CatchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new AppError('There is no user with this email address.', 404)
        );
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    try {
        const resetURL =
            `${req.protocol}://${req.get('host')}` +
            `/user/resetPassword/${resetToken}`;

        await new Email(user, '', resetURL).sendResetPassword();

        res.status(200).json({
            status: 'success',
            message: 'Password reset link sent to email.',
            resetToken
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save();

        console.error('Password reset email error:', err);

        return next(
            new AppError(
                'There was an error sending the email. Try again later!',
                500
            )
        );
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
    await OTP.deleteMany({ userId: user._id });

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

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({status: 'success'});
}

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

const sendOTP = CatchAsync(async (user, res, next) => {
    const {_id} = user;
    const otp = `${Math.floor(10000 + Math.random() * 90000)}`;
    const hashedOTP = await bcrypt.hash(otp, 10);
    const expireDate = Date.now() + 10 * 60 * 1000; //10 min

    await OTP.create({
        userId: _id,
        otp: hashedOTP,
        createdAt: Date.now(),
        expireAt: expireDate
    });

    await new Email(user, otp).sendOTP();
    createSendToken(user,201,res);
});

exports.verifyOTP = CatchAsync(async (req, res, next) => {
    const {email, otp} = req.body;
    if(!email || !otp)
        return next(new AppError('Empty OTP details', 400));
    
    const user = await User.findOne({email});
    if (!user) 
        return next(new AppError("User not found", 404));
    
    const userId = user._id;
    const userOTPRecord = await OTP.find({userId});

    if(userOTPRecord.length === 0)
        return next(new AppError("Account doesn't exist or has been verified already. Please signup or login"), 400);

    const {expireAt} = userOTPRecord[0];

    if(expireAt < Date.now()){
        await OTP.deleteMany({userId});
        return next(new AppError("OTP expired. Please request again.", 400));
    }

    const hashedOTP = userOTPRecord[0].otp;
    const validOTP = await bcrypt.compare(otp, hashedOTP);
    if(!validOTP){
        return next(new AppError("Invalid OTP", 400));
    }
    
    await OTP.deleteMany({userId});
    await User.findByIdAndUpdate(userId, {verified: true});
    res.status(200).json({
        veriifed: true,
        message: "Email verified successfully."
    });
});

exports.resendOTP = CatchAsync(async (req, res, next) => {

    const {email} = req.body;
    if(!email)
        return next(new AppError('Email is missing', 400));
    
    const user = await User.findOne({email});
    if(!user)
        return next(new AppError('User not found', 400));
    
    const userId = user._id;
    await OTP.deleteMany({userId});
    sendOTPVerification(user, res, next);
});
