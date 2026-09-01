const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, requestController.createRequest);
router.get('/my-requests', authenticateToken, requestController.getMyRequests);
router.get('/admin/all', authenticateToken, requireAdmin, requestController.getAdminRequests);
router.put('/:id/respond', authenticateToken, requireAdmin, requestController.respondToRequest);

module.exports = router;
