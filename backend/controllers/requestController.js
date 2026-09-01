const { query } = require('../config/db');

exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, budget_range, reference_image_url } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Idea title and description are required.' });
    }

    const result = await query(`
      INSERT INTO product_requests (user_id, title, description, budget_range, reference_image_url, status)
      VALUES (?, ?, ?, ?, ?, 'Submitted')
    `, [userId, title, description, budget_range || null, reference_image_url || null]);

    const requestId = result.insertId;

    // Admin notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (NULL, 'New Product Request Received', ?, 'product_request', ?)
    `, [`Customer submitted a new custom gift request: "${title}".`, requestId]);

    res.status(201).json({
      success: true,
      message: 'Your custom gift request has been submitted to DearThreado! We will review your idea and update you soon.',
      requestId
    });
  } catch (err) {
    console.error('Create Request Error:', err);
    res.status(500).json({ success: false, message: 'Server error submitting product request.' });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await query(`
      SELECT * FROM product_requests
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [req.user.id]);

    res.json({ success: true, requests });
  } catch (err) {
    console.error('Get My Requests Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving product requests.' });
  }
};

// ADMIN ENDPOINTS
exports.getAdminRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT pr.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
      FROM product_requests pr
      JOIN users u ON pr.user_id = u.id
    `;
    const params = [];

    if (status) {
      sql += ' WHERE pr.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY pr.created_at DESC';

    const requests = await query(sql, params);
    res.json({ success: true, requests });
  } catch (err) {
    console.error('Get Admin Requests Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving admin requests.' });
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response } = req.body;

    if (!status || !['Reviewed', 'Planned', 'Not Planned'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "Reviewed", "Planned", or "Not Planned".' });
    }

    const requests = await query('SELECT * FROM product_requests WHERE id = ?', [id]);
    if (requests.length === 0) {
      return res.status(404).json({ success: false, message: 'Product request not found.' });
    }

    const requestItem = requests[0];

    await query(`
      UPDATE product_requests
      SET status = ?, admin_response = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, admin_response || null, id]);

    // Customer Notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (?, 'Response to Your Gift Request', ?, 'product_request', ?)
    `, [requestItem.user_id, `DearThreado responded to your request "${requestItem.title}": ${admin_response || status}`, id]);

    res.json({ success: true, message: 'Response sent to customer successfully.' });
  } catch (err) {
    console.error('Respond To Request Error:', err);
    res.status(500).json({ success: false, message: 'Server error responding to request.' });
  }
};
