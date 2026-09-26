const Review = require("../models/reviewModel");
const Factory = require('./handlerFactory');
// const catchAsync = require("../utils/catchAsync");

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
exports.getReviewById = Factory.getOne(Review);