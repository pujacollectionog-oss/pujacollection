import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Puja Collection Database from data/products.json...');

  const dataPath = path.join(process.cwd(), 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // 1. Seed Products
  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        garmentType: prod.garmentType,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug || null,
        description: prod.description,
        fabricDetails: prod.fabricDetails,
        fabricType: prod.fabricType,
        craftDetails: prod.craftDetails,
        weaveTechnique: prod.weaveTechnique || null,
        careInstructions: prod.careInstructions,
        silkMarkCertified: prod.silkMarkCertified ?? false,
        handloomCertified: prod.handloomCertified ?? true,
        occasion: prod.occasion || 'Bridal',
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice || null,
        isCustomizable: false,
        customizationFee: 0,
        isFeatured: prod.isFeatured ?? false,
        badge: prod.badge || null,
        tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : (prod.tags || ''),
      },
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        garmentType: prod.garmentType,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug || null,
        description: prod.description,
        fabricDetails: prod.fabricDetails,
        fabricType: prod.fabricType,
        craftDetails: prod.craftDetails,
        weaveTechnique: prod.weaveTechnique || null,
        careInstructions: prod.careInstructions,
        silkMarkCertified: prod.silkMarkCertified ?? false,
        handloomCertified: prod.handloomCertified ?? true,
        occasion: prod.occasion || 'Bridal',
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice || null,
        isCustomizable: false,
        customizationFee: 0,
        isFeatured: prod.isFeatured ?? false,
        badge: prod.badge || null,
        tags: Array.isArray(prod.tags) ? prod.tags.join(', ') : (prod.tags || ''),
        images: {
          create: (prod.images || []).map((img) => ({
            url: img.url,
            altText: img.altText || prod.name,
            isPrimary: img.isPrimary ?? false,
            macroZoomUrl: img.macroZoomUrl || null,
          })),
        },
        variants: {
          create: (prod.variants || []).map((v) => ({
            id: v.id,
            title: v.title,
            size: v.size || null,
            colorName: v.colorName || null,
            colorHex: v.colorHex || null,
            stockQuantity: v.stockQuantity ?? 5,
          })),
        },
      },
    });
  }

  // 2. Seed Sample VIP Order
  const sampleOrder = {
    id: 'PUJA-2026-0842',
    customerName: 'Aayusha Shrestha',
    customerEmail: 'aayusha.shrestha@gmail.com',
    customerPhone: '9841234567',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    ward: '4',
    toleAndStreet: 'Baluwatar, Gairidhara Marg',
    landmark: 'Opposite Russian Embassy Gate',
    subtotalNPR: 48500,
    discountNPR: 0,
    deliveryFeeNPR: 0,
    totalAmountNPR: 48500,
    paymentMethod: 'FONEPAY',
    paymentStatus: 'PAID',
    status: 'OUT_FOR_DELIVERY',
    courierPartner: 'Pathao Express Nepal',
    consignmentId: 'PTH-KTM-2026-8891',
  };

  await prisma.order.upsert({
    where: { id: sampleOrder.id },
    update: {},
    create: {
      ...sampleOrder,
      items: {
        create: [
          {
            productId: 'p-001',
            name: 'Regal Crimson Banarasi Katan Silk Saree',
            price: 48500,
            image: '/images/bento-banarasi.jpg',
            quantity: 1,
            size: 'Free Size',
            colorName: 'Crimson Gold',
          },
        ],
      },
    },
  });

  // 3. Seed Default Coupons
  const defaultCoupons = [
    {
      code: 'BRIDAL5000',
      description: 'Flat NPR 5,000 off on Wedding & Bridal collections',
      discountType: 'FLAT_NPR',
      discountValue: 5000,
      minOrderAmount: 50000,
      usageLimit: 100,
      usedCount: 14,
      isActive: true,
    },
    {
      code: 'PUJA10',
      description: '10% off across all handloom Banarasi silks and lehengas',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 20000,
      maxDiscountNPR: 8000,
      usageLimit: 250,
      usedCount: 38,
      isActive: true,
    },
    {
      code: 'FESTIVE2026',
      description: 'Festive season celebratory discount of NPR 2,000',
      discountType: 'FLAT_NPR',
      discountValue: 2000,
      minOrderAmount: 25000,
      usageLimit: 500,
      usedCount: 62,
      isActive: true,
    },
    {
      code: 'RANGELI500',
      description: 'Welcome gift of NPR 500 for our valued patrons',
      discountType: 'FLAT_NPR',
      discountValue: 500,
      minOrderAmount: 5000,
      usageLimit: 1000,
      usedCount: 105,
      isActive: true,
    },
  ];

  for (const c of defaultCoupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  console.log('✅ Seed completed successfully in Prisma SQLite DB (Products, Orders, Coupons)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
