const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const AuthController = require('../controllers/authController');

router.use(AuthController.protect);

router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistController.toggleWishlistItem);

module.exports = router;
