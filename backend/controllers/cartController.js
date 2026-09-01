const { query } = require('../config/db');

// Helper to get or create cart
async function getOrCreateCart(userId, sessionToken) {
  let cart = null;
  if (userId) {
    const carts = await query('SELECT * FROM cart WHERE user_id = ?', [userId]);
    if (carts.length > 0) {
      cart = carts[0];
    } else {
      const res = await query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
      cart = { id: res.insertId, user_id: userId };
    }
  } else if (sessionToken) {
    const carts = await query('SELECT * FROM cart WHERE session_token = ?', [sessionToken]);
    if (carts.length > 0) {
      cart = carts[0];
    } else {
      const res = await query('INSERT INTO cart (session_token) VALUES (?)', [sessionToken]);
      cart = { id: res.insertId, session_token: sessionToken };
    }
  } else {
    const newToken = 'guest_' + Math.random().toString(36).substring(2, 15);
    const res = await query('INSERT INTO cart (session_token) VALUES (?)', [newToken]);
    cart = { id: res.insertId, session_token: newToken };
  }
  return cart;
}

exports.getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionToken = req.headers['x-session-token'] || req.query.session_token;

    const cart = await getOrCreateCart(userId, sessionToken);
    const items = await query(`
      SELECT ci.*, 
        p.name as product_name, p.slug as product_slug, p.price as current_price, p.is_available,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
      ORDER BY ci.created_at DESC
    `, [cart.id]);

    const formattedItems = items.map(item => {
      let cust = item.customization_values;
      if (typeof cust === 'string') {
        try { cust = JSON.parse(cust); } catch (e) {}
      }
      return {
        ...item,
        customization_values: cust || {}
      };
    });

    const total = formattedItems.reduce((acc, curr) => acc + (parseFloat(curr.unit_price) * curr.quantity), 0);

    res.json({
      success: true,
      cart_id: cart.id,
      session_token: cart.session_token,
      items: formattedItems,
      total_amount: parseFloat(total.toFixed(2))
    });
  } catch (err) {
    console.error('Get Cart Error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving cart.' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionToken = req.headers['x-session-token'] || req.body.session_token;
    const { product_id, quantity, customization_values } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const products = await query('SELECT * FROM products WHERE id = ?', [product_id]);
    if (products.length === 0 || !products[0].is_available) {
      return res.status(400).json({ success: false, message: 'Product is unavailable.' });
    }

    const product = products[0];
    const qty = parseInt(quantity) || 1;
    const custString = JSON.stringify(customization_values || {});

    const cart = await getOrCreateCart(userId, sessionToken);

    // Check if matching cart item exists with exact same product AND exact same customization_values
    const existingItems = await query(`
      SELECT * FROM cart_items 
      WHERE cart_id = ? AND product_id = ?
    `, [cart.id, product_id]);

    let match = null;
    for (const item of existingItems) {
      let itemCust = item.customization_values;
      if (typeof itemCust === 'object') itemCust = JSON.stringify(itemCust || {});
      if (itemCust === custString) {
        match = item;
        break;
      }
    }

    if (match) {
      const newQty = match.quantity + qty;
      await query('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newQty, match.id]);
    } else {
      await query(`
        INSERT INTO cart_items (cart_id, product_id, quantity, customization_values, unit_price)
        VALUES (?, ?, ?, ?, ?)
      `, [cart.id, product_id, qty, custString, product.price]);
    }

    res.json({
      success: true,
      message: `${product.name} added to your cart!`,
      session_token: cart.session_token
    });
  } catch (err) {
    console.error('Add to Cart Error:', err);
    res.status(500).json({ success: false, message: 'Server error adding item to cart.' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity);

    if (qty <= 0) {
      await query('DELETE FROM cart_items WHERE id = ?', [itemId]);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }

    await query('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [qty, itemId]);
    res.json({ success: true, message: 'Cart updated.' });
  } catch (err) {
    console.error('Update Cart Item Error:', err);
    res.status(500).json({ success: false, message: 'Server error updating cart item.' });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    console.error('Remove Cart Item Error:', err);
    res.status(500).json({ success: false, message: 'Server error removing item from cart.' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const sessionToken = req.headers['x-session-token'] || req.query.session_token;

    if (userId) {
      await query('DELETE FROM cart WHERE user_id = ?', [userId]);
    } else if (sessionToken) {
      await query('DELETE FROM cart WHERE session_token = ?', [sessionToken]);
    }

    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    console.error('Clear Cart Error:', err);
    res.status(500).json({ success: false, message: 'Server error clearing cart.' });
  }
};
