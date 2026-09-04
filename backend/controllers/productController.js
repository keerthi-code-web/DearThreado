const { query } = require('../config/db');

exports.getProducts = async (req, res) => {
  try {
    const { category, subcategory, search, limit } = req.query;
    let sql = `
      SELECT p.*, 
        c.name as category_name, c.slug as category_slug,
        s.name as subcategory_name, s.slug as subcategory_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      sql += ' AND c.slug = ?';
      params.push(category);
    }
    if (subcategory) {
      sql += ' AND s.slug = ?';
      params.push(subcategory);
    }
    if (search) {
      sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY p.created_at DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const products = await query(sql, params);
    res.json({ success: true, products });
  } catch (err) {
    console.error('Get Products Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving products.' });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const products = await query(`
      SELECT p.*, 
        c.name as category_name, c.slug as category_slug,
        s.name as subcategory_name, s.slug as subcategory_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.slug = ?
    `, [slug]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = products[0];

    // Fetch product images
    const images = await query('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC', [product.id]);

    // Fetch customization fields
    const customization_fields = await query('SELECT * FROM customization_fields WHERE product_id = ? ORDER BY id ASC', [product.id]);

    // Parse options field if string JSON
    const parsedCustomization = customization_fields.map(cf => {
      let opts = cf.options;
      if (typeof opts === 'string') {
        try { opts = JSON.parse(opts); } catch (e) {}
      }
      return { ...cf, options: opts };
    });

    // Fetch approved reviews
    const reviews = await query(`
      SELECT r.*, u.name as reviewer_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.status = 'Approved'
      ORDER BY r.created_at DESC
    `, [product.id]);

    // Calculate rating summary
    const avgRating = reviews.length > 0
      ? parseFloat((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1))
      : 0;

    res.json({
      success: true,
      product: {
        ...product,
        images: images.map(img => img.image_url),
        customization_fields: parsedCustomization,
        reviews,
        review_count: reviews.length,
        average_rating: avgRating
      }
    });
  } catch (err) {
    console.error('Get Product By Slug Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving product details.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { category_id, subcategory_id, name, slug, description, price, is_available, customization_enabled, size, color, specifications, images, customizations } = req.body;

    if (!category_id || !subcategory_id || !name || !slug || !price) {
      return res.status(400).json({ success: false, message: 'Category, subcategory, name, slug, and price are required.' });
    }

    const result = await query(`
      INSERT INTO products (category_id, subcategory_id, name, slug, description, price, is_available, customization_enabled, size, color, specifications)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [category_id, subcategory_id, name, slug, description || null, price, is_available ? 1 : 0, customization_enabled ? 1 : 0, size || null, color || null, specifications || null]);

    const productId = result.insertId;

    // Add images
    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await query(`
          INSERT INTO product_images (product_id, image_url, is_primary)
          VALUES (?, ?, ?)
        `, [productId, images[i], i === 0 ? 1 : 0]);
      }
    }

    // Add customizations
    if (customizations && Array.isArray(customizations)) {
      for (const cust of customizations) {
        let opts = cust.options;
        if (Array.isArray(opts)) opts = JSON.stringify(opts);
        await query(`
          INSERT INTO customization_fields (product_id, field_label, field_type, options, is_required, placeholder)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [productId, cust.field_label, cust.field_type, opts || null, cust.is_required ? 1 : 0, cust.placeholder || null]);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      productId
    });
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({ success: false, message: 'Server error creating product.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, subcategory_id, name, slug, description, price, is_available, customization_enabled, size, color, specifications, images, customizations } = req.body;

    await query(`
      UPDATE products
      SET category_id = ?, subcategory_id = ?, name = ?, slug = ?, description = ?, price = ?, is_available = ?, customization_enabled = ?, size = ?, color = ?, specifications = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [category_id, subcategory_id, name, slug, description || null, price, is_available ? 1 : 0, customization_enabled ? 1 : 0, size || null, color || null, specifications || null, id]);

    if (images && Array.isArray(images)) {
      await query('DELETE FROM product_images WHERE product_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        await query(`
          INSERT INTO product_images (product_id, image_url, is_primary)
          VALUES (?, ?, ?)
        `, [id, images[i], i === 0 ? 1 : 0]);
      }
    }

    if (customizations && Array.isArray(customizations)) {
      await query('DELETE FROM customization_fields WHERE product_id = ?', [id]);
      for (const cust of customizations) {
        let opts = cust.options;
        if (Array.isArray(opts)) opts = JSON.stringify(opts);
        await query(`
          INSERT INTO customization_fields (product_id, field_label, field_type, options, is_required, placeholder)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [id, cust.field_label, cust.field_type, opts || null, cust.is_required ? 1 : 0, cust.placeholder || null]);
      }
    }

    res.json({ success: true, message: 'Product updated successfully.' });
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating product.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete Product Error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting product.' });
  }
};
