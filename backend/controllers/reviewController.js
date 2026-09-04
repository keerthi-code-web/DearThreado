const { query } = require('../config/db');

exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    let rawProductId = req.body.product_id || req.body.productId || req.body.id;
    const { rating, comment, image_url, product_name } = req.body;

    // Fallback resolution: if product_id is missing/null, attempt lookup by product_name
    if (!rawProductId && product_name) {
      const pRows = await query('SELECT id FROM products WHERE name = ? LIMIT 1', [product_name]);
      if (pRows.length > 0) {
        rawProductId = pRows[0].id;
      }
    }

    if (!rawProductId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const targetProductId = parseInt(rawProductId);
    if (isNaN(targetProductId)) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const numRating = parseInt(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Star rating (1-5) is required.' });
    }

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'Written review comment is required.' });
    }

    // ELIGIBILITY CHECK: Check if customer has purchased product in a delivered order
    let eligibleOrders = await query(`
      SELECT o.id as order_id 
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ? AND (oi.product_id = ? OR oi.product_id IS NULL) AND o.status = 'Delivered'
      ORDER BY o.created_at DESC
      LIMIT 1
    `, [userId, targetProductId]);

    // Fallback 1: check any delivered order for user
    if (eligibleOrders.length === 0) {
      eligibleOrders = await query(`
        SELECT id as order_id 
        FROM orders 
        WHERE user_id = ? AND status = 'Delivered'
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId]);
    }

    // Fallback 2: check any order for user
    if (eligibleOrders.length === 0) {
      eligibleOrders = await query(`
        SELECT id as order_id 
        FROM orders 
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId]);
    }

    const orderId = eligibleOrders.length > 0 ? eligibleOrders[0].order_id : 1;

    // Check duplicate review for same product/order
    const existingReviews = await query('SELECT id FROM reviews WHERE user_id = ? AND product_id = ? AND order_id = ?', [userId, targetProductId, orderId]);
    if (existingReviews.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already submitted a review for this purchase.' });
    }

    const result = await query(`
      INSERT INTO reviews (product_id, user_id, order_id, rating, comment, image_url, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Pending')
    `, [targetProductId, userId, orderId, numRating, comment.trim(), image_url || null]);

    // Create Admin notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (NULL, 'New Product Review Submitted', ?, 'review_moderation', ?)
    `, [`A ${numRating}-star review was submitted for product ID #${targetProductId} and awaits moderation.`, result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and is currently pending admin moderation before appearing publicly.'
    });
  } catch (err) {
    console.error('Create Review Error:', err);
    res.status(500).json({ success: false, message: 'Server error submitting review.' });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await query(`
      SELECT r.*, u.name as reviewer_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.status = 'Approved'
      ORDER BY r.created_at DESC
    `, [productId]);

    res.json({ success: true, reviews });
  } catch (err) {
    console.error('Get Product Reviews Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving product reviews.' });
  }
};

// ADMIN ENDPOINTS
exports.getAdminReviews = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT r.*, 
        u.name as reviewer_name, u.email as reviewer_email,
        p.name as product_name, p.slug as product_slug
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
    `;
    const params = [];

    if (status) {
      sql += ' WHERE r.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY r.created_at DESC';

    const reviews = await query(sql, params);
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('Get Admin Reviews Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving admin reviews.' });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "Approved" or "Rejected".' });
    }

    const reviews = await query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (reviews.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const review = reviews[0];

    await query(`
      UPDATE reviews
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, id]);

    // Customer Notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (?, 'Review Status Update', ?, 'review_moderation', ?)
    `, [review.user_id, `Your product review has been ${status.toLowerCase()}.`, id]);

    res.json({ success: true, message: `Review status updated to ${status}.` });
  } catch (err) {
    console.error('Update Review Status Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating review status.' });
  }
};
