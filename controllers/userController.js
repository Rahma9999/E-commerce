const User = require('../models/userModel')
const CatchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

exports.checkUser = (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm)
        return next(new AppError('Use /updateMyPassword', 400));
    req.body = filterObj(req.body, 'firstName', 'lastName', 'phone', 'email', 'role', 'active');
    next();
};

///////⚠️ Bug: when use user/deleteMe the record doesn't appear here//////////
exports.getAllUsers = Factory.getAll(User);
// we don't update password with this.
exports.updateUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);
exports.getUserById = Factory.getOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = CatchAsync( async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm)
        return next(new AppError('This route is not for password update, Please use /updateMyPassword.', 400));

    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'phone', 'email');
    
    const updateUser = await User.findByIdAndUpdate(
        req.user.id, 
        filteredBody, 
        { returnDocument: 'after', runValidators: true }
    );
    
    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser
        }
    });
});

exports.deleteMe = CatchAsync( async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});