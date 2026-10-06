const express = require('express');
const AuthController = require('../controllers/authController');
const OrderController = require('../controllers/orderController')

const router = express.Router();

router.use(AuthController.protect);

router.post('/', OrderController.createOrder);
router.get('/my', OrderController.getMyOrders);
router.get('/:id', OrderController.getOrder);
router.patch('/:id/cancel', OrderController.cancelOrder);

//////////////////// Admin ///////////////////
router.use(AuthController.restrictTo('admin'));

router.get('/', OrderController.getAllOrders);
router.patch('/:id/status', OrderController.updateOrderStatus);

module.exports = router;