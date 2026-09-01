const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

async function seedDb() {
  console.log('🌱 Seeding DearThreado Database...');

  try {
    // 1. Seed Users (Admin + Test Customer)
    const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const customerPasswordHash = await bcrypt.hash('customer123', 10);
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dearthreado.com';
    const customerEmail = 'demo@dearthreado.com';

    const existingAdmin = await query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (existingAdmin.length === 0) {
      await query(`
        INSERT INTO users (name, email, password, phone, role, street_address, city, state, zip_code)
        VALUES (?, ?, ?, ?, 'admin', ?, ?, ?, ?)
      `, ['DearThreado Admin', adminEmail, adminPasswordHash, '+1-800-555-0199', '100 Studio Way', 'Seattle', 'WA', '98101']);
    } else {
      await query('UPDATE users SET password = ?, role = "admin" WHERE email = ?', [adminPasswordHash, adminEmail]);
    }

    const existingCustomer = await query('SELECT id FROM users WHERE email = ?', [customerEmail]);
    if (existingCustomer.length === 0) {
      await query(`
        INSERT INTO users (name, email, password, phone, role, street_address, city, state, zip_code)
        VALUES (?, ?, ?, ?, 'customer', ?, ?, ?, ?)
      `, ['Sophia Bennett', customerEmail, customerPasswordHash, '+1-555-0192', '742 Threado Craft Lane', 'Portland', 'OR', '97201']);
    }

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Handmade Floral Gifts',
        slug: 'floral-gifts',
        description: 'Everlasting dried & preserved floral arrangements lovingly crafted into memory pieces.',
        image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Handmade Cards & Letters',
        slug: 'cards-and-letters',
        description: 'Intricately designed pop-up letters, thread-stitched greetings, and memory explosion boxes.',
        image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Personalized Keepsakes & Frames',
        slug: 'keepsakes-and-frames',
        description: 'Custom hand-embroidered hoops, wooden memory frames, and personalized photo gifts.',
        image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Customized Accessories & Crafts',
        slug: 'accessories-and-crafts',
        description: 'Handmade thread keychains, personalized fabric journals, and customized gifts.',
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const catIdMap = {};
    for (const cat of categoriesData) {
      const existing = await query('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
      let catId;
      if (existing.length === 0) {
        const res = await query(`
          INSERT INTO categories (name, slug, description, image_url)
          VALUES (?, ?, ?, ?)
        `, [cat.name, cat.slug, cat.description, cat.image_url]);
        catId = res.insertId;
      } else {
        catId = existing[0].id;
        await query('UPDATE categories SET name=?, description=?, image_url=? WHERE id=?', [cat.name, cat.description, cat.image_url, catId]);
      }
      catIdMap[cat.slug] = catId;
    }

    // 3. Seed Subcategories
    const subcategoriesData = [
      {
        catSlug: 'floral-gifts',
        name: 'Dried Flower Bouquets',
        slug: 'dried-flower-bouquets',
        description: 'Handpicked dried floral blooms tied with organic linen thread.',
        image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80'
      },
      {
        catSlug: 'floral-gifts',
        name: 'Preserved Flower Frames',
        slug: 'preserved-flower-frames',
        description: 'Real pressed flowers mounted inside glass floating frames with custom calligraphy.',
        image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80'
      },
      {
        catSlug: 'cards-and-letters',
        name: 'Explosion Box Cards',
        slug: 'explosion-box-cards',
        description: 'Multi-layered surprise explosion boxes with hidden message pockets and photos.',
        image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
      },
      {
        catSlug: 'cards-and-letters',
        name: 'Pop-up Love Letters',
        slug: 'pop-up-love-letters',
        description: 'Hand-folded 3D pop-up greeting cards wrapped in silk thread.',
        image_url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'
      },
      {
        catSlug: 'keepsakes-and-frames',
        name: 'Custom Embroidery Hoops',
        slug: 'custom-embroidery-hoops',
        description: 'Hand-stitched thread art hoops personalized with names, dates, or floral borders.',
        image_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80'
      },
      {
        catSlug: 'keepsakes-and-frames',
        name: 'Memory Photo Frames',
        slug: 'memory-photo-frames',
        description: 'Custom wooden photo frames enhanced with handmade clay or string details.',
        image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80'
      },
      {
        catSlug: 'accessories-and-crafts',
        name: 'Thread & Leather Keychains',
        slug: 'thread-leather-keychains',
        description: 'Handwoven thread tassels and personalized initial keychains.',
        image_url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80'
      },
      {
        catSlug: 'accessories-and-crafts',
        name: 'Handmade Fabric Journals',
        slug: 'handmade-fabric-journals',
        description: 'Hand-bound diary notebooks covered in lavender thread-embroidered fabric.',
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const subIdMap = {};
    for (const sub of subcategoriesData) {
      const catId = catIdMap[sub.catSlug];
      if (!catId) continue;

      const existing = await query('SELECT id FROM subcategories WHERE slug = ?', [sub.slug]);
      let subId;
      if (existing.length === 0) {
        const res = await query(`
          INSERT INTO subcategories (category_id, name, slug, description, image_url)
          VALUES (?, ?, ?, ?, ?)
        `, [catId, sub.name, sub.slug, sub.description, sub.image_url]);
        subId = res.insertId;
      } else {
        subId = existing[0].id;
        await query('UPDATE subcategories SET category_id=?, name=?, description=?, image_url=? WHERE id=?', [catId, sub.name, sub.description, sub.image_url, subId]);
      }
      subIdMap[sub.slug] = subId;
    }

    // 4. Seed Products
    const productsData = [
      {
        catSlug: 'floral-gifts',
        subSlug: 'preserved-flower-frames',
        name: 'Vintage Preserved Floral Glass Frame',
        slug: 'vintage-preserved-floral-glass-frame',
        description: 'A delicate floating glass frame encasing hand-pressed wildflowers and soft lavender sprigs. Perfect for anniversaries, birthdays, or milestone keepsakes.',
        price: 34.99,
        is_available: 1,
        customization_enabled: 1,
        size: '8x10 inches',
        color: 'Gold/Lavender',
        specifications: 'Real dried flora, UV-protected dual glass, antique brass frame, silk hanging ribbon.',
        images: [
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'
        ],
        customizations: [
          {
            field_label: 'Name or Short Date on Glass',
            field_type: 'text',
            is_required: 0,
            placeholder: 'e.g. Maya & Leo • 12.04.2025'
          },
          {
            field_label: 'Ribbon Accent Color',
            field_type: 'dropdown',
            options: JSON.stringify(['DearThreado Purple', 'Blush Pink', 'Warm Cream', 'Golden Amber']),
            is_required: 1,
            placeholder: 'Select a ribbon color'
          },
          {
            field_label: 'Custom Photo to Include (Optional)',
            field_type: 'image_upload',
            is_required: 0,
            placeholder: 'Upload your photo'
          }
        ]
      },
      {
        catSlug: 'cards-and-letters',
        subSlug: 'explosion-box-cards',
        name: 'Hand-Crafted Threaded Explosion Card',
        slug: 'hand-crafted-threaded-explosion-card',
        description: 'When opened, this multi-layered handmade box unfolds into a stunning 3D memory palace filled with photo slots, pull-out love tags, and thread-stitched hearts.',
        price: 24.99,
        is_available: 1,
        customization_enabled: 1,
        size: '12x12x12 cm (Closed)',
        color: 'Lavender & Cream',
        specifications: '300gsm specialty handmade paper, cotton thread binding, 4 hidden secret pockets.',
        images: [
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
        ],
        customizations: [
          {
            field_label: 'Personal Message inside Center Box',
            field_type: 'textarea',
            is_required: 1,
            placeholder: 'Write your heartfelt message here...'
          },
          {
            field_label: 'Recipient Name',
            field_type: 'text',
            is_required: 1,
            placeholder: 'e.g. Dearest Anna'
          }
        ]
      },
      {
        catSlug: 'keepsakes-and-frames',
        subSlug: 'custom-embroidery-hoops',
        name: 'Custom Embroidered Memory Hoop',
        slug: 'custom-embroidered-memory-hoop',
        description: 'Intricately hand-embroidered wooden hoop featuring personalized initials, floral wreath, and thread detailing.',
        price: 39.99,
        is_available: 1,
        customization_enabled: 1,
        size: '8 inch Wooden Hoop',
        color: 'Natural Linen / Purple Thread',
        specifications: 'Organic linen fabric, DMC embroidery thread, natural beechwood hoop.',
        images: [
          'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'
        ],
        customizations: [
          {
            field_label: 'Custom Text / Names / Date',
            field_type: 'text',
            is_required: 1,
            placeholder: 'e.g. The Johnsons • Est. 2024'
          },
          {
            field_label: 'Thread Palette Theme',
            field_type: 'dropdown',
            options: JSON.stringify(['DearThreado Purple Palette', 'Blush & Peach Palette', 'Forest & Cream Palette']),
            is_required: 1
          },
          {
            field_label: 'Special Stitches / Instructions',
            field_type: 'textarea',
            is_required: 0,
            placeholder: 'Any specific requests for flowers or motifs...'
          }
        ]
      },
      {
        catSlug: 'accessories-and-crafts',
        subSlug: 'thread-leather-keychains',
        name: 'Woven Thread Initial Keychain',
        slug: 'woven-thread-initial-keychain',
        description: 'Charming handmade braided thread tassel paired with a hand-stamped leather initial tag.',
        price: 12.99,
        is_available: 1,
        customization_enabled: 1,
        size: '4.5 inches length',
        color: 'Purple Tassel & Tan Leather',
        specifications: 'Hand-dyed cotton thread, full-grain leather, antique brass clasp.',
        images: [
          'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80'
        ],
        customizations: [
          {
            field_label: 'Initial Letter (A-Z)',
            field_type: 'text',
            is_required: 1,
            placeholder: 'e.g. K'
          },
          {
            field_label: 'Thread Color Theme',
            field_type: 'color',
            is_required: 0,
            placeholder: '#8B5CF6'
          }
        ]
      },
      {
        catSlug: 'accessories-and-crafts',
        subSlug: 'handmade-fabric-journals',
        name: 'Hand-Bound Lavender Thread Journal',
        slug: 'hand-bound-lavender-thread-journal',
        description: 'Hand-sewn Coptic stitch journal bound with embroidered lavender linen cover and unlined recycled cotton paper.',
        price: 28.50,
        is_available: 1,
        customization_enabled: 1,
        size: 'A5 (120 pages)',
        color: 'Soft Lavender',
        specifications: 'Handmade deckle edge paper, cotton thread binding, bookmark string.',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
        ],
        customizations: [
          {
            field_label: 'Embroidered Monogram on Cover',
            field_type: 'text',
            is_required: 0,
            placeholder: 'e.g. S.B.'
          }
        ]
      }
    ];

    for (const prod of productsData) {
      const catId = catIdMap[prod.catSlug];
      const subId = subIdMap[prod.subSlug];
      if (!catId || !subId) continue;

      const existing = await query('SELECT id FROM products WHERE slug = ?', [prod.slug]);
      let productId;
      if (existing.length === 0) {
        const res = await query(`
          INSERT INTO products (category_id, subcategory_id, name, slug, description, price, is_available, customization_enabled, size, color, specifications)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [catId, subId, prod.name, prod.slug, prod.description, prod.price, prod.is_available, prod.customization_enabled, prod.size, prod.color, prod.specifications]);
        productId = res.insertId;
      } else {
        productId = existing[0].id;
        await query(`
          UPDATE products SET category_id=?, subcategory_id=?, name=?, description=?, price=?, is_available=?, customization_enabled=?, size=?, color=?, specifications=?
          WHERE id=?
        `, [catId, subId, prod.name, prod.description, prod.price, prod.is_available, prod.customization_enabled, prod.size, prod.color, prod.specifications, productId]);
      }

      // Seed product images
      await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
      for (let i = 0; i < prod.images.length; i++) {
        await query(`
          INSERT INTO product_images (product_id, image_url, is_primary)
          VALUES (?, ?, ?)
        `, [productId, prod.images[i], i === 0 ? 1 : 0]);
      }

      // Seed customization fields
      await query('DELETE FROM customization_fields WHERE product_id = ?', [productId]);
      for (const cust of prod.customizations) {
        await query(`
          INSERT INTO customization_fields (product_id, field_label, field_type, options, is_required, placeholder)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [productId, cust.field_label, cust.field_type, cust.options || null, cust.is_required, cust.placeholder || null]);
      }
    }

    console.log('✅ DearThreado Database seeded successfully with sample data!');
  } catch (err) {
    console.error('❌ Error seeding Database:', err);
    throw err;
  }
}

if (require.main === module) {
  seedDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedDb };
