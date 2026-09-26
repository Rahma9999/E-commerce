const express = require('express')
const ReviewController = require('../controllers/reviewController')
const AuthController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

// product/:productId/reviews

router
    .route('/')
    // /review OR /product/:productId/reviews
    .get(ReviewController.getAllReviews)
    .post(AuthController.protect, AuthController.restrictTo('user'), ReviewController.setProductUserId, ReviewController.createReview)
    .patch(AuthController.protect, AuthController.restrictTo('user'), ReviewController.updateReview)

router
    .route('/:id')
    .get(ReviewController.getReviewById)
    .delete(AuthController.protect, ReviewController.deleteReview)

module.exports = router;