const express = require('express')
const AuthController = require('../controllers/authController')
const UserContoller = require('../controllers/userController')
const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/forgetPassword', AuthController.forgetPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

// Protect all routes after this middleware
router.use(AuthController.protect);

router.patch('/updateMyPassword', AuthController.updatePassword);
router.get('/me', UserContoller.getMe, UserContoller.getUserById);
router.patch('/updateMe', UserContoller.updateMe);
router.delete('/deleteMe', UserContoller.deleteMe);

// Protected and restricted to admin
router.use(AuthController.restrictTo('admin'))

router
    .route('/')
    .post(UserContoller.updateUser)
    .get(UserContoller.getAllUsers)

router
    .route('/:id')
    .get( UserContoller.getUserById)
    .delete(UserContoller.deleteUser)

module.exports = router;