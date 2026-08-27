const express = require('express')
const AuthController = require('../controllers/authController')

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

router.post('/forgetPassword', AuthController.forgetPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

router.get('/getAllUsers', AuthController.protect, AuthController.getAllUsers);


module.exports = router;