const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/dashboard/stats', authenticateToken, requireAdmin, adminController.getDashboardStats);

module.exports = router;
