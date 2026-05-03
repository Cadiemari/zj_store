import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST() {
  try {
    const results: Record<string, unknown> = {};

    // ── Admin User ──────────────────────────────────────────
    const adminEmail = 'admin@zjtech.com';
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });

    if (existingAdmin) {
      results.admin = { status: 'already_exists', id: existingAdmin.id };
    } else {
      const adminPassword = await hashPassword('1Simali295');
      const admin = await db.user.create({
        data: {
          email: adminEmail,
          name: 'Admin',
          password: adminPassword,
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          shopName: 'ZJ Tech Store',
          bio: 'Official ZJ Tech admin and store manager.',
        },
      });
      results.admin = { status: 'created', id: admin.id };
    }

    // Get admin id for later use
    const adminUser = await db.user.findUnique({ where: { email: adminEmail } });
    const adminId = adminUser!.id;

    // ── Demo Users ──────────────────────────────────────────
    const demoUsers = [
      { email: 'ahmed@example.com', name: 'Ahmed Khan', password: 'user123', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', shopName: "Ahmed's Shop", bio: 'Electronics enthusiast and seller.' },
      { email: 'sara@example.com', name: 'Sara Ali', password: 'user123', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', shopName: "Sara's Boutique", bio: 'Fashion and lifestyle products.' },
    ];

    const createdUsers: string[] = [];
    for (const userData of demoUsers) {
      const existing = await db.user.findUnique({ where: { email: userData.email } });
      if (existing) {
        createdUsers.push(existing.id);
        continue;
      }
      const hashedPw = await hashPassword(userData.password);
      const user = await db.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPw,
          avatar: userData.avatar,
          shopName: userData.shopName,
          bio: userData.bio,
        },
      });
      createdUsers.push(user.id);
    }
    results.demoUsers = { status: createdUsers.length >= 2 ? 'ready' : 'partial', ids: createdUsers };

    const user1Id = createdUsers[0];
    const user2Id = createdUsers[1];

    // ── Product Categories ──────────────────────────────────
    const productCategories = [
      { name: 'Electronics', icon: '💻', type: 'PRODUCT' },
      { name: 'Mobile Phones', icon: '📱', type: 'PRODUCT' },
      { name: 'Laptops', icon: '🖥️', type: 'PRODUCT' },
      { name: 'Accessories', icon: '🎧', type: 'PRODUCT' },
      { name: 'Gaming', icon: '🎮', type: 'PRODUCT' },
      { name: 'Cameras', icon: '📷', type: 'PRODUCT' },
      { name: 'Audio', icon: '🔊', type: 'PRODUCT' },
      { name: 'Wearables', icon: '⌚', type: 'PRODUCT' },
    ];

    const categoryMap: Record<string, string> = {};
    for (const cat of productCategories) {
      const existing = await db.category.findUnique({ where: { name: cat.name } });
      if (existing) {
        categoryMap[cat.name] = existing.id;
        continue;
      }
      const created = await db.category.create({ data: cat });
      categoryMap[cat.name] = created.id;
    }
    results.productCategories = { status: 'ready', count: Object.keys(categoryMap).length };

    // ── Service Categories ──────────────────────────────────
    const serviceCategories = [
      { name: 'Internet Packages', icon: '🌐', type: 'SERVICE' },
      { name: 'Repair Services', icon: '🔧', type: 'SERVICE' },
      { name: 'Consulting', icon: '💼', type: 'SERVICE' },
      { name: 'Custom Orders', icon: '✨', type: 'SERVICE' },
    ];

    const serviceCategoryMap: Record<string, string> = {};
    for (const cat of serviceCategories) {
      const existing = await db.category.findUnique({ where: { name: cat.name } });
      if (existing) {
        serviceCategoryMap[cat.name] = existing.id;
        continue;
      }
      const created = await db.category.create({ data: cat });
      serviceCategoryMap[cat.name] = created.id;
    }
    results.serviceCategories = { status: 'ready', count: Object.keys(serviceCategoryMap).length };

    // ── Products ────────────────────────────────────────────
    const productsData = [
      {
        title: 'MacBook Pro 16" M3 Max',
        description: 'Apple MacBook Pro 16-inch with M3 Max chip, 36GB RAM, 1TB SSD. Perfect for professionals and creators. Includes original charger and box.',
        price: 450000,
        priceUSD: 1620,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Laptops'],
        condition: 'NEW',
        sellerId: adminId,
      },
      {
        title: 'iPhone 15 Pro Max 256GB',
        description: 'Brand new iPhone 15 Pro Max with Natural Titanium finish. 256GB storage, A17 Pro chip, 48MP camera system. Factory sealed with Apple warranty.',
        price: 520000,
        priceUSD: 1870,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Mobile Phones'],
        condition: 'NEW',
        sellerId: adminId,
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Samsung Galaxy S24 Ultra 512GB in Titanium Black. S Pen included, 200MP camera, Snapdragon 8 Gen 3. Unlocked for all carriers.',
        price: 380000,
        priceUSD: 1368,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Mobile Phones'],
        condition: 'NEW',
        sellerId: user1Id,
      },
      {
        title: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise canceling wireless headphones. 30-hour battery, multipoint connection, speak-to-chat. Premium comfort with soft fit leather.',
        price: 65000,
        priceUSD: 234,
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Audio'],
        condition: 'NEW',
        sellerId: adminId,
      },
      {
        title: 'PlayStation 5 Console',
        description: 'PS5 console with DualSense controller, HDMI cable, and power cord. Includes 2 free games: Spider-Man 2 and God of War Ragnarok.',
        price: 135000,
        priceUSD: 486,
        image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Gaming'],
        condition: 'NEW',
        sellerId: user1Id,
      },
      {
        title: 'Canon EOS R6 Mark II',
        description: 'Full-frame mirrorless camera with 24.2MP, 4K 60fps video, in-body stabilization. Excellent for both photography and videography.',
        price: 550000,
        priceUSD: 1980,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Cameras'],
        condition: 'NEW',
        sellerId: adminId,
      },
      {
        title: 'Apple Watch Ultra 2',
        description: 'The most rugged and capable Apple Watch. 49mm titanium case, precision dual-frequency GPS, up to 36 hours of battery life.',
        price: 265000,
        priceUSD: 954,
        image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Wearables'],
        condition: 'NEW',
        sellerId: user2Id,
      },
      {
        title: 'Dell XPS 15 (Refurbished)',
        description: 'Dell XPS 15 9520, Intel i7-12700H, 16GB RAM, 512GB SSD, RTX 3050 Ti. In excellent condition with minimal wear. Comes with original box.',
        price: 220000,
        priceUSD: 792,
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Laptops'],
        condition: 'REFURBISHED',
        sellerId: user1Id,
      },
      {
        title: 'Anker 737 Power Bank 24K',
        description: '24,000mAh portable charger with 140W output. Can charge laptops, phones, and tablets. LED display shows remaining power.',
        price: 35000,
        priceUSD: 126,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Accessories'],
        condition: 'NEW',
        sellerId: user2Id,
      },
      {
        title: 'Nintendo Switch OLED',
        description: 'Nintendo Switch OLED Model with white Joy-Con. 7-inch OLED screen, 64GB storage, enhanced audio. Includes dock and all accessories.',
        price: 85000,
        priceUSD: 306,
        image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=600&fit=crop',
        ]),
        categoryId: categoryMap['Gaming'],
        condition: 'NEW',
        sellerId: adminId,
      },
    ];

    const createdProducts: string[] = [];
    for (const pData of productsData) {
      const existing = await db.product.findFirst({
        where: { title: pData.title, sellerId: pData.sellerId },
      });
      if (existing) {
        createdProducts.push(existing.id);
        continue;
      }
      const product = await db.product.create({ data: pData });
      createdProducts.push(product.id);
    }
    results.products = { status: 'ready', count: createdProducts.length };

    // ── Services ────────────────────────────────────────────
    const servicesData = [
      {
        title: 'PTCL Fiber 100Mbps Internet',
        description: 'High-speed PTCL Fiber internet connection with 100Mbps download speed. Unlimited data, free router installation, 24/7 customer support. Perfect for streaming, gaming, and remote work.',
        price: 4500,
        priceUSD: 16,
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=600&fit=crop',
        categoryId: serviceCategoryMap['Internet Packages'],
        serviceType: 'INTERNET',
        speed: '100Mbps',
        connectionType: 'FIBER',
        provider: 'PTCL',
        contact: '0800-88088',
        sellerId: adminId,
      },
      {
        title: 'PTCL Broadband 25Mbps',
        description: 'Affordable PTCL Broadband internet with 25Mbps speed. Unlimited monthly data quota. Ideal for browsing, social media, and light streaming. Free WiFi router included.',
        price: 2500,
        priceUSD: 9,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=600&fit=crop',
        categoryId: serviceCategoryMap['Internet Packages'],
        serviceType: 'INTERNET',
        speed: '25Mbps',
        connectionType: 'BROADBAND',
        provider: 'PTCL',
        contact: '0800-88088',
        sellerId: adminId,
      },
      {
        title: 'Laptop & PC Repair Service',
        description: 'Professional repair service for laptops and desktop computers. Hardware repair, OS installation, virus removal, SSD upgrade, RAM upgrade, and screen replacement. All brands supported.',
        price: 2000,
        priceUSD: 7,
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop',
        categoryId: serviceCategoryMap['Repair Services'],
        serviceType: 'GENERAL',
        contact: '+92 300 1234567',
        sellerId: user1Id,
      },
      {
        title: 'IT Consulting & Setup',
        description: 'Expert IT consulting for businesses and individuals. Network setup, server configuration, cybersecurity assessment, cloud migration, and tech strategy planning. Free initial consultation.',
        price: 10000,
        priceUSD: 36,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop',
        categoryId: serviceCategoryMap['Consulting'],
        serviceType: 'GENERAL',
        contact: 'admin@zjtech.com',
        sellerId: adminId,
      },
    ];

    const createdServices: string[] = [];
    for (const sData of servicesData) {
      const existing = await db.service.findFirst({
        where: { title: sData.title, sellerId: sData.sellerId },
      });
      if (existing) {
        createdServices.push(existing.id);
        continue;
      }
      const service = await db.service.create({ data: sData });
      createdServices.push(service.id);
    }
    results.services = { status: 'ready', count: createdServices.length };

    // ── Sample Orders ───────────────────────────────────────
    // Only create orders if products exist and are ACTIVE
    const activeProducts = await db.product.findMany({
      where: { status: 'ACTIVE', id: { in: createdProducts } },
      take: 2,
    });

    let ordersCreated = 0;
    if (activeProducts.length >= 2 && user2Id) {
      for (let i = 0; i < 2 && i < activeProducts.length; i++) {
        const product = activeProducts[i];
        const existingOrder = await db.order.findFirst({
          where: { buyerId: user2Id, productId: product.id },
        });
        if (existingOrder) {
          ordersCreated++;
          continue;
        }

        await db.order.create({
          data: {
            buyerId: user2Id,
            productId: product.id,
            quantity: 1,
            total: product.price,
            totalUSD: product.priceUSD,
            status: 'DELIVERED',
          },
        });
        ordersCreated++;
      }

      // Mark ordered products as SOLD
      for (let i = 0; i < 2 && i < activeProducts.length; i++) {
        await db.product.update({
          where: { id: activeProducts[i].id },
          data: { status: 'SOLD' },
        });
      }
    }
    results.orders = { status: ordersCreated >= 2 ? 'ready' : 'partial', count: ordersCreated };

    return NextResponse.json({
      message: 'Database seeded successfully',
      results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Seeding failed';
    console.error('Seed error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userCount = await db.user.count();
    const productCount = await db.product.count({ where: { status: 'ACTIVE' } });
    const serviceCount = await db.service.count({ where: { status: 'ACTIVE' } });
    const categoryCount = await db.category.count();
    const orderCount = await db.order.count();

    return NextResponse.json({
      seeded: userCount > 0,
      counts: {
        users: userCount,
        activeProducts: productCount,
        activeServices: serviceCount,
        categories: categoryCount,
        orders: orderCount,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to check seed status' }, { status: 500 });
  }
}
