const { query } = require('../config/db');

// Allowed status sequence index map
const STATUS_ORDER = {
  'Placed': 1,
  'Confirmed': 2,
  'Preparing': 3,
  'Shipped': 4,
  'Delivered': 5,
  'Cancelled': 99
};

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { customer_name, customer_email, customer_phone, shipping_street, shipping_city, shipping_state, shipping_zip, requested_delivery_date, items } = req.body;

    if (!customer_name || !customer_email || !customer_phone || !shipping_street || !shipping_city || !shipping_state || !shipping_zip || !requested_delivery_date) {
      return res.status(400).json({ success: false, message: 'All delivery information fields are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty. Cannot place an empty order.' });
    }

    // SERVER-SIDE PRICE RECALCULATION SECURITY
    let serverTotalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const pRows = await query('SELECT id, name, price, is_available FROM products WHERE id = ?', [item.product_id]);
      if (pRows.length === 0 || !pRows[0].is_available) {
        return res.status(400).json({ success: false, message: `Product "${item.product_name || 'Item'}" is unavailable or no longer exists.` });
      }

      const product = pRows[0];
      const authoritativePrice = parseFloat(product.price);
      const qty = parseInt(item.quantity) || 1;
      const subtotal = authoritativePrice * qty;

      serverTotalAmount += subtotal;

      let custVal = item.customization_values || {};
      if (typeof custVal === 'object') custVal = JSON.stringify(custVal);

      processedItems.push({
        product_id: product.id,
        product_name: product.name,
        product_price: authoritativePrice,
        quantity: qty,
        customization_values: custVal,
        subtotal
      });
    }

    const orderNumber = 'DT-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000);

    const result = await query(`
      INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, shipping_street, shipping_city, shipping_state, shipping_zip, requested_delivery_date, status, payment_method, payment_status, total_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Placed', 'COD', 'Pending', ?)
    `, [orderNumber, userId, customer_name, customer_email, customer_phone, shipping_street, shipping_city, shipping_state, shipping_zip, requested_delivery_date, serverTotalAmount]);

    const orderId = result.insertId;

    for (const pItem of processedItems) {
      await query(`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, customization_values, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [orderId, pItem.product_id, pItem.product_name, pItem.product_price, pItem.quantity, pItem.customization_values, pItem.subtotal]);
    }

    // Clear cart for user
    await query('DELETE FROM cart WHERE user_id = ?', [userId]);

    // Create Admin Notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (NULL, 'New Order Placed', ?, 'order_status', ?)
    `, [`Order #${orderNumber} for $${serverTotalAmount.toFixed(2)} was placed by ${customer_name}.`, orderId]);

    // Create Customer Notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (?, 'Order Placed Successfully!', ?, 'order_status', ?)
    `, [userId, `Your order #${orderNumber} has been received and is being processed.`, orderId]);

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully!',
      order: {
        id: orderId,
        order_number: orderNumber,
        total_amount: parseFloat(serverTotalAmount.toFixed(2)),
        status: 'Placed'
      }
    });
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ success: false, message: 'Server error creating order.' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await query(`
      SELECT o.*,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, orders });
  } catch (err) {
    console.error('Get My Orders Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving orders.' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await query('SELECT * FROM orders WHERE id = ?', [id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    // Check authorization: user owns order or user is admin
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const items = await query(`
      SELECT oi.*, 
        (SELECT image_url FROM product_images WHERE product_id = oi.product_id AND is_primary = 1 LIMIT 1) as primary_image
      FROM order_items oi
      WHERE oi.order_id = ?
    `, [id]);

    const formattedItems = items.map(item => {
      let cust = item.customization_values;
      if (typeof cust === 'string') {
        try { cust = JSON.parse(cust); } catch (e) {}
      }
      return { ...item, customization_values: cust || {} };
    });

    res.json({
      success: true,
      order: {
        ...order,
        items: formattedItems
      }
    });
  } catch (err) {
    console.error('Get Order By Id Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving order details.' });
  }
};

exports.cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const orders = await query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    // CANCELLATION RESTRICTION RULE: Allowed ONLY before 'Preparing' (i.e. 'Placed' or 'Confirmed')
    if (order.status === 'Preparing' || order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Order #${order.order_number} cannot be cancelled because it is already in "${order.status}" stage.`
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled.' });
    }

    await query(`
      UPDATE orders
      SET status = 'Cancelled', cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [reason || 'Cancelled by customer', id]);

    // Admin notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (NULL, 'Order Cancelled by Customer', ?, 'order_status', ?)
    `, [`Order #${order.order_number} was cancelled by customer ${order.customer_name}.`, id]);

    res.json({ success: true, message: `Order #${order.order_number} has been cancelled.` });
  } catch (err) {
    console.error('Cancel My Order Error:', err);
    res.status(500).json({ success: false, message: 'Server error cancelling order.' });
  }
};

// ADMIN ENDPOINTS
exports.getAdminOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC';

    const orders = await query(sql, params);
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Get Admin Orders Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving admin orders.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const orders = await query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];
    const currentStep = STATUS_ORDER[order.status] || 0;
    const newStep = STATUS_ORDER[status] || 0;

    // FORWARD-ONLY TRANSITION RULE: Backward transitions strictly forbidden
    if (status !== 'Cancelled' && newStep < currentStep) {
      return res.status(400).json({
        success: false,
        message: `Backward status transition from "${order.status}" to "${status}" is forbidden.`
      });
    }

    await query(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, id]);

    // Customer Notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (?, 'Order Status Update', ?, 'order_status', ?)
    `, [order.user_id, `Your order #${order.order_number} status updated to "${status}".`, id]);

    res.json({ success: true, message: `Order status updated to ${status}.` });
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating order status.' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    await query(`
      UPDATE orders
      SET payment_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [payment_status, id]);

    res.json({ success: true, message: `Payment status updated to ${payment_status}.` });
  } catch (err) {
    console.error('Update Payment Status Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating payment status.' });
  }
};

exports.adminCancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_reason } = req.body;

    if (!cancellation_reason) {
      return res.status(400).json({ success: false, message: 'Cancellation reason is required when admin cancels an order.' });
    }

    const orders = await query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const order = orders[0];

    await query(`
      UPDATE orders
      SET status = 'Cancelled', cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [cancellation_reason, id]);

    // Customer notification
    await query(`
      INSERT INTO notifications (user_id, title, message, type, target_id)
      VALUES (?, 'Order Cancelled', ?, 'order_status', ?)
    `, [order.user_id, `Your order #${order.order_number} was cancelled. Reason: ${cancellation_reason}`, id]);

    res.json({ success: true, message: `Order #${order.order_number} cancelled successfully.` });
  } catch (err) {
    console.error('Admin Cancel Order Error:', err);
    res.status(500).json({ success: false, message: 'Server error cancelling order.' });
  }
};
