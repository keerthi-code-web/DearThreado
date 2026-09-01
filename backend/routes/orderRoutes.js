const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, orderController.createOrder);
router.get('/my-orders', authenticateToken, orderController.getMyOrders);
router.get('/admin/all', authenticateToken, requireAdmin, orderController.getAdminOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.post('/:id/cancel', authenticateToken, orderController.cancelMyOrder);
router.put('/:id/status', authenticateToken, requireAdmin, orderController.updateOrderStatus);
router.put('/:id/payment', authenticateToken, requireAdmin, orderController.updatePaymentStatus);
router.post('/:id/admin-cancel', authenticateToken, requireAdmin, orderController.adminCancelOrder);

module.exports = router;
