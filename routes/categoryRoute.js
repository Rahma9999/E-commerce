const express = require('express');
const CategoryController = require('../controllers/catergoryController');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.param('id', (req, res, next, val) =>{
    console.log(`The id of Category is: ${val}`);
    next();
})

// router.get('/getAllCategorys',CategoryController.getAllCategories);
// router.post('/addNewCategory', AuthController.protect, AuthController.restrictTo('admin'), CategoryController.addNewCategory);

router
    .route('/')
    .get(CategoryController.getAllCategories)
    .post(AuthController.protect, AuthController.restrictTo('admin'), CategoryController.addNewCategory)

// router.get('/getCategory/:id', CategoryController.getProudctById);
// router.patch('/editCategory/:id', AuthController.protect, AuthController.restrictTo('admin'), CategoryController.updateCategory);
// router.delete('/delete/:id', AuthController.protect, AuthController.restrictTo('admin'), CategoryController.deleteCategory);

router
    .route('/:id')
    .get(CategoryController.getCategoryById)
    .patch(AuthController.protect, AuthController.restrictTo('admin'), CategoryController.updateCategory)
    .delete( AuthController.protect, AuthController.restrictTo('admin'), CategoryController.deleteCategory)


module.exports = router;