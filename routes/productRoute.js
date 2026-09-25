const express = require('express');
const ProductController = require('../controllers/productController');
const AuthController = require('../controllers/authController');
// const ReviewController = require('../controllers/reviewController');
const ReviewRouter = require('./reviewRouter');

const router = express.Router();

router.param('id', (req, res, next, val) =>{
    console.log(`The id of product is: ${val}`);
    next();
})

//I think we not need to AuthController.protect in 2 get methods => case: role: 'guest'
router.get('/getAllProducts',ProductController.getAllProducts);
router.get('/getProduct/:id', ProductController.getProudctById);
router.post('/addNewProduct', AuthController.protect, AuthController.restrictTo('admin'), ProductController.checkCategory, ProductController.addNewProduct);
router.patch('/editProduct/:id', AuthController.protect, ProductController.updateProduct);
router.delete('/delete/:id', AuthController.protect, AuthController.restrictTo('admin'), ProductController.deleteProduct);

// Nested routes, merge params
router.use('/:productId/reviews', ReviewRouter);

module.exports = router;