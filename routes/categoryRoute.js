const express = require('express');
const CategoryController = require('../controllers/categoryController');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.param('id', (req, res, next, val) =>{
    console.log(`The id of Category is: ${val}`);
    next();
})

router.get('/getAllCategorys',CategoryController.getAllCategories);
router.get('/getCategory/:id', CategoryController.getProudctById);
router.post('/addNewCategory', AuthController.protect, AuthController.restrictTo('admin'), CategoryController.addNewCategory);
router.patch('/editCategory/:id', AuthController.protect, AuthController.restrictTo('admin'), CategoryController.updateCategory);
router.delete('/delete/:id', AuthController.protect, AuthController.restrictTo('admin'), CategoryController.deleteCategory);

module.exports = router;