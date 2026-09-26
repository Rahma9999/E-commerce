const express = require('express')
const ReviewController = require('../controllers/reviewController')
const AuthController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

// product/:productId/reviews

router
    .route('/')
    // /review OR /product/:productId/reviews
    .get(ReviewController.getAllReviews)
    .post(AuthController.protect, AuthController.restrictTo('user', 'admin'), ReviewController.setProductUserId, ReviewController.createReview)
    .patch(AuthController.protect, AuthController.restrictTo('user', 'admin'), ReviewController.updateReview)

router
    .route('/:id')
    .get(ReviewController.getReviewById)
    .delete(AuthController.protect, AuthController.restrictTo('user', 'admin'), ReviewController.deleteReview)

module.exports = router;