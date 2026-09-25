const express = require('express')
const AuthController = require('../controllers/authController')
const UserContoller = require('../controllers/userController');

const router = express.Router();

router.param('id', (req, res, next, val) =>{
    console.log(`The id or user is: ${val}`);
    next();
})

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

router.post('/forgetPassword', AuthController.forgetPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);
router.patch('/updateMyPassword', AuthController.protect, AuthController.updatePassword);

router.patch('/updateMe', AuthController.protect, UserContoller.updateMe);
router.delete('/deleteMe', AuthController.protect, UserContoller.deleteMe);

router
    .route('/')
    .post(AuthController.protect, AuthController.restrictTo('admin'), UserContoller.updateUser)
    .get(AuthController.protect, AuthController.restrictTo('admin'), UserContoller.getAllUsers)

router
    .route('/:id')
    .delete(AuthController.protect, AuthController.restrictTo('admin'), UserContoller.deleteUser)

module.exports = router;