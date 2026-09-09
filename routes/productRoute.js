const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

router.get('/getAllProducts', ProductController.getAllProducts);
router.get('/getProduct/:id', ProductController.getProudctById);
router.post('/addNewProduct', ProductController.addNewProduct);
router.patch('/editProduct/:id', ProductController.updateProduct);
router.delete('/delete/:id', ProductController.deleteProduct);

module.exports = router;