const express = require('express')
const AuthController = require('../controllers/authController')

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/forgetPassword', AuthController.forgetPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

// Before all of the following, you must be logged in.
router.use(AuthController.protect);

router.patch('/updateMyPassword', AuthController.updatePassword);
router.get('/me', UserContoller.getMe, UserContoller.getUserById);
router.patch('/updateMe', UserContoller.updateMe);
router.delete('/deleteMe', UserContoller.deleteMe);

router
    .route('/')
    .post(AuthController.restrictTo('admin'), UserContoller.updateUser)
    .get(AuthController.restrictTo('admin'), UserContoller.getAllUsers)

router
    .route('/:id')
    .get(AuthController.restrictTo('admin'), UserContoller.getUserById)
    .delete(AuthController.restrictTo('admin'), UserContoller.deleteUser)

module.exports = router;