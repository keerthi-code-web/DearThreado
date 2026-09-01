const { query } = require('../config/db');

exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await query(`
      SELECT s.*, c.name as category_name, c.slug as category_slug 
      FROM subcategories s 
      JOIN categories c ON s.category_id = c.id
      ORDER BY s.name ASC
    `);
    res.json({ success: true, subcategories });
  } catch (err) {
    console.error('Get Subcategories Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving subcategories.' });
  }
};

exports.getSubcategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const subcategories = await query(`
      SELECT s.*, c.name as category_name, c.slug as category_slug 
      FROM subcategories s 
      JOIN categories c ON s.category_id = c.id
      WHERE s.slug = ?
    `, [slug]);

    if (subcategories.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    const subcategory = subcategories[0];
    const products = await query(`
      SELECT p.*, 
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p 
      WHERE p.subcategory_id = ? AND p.is_available = 1
      ORDER BY p.created_at DESC
    `, [subcategory.id]);

    res.json({
      success: true,
      subcategory: {
        ...subcategory,
        products
      }
    });
  } catch (err) {
    console.error('Get Subcategory By Slug Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving subcategory detail.' });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { category_id, name, slug, description, image_url } = req.body;
    if (!category_id || !name || !slug) {
      return res.status(400).json({ success: false, message: 'Category ID, name, and slug are required.' });
    }

    const result = await query(`
      INSERT INTO subcategories (category_id, name, slug, description, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, [category_id, name, slug, description || null, image_url || null]);

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully.',
      subcategory: { id: result.insertId, category_id, name, slug, description, image_url }
    });
  } catch (err) {
    console.error('Create Subcategory Error:', err);
    res.status(500).json({ success: false, message: 'Server error creating subcategory.' });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, slug, description, image_url } = req.body;

    await query(`
      UPDATE subcategories
      SET category_id = ?, name = ?, slug = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [category_id, name, slug, description || null, image_url || null, id]);

    res.json({ success: true, message: 'Subcategory updated successfully.' });
  } catch (err) {
    console.error('Update Subcategory Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating subcategory.' });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM subcategories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Subcategory deleted successfully.' });
  } catch (err) {
    console.error('Delete Subcategory Error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting subcategory.' });
  }
};
