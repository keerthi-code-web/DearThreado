const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', subcategoryController.getSubcategories);
router.get('/:slug', subcategoryController.getSubcategoryBySlug);
router.post('/', authenticateToken, requireAdmin, subcategoryController.createSubcategory);
router.put('/:id', authenticateToken, requireAdmin, subcategoryController.updateSubcategory);
router.delete('/:id', authenticateToken, requireAdmin, subcategoryController.deleteSubcategory);

module.exports = router;
