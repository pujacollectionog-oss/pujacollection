import { PrismaClient } from '@prisma/client';
import { mockProducts } from '../lib/mock/products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Puja Collection Database...');

  // 1. Seed Products
  for (const prod of mockProducts) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        garmentType: prod.garmentType,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug,
        description: prod.description,
        fabricDetails: prod.fabricDetails,
        fabricType: prod.fabricType,
        craftDetails: prod.craftDetails,
        weaveTechnique: prod.weaveTechnique,
        careInstructions: prod.careInstructions,
        silkMarkCertified: prod.silkMarkCertified,
        handloomCertified: prod.handloomCertified,
        occasion: prod.occasion,
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice,
        isCustomizable: false,
        customizationFee: 0,
        isFeatured: prod.isFeatured,
        badge: prod.badge,
        tags: prod.tags.join(', '),
      },
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        garmentType: prod.garmentType,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug,
        description: prod.description,
        fabricDetails: prod.fabricDetails,
        fabricType: prod.fabricType,
        craftDetails: prod.craftDetails,
        weaveTechnique: prod.weaveTechnique,
        careInstructions: prod.careInstructions,
        silkMarkCertified: prod.silkMarkCertified,
        handloomCertified: prod.handloomCertified,
        occasion: prod.occasion,
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice,
        isCustomizable: false,
        customizationFee: 0,
        isFeatured: prod.isFeatured,
        badge: prod.badge,
        tags: prod.tags.join(', '),
        images: {
          create: prod.images.map((img) => ({
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary ?? false,
            macroZoomUrl: img.macroZoomUrl,
          })),
        },
        variants: {
          create: prod.variants.map((v) => ({
            id: v.id,
            title: v.title,
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex,
            stockQuantity: v.stockQuantity,
          })),
        },
      },
    });
  }

  // 2. Seed Sample VIP Orders
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

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
