const Review = require("../models/reviewModel");
const Factory = require('./handlerFactory');
const CatchAsync = require("../utils/catchAsync");

exports.setProductUserId = (req, res, next) => {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;
    next();
}

exports.checkOwner = CatchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError('Review not found', 404));
    if (review.user.id !== req.user.id && req.user.role !== 'admin')
        return next(new AppError('Not your review', 403));
    next();
});

exports.createReview = Factory.createOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
/* still factory by ID */
exports.getAllReviews = Factory.getAll(Review);
exports.getReviewById = Factory.getOne(Review);