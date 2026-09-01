const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, cartController.addToCart);
router.put('/items/:itemId', optionalAuth, cartController.updateCartItem);
router.delete('/items/:itemId', optionalAuth, cartController.removeCartItem);
router.delete('/', optionalAuth, cartController.clearCart);

module.exports = router;
