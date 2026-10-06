const express = require('express')
const ReviewController = require('../controllers/reviewController')
const AuthController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

// product/:productId/reviews

router
    .route('/')
    // /review OR /product/:productId/reviews
    .get(ReviewController.getAllReviews)
    .post(
        AuthController.protect, 
        AuthController.restrictTo('user', 'admin'), 
        ReviewController.setProductUserId,
        ReviewController.createReview
    )

router
    .route('/:id')
    .get(ReviewController.getReviewById)
    .delete(AuthController.protect, 
        AuthController.restrictTo('user', 'admin'),  
        ReviewController.checkOwner,
        ReviewController.deleteReview
    )
    .patch(AuthController.protect, 
        AuthController.restrictTo('user', 'admin'), 
        ReviewController.checkOwner,
        ReviewController.updateReview
    )

module.exports = router;