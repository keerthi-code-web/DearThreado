const { query } = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY name ASC');
    const subcategories = await query('SELECT * FROM subcategories ORDER BY name ASC');

    const result = categories.map(cat => ({
      ...cat,
      subcategories: subcategories.filter(sub => sub.category_id === cat.id)
    }));

    res.json({ success: true, categories: result });
  } catch (err) {
    console.error('Get Categories Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving categories.' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const categories = await query('SELECT * FROM categories WHERE slug = ?', [slug]);
    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const category = categories[0];
    const subcategories = await query('SELECT * FROM subcategories WHERE category_id = ? ORDER BY name ASC', [category.id]);
    const products = await query(`
      SELECT p.*, 
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p 
      WHERE p.category_id = ? AND p.is_available = 1
      ORDER BY p.created_at DESC
    `, [category.id]);

    res.json({
      success: true,
      category: {
        ...category,
        subcategories,
        products
      }
    });
  } catch (err) {
    console.error('Get Category By Slug Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving category detail.' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, image_url } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    }

    const result = await query(`
      INSERT INTO categories (name, slug, description, image_url)
      VALUES (?, ?, ?, ?)
    `, [name, slug, description || null, image_url || null]);

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category: { id: result.insertId, name, slug, description, image_url }
    });
  } catch (err) {
    console.error('Create Category Error:', err);
    res.status(500).json({ success: false, message: 'Server error creating category.' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image_url } = req.body;

    await query(`
      UPDATE categories
      SET name = ?, slug = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, slug, description || null, image_url || null, id]);

    res.json({ success: true, message: 'Category updated successfully.' });
  } catch (err) {
    console.error('Update Category Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating category.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Delete Category Error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
};
