const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, street_address, city, state, zip_code } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(`
      INSERT INTO users (name, email, password, phone, role, street_address, city, state, zip_code)
      VALUES (?, ?, ?, ?, 'customer', ?, ?, ?, ?)
    `, [name, email, hashedPassword, phone || null, street_address || null, city || null, state || null, zip_code || null]);

    const userId = result.insertId;
    const userPayload = { id: userId, name, email, role: 'customer' };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to DearThreado.',
      token,
      user: {
        id: userId,
        name,
        email,
        phone: phone || '',
        role: 'customer',
        street_address: street_address || '',
        city: city || '',
        state: state || '',
        zip_code: zip_code || ''
      }
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const userPayload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        street_address: user.street_address || '',
        city: user.city || '',
        state: user.state || '',
        zip_code: user.zip_code || ''
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials or unauthorized account.' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const userPayload = { id: user.id, name: user.name, email: user.email, role: 'admin' };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'admin'
      }
    });
  } catch (err) {
    console.error('Admin Login Error:', err);
    res.status(500).json({ success: false, message: 'Server error during admin login.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, phone, role, street_address, city, state, zip_code, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    res.json({ success: true, user: users[0] });
  } catch (err) {
    console.error('GetMe Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving user details.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, street_address, city, state, zip_code } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    await query(`
      UPDATE users 
      SET name = ?, phone = ?, street_address = ?, city = ?, state = ?, zip_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, phone || null, street_address || null, city || null, state || null, zip_code || null, req.user.id]);

    const updatedUsers = await query('SELECT id, name, email, phone, role, street_address, city, state, zip_code FROM users WHERE id = ?', [req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUsers[0]
    });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
};
