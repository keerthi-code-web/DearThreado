const { getPool, query } = require('../config/db');

async function initDb() {
  console.log('Initializing DearThreado Database Schema...');
  await getPool();

  try {
    // 1. Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(20) DEFAULT 'customer',
        street_address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Subcategories table
    await query(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    // 4. Products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        subcategory_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        is_available TINYINT(1) DEFAULT 1,
        customization_enabled TINYINT(1) DEFAULT 0,
        size VARCHAR(100),
        color VARCHAR(100),
        specifications TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
      );
    `);

    // 5. Product Images table
    await query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        image_url TEXT NOT NULL,
        is_primary TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // 6. Customization Fields table
    await query(`
      CREATE TABLE IF NOT EXISTS customization_fields (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        field_label VARCHAR(255) NOT NULL,
        field_type VARCHAR(50) NOT NULL,
        options TEXT,
        is_required TINYINT(1) DEFAULT 0,
        placeholder VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // 7. Cart table
    await query(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        session_token VARCHAR(255) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 8. Cart Items table
    await query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT DEFAULT 1,
        customization_values TEXT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);

    // 9. Orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(100) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        shipping_street TEXT NOT NULL,
        shipping_city VARCHAR(100) NOT NULL,
        shipping_state VARCHAR(100) NOT NULL,
        shipping_zip VARCHAR(20) NOT NULL,
        requested_delivery_date DATE NOT NULL,
        actual_delivery_date DATE NULL,
        status VARCHAR(50) DEFAULT 'Placed',
        payment_method VARCHAR(50) DEFAULT 'COD',
        payment_status VARCHAR(50) DEFAULT 'Pending',
        cancellation_reason TEXT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    try {
      await query('ALTER TABLE orders ADD COLUMN actual_delivery_date DATE NULL;');
    } catch (e) {
      // Column already exists
    }

    // 10. Order Items table
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        customization_values TEXT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      );
    `);

    // 11. Reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        order_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        image_url TEXT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);

    // 12. Product Requests table
    await query(`
      CREATE TABLE IF NOT EXISTS product_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        budget_range VARCHAR(100) NULL,
        reference_image_url TEXT NULL,
        status VARCHAR(50) DEFAULT 'Submitted',
        admin_response TEXT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // 13. Notifications table
    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(100) NOT NULL,
        target_id INT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ DearThreado Database Schema initialized successfully!');
  } catch (err) {
    console.error('❌ Error initializing Database:', err);
    throw err;
  }
}

if (require.main === module) {
  initDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { initDb };
