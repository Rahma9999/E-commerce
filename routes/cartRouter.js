const express = require('express');
const CartController = require('../controllers/cartController');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.use(AuthController.protect);

router.get('/myCart', CartController.getCartId, CartController.getCart);
router.post('/addItem', CartController.addItemToCart);
router.patch('/:id', CartController.updateCartItem);
router.delete('/:id', CartController.removeItemFromCart);
router.delete('/', CartController.clearCart);

module.exports = router;