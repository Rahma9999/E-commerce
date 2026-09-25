const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const Factory = require('./handlerFactory');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//     let filter = {}
//     if(req.params.productId) filter = {product: req.params.productId}
    
//     const records = await Review.find(filter);
//     res.status(200).json({
//         status: 'success',
//         results: records.length, 
//         data: {
//             records
//         }
//     });
// });

exports.setProductUserId = (req, res, next) => {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;
    next();
}

exports.createReview = Factory.createOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
/* still factory by ID */
exports.getAllReviews = Factory.getAll(Review);