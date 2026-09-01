const { query } = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    let sql = 'SELECT * FROM notifications WHERE ';
    const params = [];

    if (req.user.role === 'admin') {
      sql += 'user_id IS NULL OR user_id = ?';
      params.push(req.user.id);
    } else {
      sql += 'user_id = ?';
      params.push(req.user.id);
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const notifications = await query(sql, params);
    const unread_count = notifications.filter(n => !n.is_read).length;

    res.json({ success: true, notifications, unread_count });
  } catch (err) {
    console.error('Get Notifications Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving notifications.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    console.error('Mark As Read Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating notification.' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      await query('UPDATE notifications SET is_read = 1 WHERE user_id IS NULL OR user_id = ?', [req.user.id]);
    } else {
      await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    }
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('Mark All As Read Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating notifications.' });
  }
};
