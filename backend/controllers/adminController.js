const { query } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [catCount] = await query('SELECT COUNT(*) as count FROM categories');
    const [subCount] = await query('SELECT COUNT(*) as count FROM subcategories');
    const [prodCount] = await query('SELECT COUNT(*) as count FROM products');
    const [userCount] = await query('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    const [totalOrders] = await query('SELECT COUNT(*) as count FROM orders');
    const [newOrders] = await query('SELECT COUNT(*) as count FROM orders WHERE status = "Placed"');
    const [pendingOrders] = await query('SELECT COUNT(*) as count FROM orders WHERE status IN ("Placed", "Confirmed", "Preparing", "Shipped")');
    const [deliveredOrders] = await query('SELECT COUNT(*) as count FROM orders WHERE status = "Delivered"');
    const [cancelledOrders] = await query('SELECT COUNT(*) as count FROM orders WHERE status = "Cancelled"');
    const [pendingReviews] = await query('SELECT COUNT(*) as count FROM reviews WHERE status = "Pending"');
    const [pendingRequests] = await query('SELECT COUNT(*) as count FROM product_requests WHERE status = "Submitted"');
    const [revenueRes] = await query('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "Paid" OR status = "Delivered"');

    const totalRevenue = revenueRes.total || 0;

    // Recent orders
    const recentOrders = await query(`
      SELECT id, order_number, customer_name, total_amount, status, payment_status, requested_delivery_date, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Recent product requests
    const recentRequests = await query(`
      SELECT pr.*, u.name as customer_name
      FROM product_requests pr
      JOIN users u ON pr.user_id = u.id
      ORDER BY pr.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        total_categories: catCount.count,
        total_subcategories: subCount.count,
        total_products: prodCount.count,
        total_customers: userCount.count,
        total_orders: totalOrders.count,
        new_orders: newOrders.count,
        pending_orders: pendingOrders.count,
        delivered_orders: deliveredOrders.count,
        cancelled_orders: cancelledOrders.count,
        pending_reviews: pendingReviews.count,
        pending_requests: pendingRequests.count,
        total_revenue: parseFloat(parseFloat(totalRevenue).toFixed(2))
      },
      recent_orders: recentOrders,
      recent_requests: recentRequests
    });
  } catch (err) {
    console.error('Get Admin Dashboard Stats Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard statistics.' });
  }
};
