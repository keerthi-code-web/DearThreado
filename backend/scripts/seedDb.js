const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

async function seedDb() {
  console.log('🌱 Seeding DearThreado Database with Finalized Categories & Products...');

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

    // 2. Clear old categories and seed 4 locked categories
    await query('DELETE FROM customization_fields');
    await query('DELETE FROM product_images');
    await query('DELETE FROM products');
    await query('DELETE FROM subcategories');
    await query('DELETE FROM categories');

    const categoriesData = [
      {
        name: 'Floral',
        slug: 'floral',
        description: 'Everlasting dried & preserved floral arrangements, flower frames, and floral hoops.',
        image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Pipecleaner',
        slug: 'pipecleaner',
        description: 'Creative hand-twisted pipe cleaner flowers, cute animal characters, and decorative pieces.',
        image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Paper Craft',
        slug: 'paper-craft',
        description: 'Intricately designed pop-up cards, memory scrapbooks, paper flowers, and paper decor.',
        image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80'
      },
      {
        name: 'Photo Related Products',
        slug: 'photo-related-products',
        description: 'Custom wooden photo frames, personalized photo greeting cards, memory books, and photo strips.',
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const catIdMap = {};
    for (const cat of categoriesData) {
      const res = await query(`
        INSERT INTO categories (name, slug, description, image_url)
        VALUES (?, ?, ?, ?)
      `, [cat.name, cat.slug, cat.description, cat.image_url]);
      catIdMap[cat.slug] = res.insertId;
    }

    // 3. Seed Subcategories
    const subcategoriesData = [
      // Floral
      { catSlug: 'floral', name: 'Flower Bouquets', slug: 'flower-bouquets', description: 'Hand-crafted preserved floral bouquets tied with organic thread.', image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'floral', name: 'Flower Frames', slug: 'flower-frames', description: 'Real pressed flowers mounted inside glass floating frames.', image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'floral', name: 'Floral Decor', slug: 'floral-decor', description: 'Handmade floral hoops and hanging room ornaments.', image_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80' },

      // Pipecleaner
      { catSlug: 'pipecleaner', name: 'Pipe Cleaner Flowers', slug: 'pipe-cleaner-flowers', description: 'Colorful hand-sculpted pipe cleaner flower stems.', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'pipecleaner', name: 'Pipe Cleaner Characters', slug: 'pipe-cleaner-characters', description: 'Cute handcrafted animals, teddy bears, and butterflies.', image_url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'pipecleaner', name: 'Pipe Cleaner Decor', slug: 'pipe-cleaner-decor', description: 'Playful desktop figurines and flower pot decor.', image_url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80' },

      // Paper Craft
      { catSlug: 'paper-craft', name: 'Handmade Cards', slug: 'handmade-cards', description: 'Intricate pop-up and stitched greeting cards.', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'paper-craft', name: 'Scrapbooks', slug: 'scrapbooks', description: 'Personalized mini memory scrapbooks with photo pockets.', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'paper-craft', name: 'Paper Flowers', slug: 'paper-flowers', description: 'Crepe and origami paper floral blooms.', image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'paper-craft', name: 'Paper Decor', slug: 'paper-decor', description: 'Hand-cut paper wall banners and desktop frames.', image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80' },

      // Photo Related Products
      { catSlug: 'photo-related-products', name: 'Photo Frames', slug: 'photo-frames', description: 'Custom wooden photo frames enhanced with hand craft details.', image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'photo-related-products', name: 'Photo Cards', slug: 'photo-cards', description: 'Handcrafted greeting cards with integrated photo slots.', image_url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80' },
      { catSlug: 'photo-related-products', name: 'Photo Gifts', slug: 'photo-gifts', description: 'Custom photo strips, photo cubes, and keepsake albums.', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80' }
    ];

    const subIdMap = {};
    for (const sub of subcategoriesData) {
      const catId = catIdMap[sub.catSlug];
      if (!catId) continue;

      const res = await query(`
        INSERT INTO subcategories (category_id, name, slug, description, image_url)
        VALUES (?, ?, ?, ?, ?)
      `, [catId, sub.name, sub.slug, sub.description, sub.image_url]);
      subIdMap[sub.slug] = res.insertId;
    }

    // 4. Seed Products
    const productsData = [
      // Floral Products
      {
        catSlug: 'floral',
        subSlug: 'flower-bouquets',
        name: 'Handmade Rose Bouquet',
        slug: 'handmade-rose-bouquet',
        description: 'A charming hand-wrapped arrangement of preserved velvet roses and baby’s breath tied with lavender thread.',
        price: 899.00,
        is_available: 1,
        customization_enabled: 1,
        size: '12 inches tall',
        color: 'Soft Pink & Lavender',
        specifications: 'Real dried roses, eco-friendly linen wrapper, cotton thread bow.',
        images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Ribbon Accent Color', field_type: 'dropdown', options: JSON.stringify(['DearThreado Purple', 'Blush Pink', 'Cream White']), is_required: 1 },
          { field_label: 'Custom Message Tag Text', field_type: 'text', is_required: 0, placeholder: 'e.g. Happy Birthday Maya!' }
        ]
      },
      {
        catSlug: 'floral',
        subSlug: 'flower-frames',
        name: 'Dried Flower Frame',
        slug: 'dried-flower-frame',
        description: 'Double-glass floating frame containing pressed wildflowers and hand-lettered calligraphy.',
        price: 1499.00,
        is_available: 1,
        customization_enabled: 1,
        size: '8x10 inches',
        color: 'Antique Brass & Flora',
        specifications: 'UV-protected dual glass, brass frame, pressed natural blooms.',
        images: ['https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Calligraphy Name / Date on Glass', field_type: 'text', is_required: 1, placeholder: 'e.g. Leo & Maya • Est. 2024' }
        ]
      },
      {
        catSlug: 'floral',
        subSlug: 'floral-decor',
        name: 'Floral Hoop Decor',
        slug: 'floral-hoop-decor',
        description: 'Hand-woven wooden embroidery hoop trimmed with dried lavender, eucalyptus, and ribbon.',
        price: 1199.00,
        is_available: 1,
        customization_enabled: 1,
        size: '8 inch Hoop',
        color: 'Natural Wood & Purple',
        specifications: 'Beechwood hoop, organic dried flora, silk hanging ribbon.',
        images: ['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Monogram Letter in Hoop', field_type: 'text', is_required: 0, placeholder: 'e.g. S' }
        ]
      },
      {
        catSlug: 'floral',
        subSlug: 'flower-bouquets',
        name: 'Mini Flower Bouquet',
        slug: 'mini-flower-bouquet',
        description: 'Adorable pocket-sized dried flower bouquet ideal for desk gifts and secret notes.',
        price: 599.00,
        is_available: 1,
        customization_enabled: 0,
        size: '6 inches tall',
        color: 'Pastel Mixed',
        specifications: 'Dried lagurus and statice flowers.',
        images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'],
        customizations: []
      },

      // Pipecleaner Products
      {
        catSlug: 'pipecleaner',
        subSlug: 'pipe-cleaner-flowers',
        name: 'Pipe Cleaner Flower Bouquet',
        slug: 'pipe-cleaner-flower-bouquet',
        description: 'Hand-bent plush pipe cleaner tulips and daisies in bright everlasting pastels.',
        price: 799.00,
        is_available: 1,
        customization_enabled: 1,
        size: '10 Stems',
        color: 'Purple & Yellow Tulips',
        specifications: 'Soft chenille stems, floral tape, kraft paper wrapper.',
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Flower Palette Theme', field_type: 'dropdown', options: JSON.stringify(['Purple & Cream', 'Pink & White', 'Sunburst Yellow']), is_required: 1 }
        ]
      },
      {
        catSlug: 'pipecleaner',
        subSlug: 'pipe-cleaner-characters',
        name: 'Handmade Pipe Cleaner Butterfly',
        slug: 'handmade-pipe-cleaner-butterfly',
        description: 'Whimsical hand-woven pipe cleaner butterfly bookmark with bead antennae.',
        price: 399.00,
        is_available: 1,
        customization_enabled: 0,
        size: '4 inches wide',
        color: 'Lavender & White',
        specifications: 'Chenille wire, glass beads, metal clip.',
        images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80'],
        customizations: []
      },
      {
        catSlug: 'pipecleaner',
        subSlug: 'pipe-cleaner-characters',
        name: 'Pipe Cleaner Teddy',
        slug: 'pipe-cleaner-teddy',
        description: 'Fluffy handmade teddy bear sculpted out of plush pipe cleaners holding a mini heart.',
        price: 699.00,
        is_available: 1,
        customization_enabled: 1,
        size: '5 inches tall',
        color: 'Warm Brown',
        specifications: 'High-density chenille wire, felt heart, ribbon tie.',
        images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Heart Color', field_type: 'dropdown', options: JSON.stringify(['DearThreado Purple', 'Red', 'Blush Pink']), is_required: 1 }
        ]
      },
      {
        catSlug: 'pipecleaner',
        subSlug: 'pipe-cleaner-decor',
        name: 'Mini Pipe Cleaner Floral Decor',
        slug: 'mini-pipe-cleaner-floral-decor',
        description: 'Small potted pipe cleaner succulent figurine for office desks.',
        price: 499.00,
        is_available: 1,
        customization_enabled: 0,
        size: '4 inches height',
        color: 'Pastel Green & Lavender',
        specifications: 'Clay pot, chenille wire stems.',
        images: ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'],
        customizations: []
      },

      // Paper Craft Products
      {
        catSlug: 'paper-craft',
        subSlug: 'handmade-cards',
        name: 'Personalized Handmade Greeting Card',
        slug: 'personalized-handmade-greeting-card',
        description: 'Stunning multi-layer handmade greeting card with cotton thread stitching and dried flower accent.',
        price: 349.00,
        is_available: 1,
        customization_enabled: 1,
        size: 'A5 Card',
        color: 'Lavender & Kraft',
        specifications: '300gsm recycled cardstock, silk thread stitching.',
        images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Personal Message Inside', field_type: 'textarea', is_required: 1, placeholder: 'Write your heartfelt message...' },
          { field_label: 'Recipient Name on Cover', field_type: 'text', is_required: 1, placeholder: 'e.g. Dearest Sarah' }
        ]
      },
      {
        catSlug: 'paper-craft',
        subSlug: 'scrapbooks',
        name: 'Mini Memory Scrapbook',
        slug: 'mini-memory-scrapbook',
        description: 'Accordion fold mini scrapbook album with photo corners and secret pull-out message tags.',
        price: 1299.00,
        is_available: 1,
        customization_enabled: 1,
        size: '6x6 inches (12 pages)',
        color: 'Blush & Lavender',
        specifications: 'Hand-bound Coptic stitch, specialty paper, photo pockets.',
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Title Text on Cover', field_type: 'text', is_required: 1, placeholder: 'e.g. Our Adventures 2024' }
        ]
      },
      {
        catSlug: 'paper-craft',
        subSlug: 'paper-flowers',
        name: 'Handmade Paper Flower Bouquet',
        slug: 'handmade-paper-flower-bouquet',
        description: 'Delicate Italian crepe paper peonies and roses wrapped in lace paper.',
        price: 899.00,
        is_available: 1,
        customization_enabled: 0,
        size: '10 inches tall',
        color: 'Soft Peach & Purple',
        specifications: '180g crepe paper, floral wire.',
        images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'],
        customizations: []
      },
      {
        catSlug: 'paper-craft',
        subSlug: 'paper-decor',
        name: 'Custom Paper Photo Frame',
        slug: 'custom-paper-photo-frame',
        description: 'Layered paper shadowbox frame with 3D paper cut floral border.',
        price: 699.00,
        is_available: 1,
        customization_enabled: 1,
        size: '7x7 inches',
        color: 'Cream & Gold',
        specifications: 'Heavyweight cardstock, acrylic front.',
        images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Inscribed Name / Short Quote', field_type: 'text', is_required: 0, placeholder: 'e.g. Memories Last Forever' }
        ]
      },

      // Photo Related Products
      {
        catSlug: 'photo-related-products',
        subSlug: 'photo-frames',
        name: 'Personalized Photo Frame',
        slug: 'personalized-photo-frame',
        description: 'Hand-carved wooden frame enhanced with string art corner detail and custom photo print.',
        price: 999.00,
        is_available: 1,
        customization_enabled: 1,
        size: '5x7 inches Photo Size',
        color: 'Natural Wood & Thread',
        specifications: 'Solid pine wood, clear glass, cotton string art.',
        images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Upload Your Photo', field_type: 'image_upload', is_required: 1 },
          { field_label: 'Bottom Carved Text', field_type: 'text', is_required: 0, placeholder: 'e.g. Together Always' }
        ]
      },
      {
        catSlug: 'photo-related-products',
        subSlug: 'photo-cards',
        name: 'Custom Photo Greeting Card',
        slug: 'custom-photo-greeting-card',
        description: 'Handmade greeting card featuring a polaroid photo holder and string-stitched envelope.',
        price: 449.00,
        is_available: 1,
        customization_enabled: 1,
        size: 'A5 Folded',
        color: 'Lavender & White',
        specifications: '300gsm cardstock, photo slot, twine tie.',
        images: ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Upload Photo to Insert', field_type: 'image_upload', is_required: 1 },
          { field_label: 'Written Note', field_type: 'textarea', is_required: 1, placeholder: 'Write note...' }
        ]
      },
      {
        catSlug: 'photo-related-products',
        subSlug: 'photo-gifts',
        name: 'Mini Photo Memory Book',
        slug: 'mini-photo-memory-book',
        description: 'Compact hand-stitched photo booklet holding up to 10 custom printed memory photos.',
        price: 1199.00,
        is_available: 1,
        customization_enabled: 1,
        size: '4x4 inches',
        color: 'Soft Purple Fabric',
        specifications: 'Linen cloth cover, Coptic stitch binding.',
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Cover Monogram', field_type: 'text', is_required: 1, placeholder: 'e.g. M & L' }
        ]
      },
      {
        catSlug: 'photo-related-products',
        subSlug: 'photo-gifts',
        name: 'Personalized Photo Strips',
        slug: 'personalized-photo-strips',
        description: 'Set of 3 vintage photobooth-style handmade photo strips bound with purple twine.',
        price: 299.00,
        is_available: 1,
        customization_enabled: 1,
        size: '2x6 inches (Set of 3)',
        color: 'Vintage Black & White / Color',
        specifications: '260gsm matte photo paper, twine bundle.',
        images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
        customizations: [
          { field_label: 'Upload 3 Photos', field_type: 'image_upload', is_required: 1 }
        ]
      }
    ];

    for (const prod of productsData) {
      const catId = catIdMap[prod.catSlug];
      const subId = subIdMap[prod.subSlug];
      if (!catId || !subId) continue;

      const res = await query(`
        INSERT INTO products (category_id, subcategory_id, name, slug, description, price, is_available, customization_enabled, size, color, specifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [catId, subId, prod.name, prod.slug, prod.description, prod.price, prod.is_available, prod.customization_enabled, prod.size, prod.color, prod.specifications]);
      const productId = res.insertId;

      // Seed product images
      for (let i = 0; i < prod.images.length; i++) {
        await query(`
          INSERT INTO product_images (product_id, image_url, is_primary)
          VALUES (?, ?, ?)
        `, [productId, prod.images[i], i === 0 ? 1 : 0]);
      }

      // Seed customization fields
      for (const cust of prod.customizations) {
        await query(`
          INSERT INTO customization_fields (product_id, field_label, field_type, options, is_required, placeholder)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [productId, cust.field_label, cust.field_type, cust.options || null, cust.is_required, cust.placeholder || null]);
      }
    }

    console.log('✅ DearThreado Database seeded successfully with finalized 4 categories and 16 products!');
  } catch (err) {
    console.error('❌ Error seeding Database:', err);
    throw err;
  }
}

if (require.main === module) {
  seedDb().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seedDb };
