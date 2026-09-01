const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/admin/all', authenticateToken, requireAdmin, reviewController.getAdminReviews);
router.put('/:id/status', authenticateToken, requireAdmin, reviewController.updateReviewStatus);

module.exports = router;
