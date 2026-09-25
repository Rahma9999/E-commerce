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

///////⚠️ Bug: when use user/deleteMe the record doesn't appear here//////////
exports.getAllUsers = Factory.getAll(User);
// we don't update password with this.
exports.updateUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);

exports.updateMe = CatchAsync( async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm)
        return next(new AppError('This route is not for password update, Please use /updateMyPassword.', 400));

    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'phone', 'email');
    
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody);
    
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