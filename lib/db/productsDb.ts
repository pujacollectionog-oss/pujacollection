import { prisma } from '@/lib/prisma';
import type { MockProduct } from '@/lib/mock/products';

export async function getAllProductsFromDb(): Promise<MockProduct[]> {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, variants: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      garmentType: p.garmentType as any,
      categorySlug: p.categorySlug,
      subCategorySlug: p.subCategorySlug || undefined,
      description: p.description,
      fabricDetails: p.fabricDetails,
      fabricType: p.fabricType as any,
      craftDetails: p.craftDetails,
      weaveTechnique: p.weaveTechnique || undefined,
      careInstructions: p.careInstructions,
      silkMarkCertified: p.silkMarkCertified,
      handloomCertified: p.handloomCertified,
      occasion: p.occasion as any,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice || undefined,
      isCustomizable: p.isCustomizable,
      customizationFee: p.customizationFee,
      isFeatured: p.isFeatured,
      badge: p.badge || undefined,
      tags: p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [],
      images: (p.images || []).map((img: any) => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        macroZoomUrl: img.macroZoomUrl || undefined,
      })),
      variants: (p.variants || []).map((v: any) => ({
        id: v.id,
        title: v.title,
        size: v.size || undefined,
        colorName: v.colorName || undefined,
        colorHex: v.colorHex || undefined,
        stockQuantity: v.stockQuantity,
      })),
    }));
  } catch (err) {
    console.error('Error fetching products from Prisma:', err);
    return [];
  }
}

export async function getProductBySlugFromDb(slug: string): Promise<MockProduct | undefined> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { images: true, variants: true },
    });

    if (!p) return undefined;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      garmentType: p.garmentType as any,
      categorySlug: p.categorySlug,
      subCategorySlug: p.subCategorySlug || undefined,
      description: p.description,
      fabricDetails: p.fabricDetails,
      fabricType: p.fabricType as any,
      craftDetails: p.craftDetails,
      weaveTechnique: p.weaveTechnique || undefined,
      careInstructions: p.careInstructions,
      silkMarkCertified: p.silkMarkCertified,
      handloomCertified: p.handloomCertified,
      occasion: p.occasion as any,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice || undefined,
      isCustomizable: p.isCustomizable,
      customizationFee: p.customizationFee,
      isFeatured: p.isFeatured,
      badge: p.badge || undefined,
      tags: p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [],
      images: (p.images || []).map((img: any) => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        macroZoomUrl: img.macroZoomUrl || undefined,
      })),
      variants: (p.variants || []).map((v: any) => ({
        id: v.id,
        title: v.title,
        size: v.size || undefined,
        colorName: v.colorName || undefined,
        colorHex: v.colorHex || undefined,
        stockQuantity: v.stockQuantity,
      })),
    };
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return undefined;
  }
}

export async function getProductsByCategoryFromDb(categorySlug: string): Promise<MockProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: categorySlug === 'collections' ? {} : { categorySlug },
      include: { images: true, variants: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      garmentType: p.garmentType as any,
      categorySlug: p.categorySlug,
      subCategorySlug: p.subCategorySlug || undefined,
      description: p.description,
      fabricDetails: p.fabricDetails,
      fabricType: p.fabricType as any,
      craftDetails: p.craftDetails,
      weaveTechnique: p.weaveTechnique || undefined,
      careInstructions: p.careInstructions,
      silkMarkCertified: p.silkMarkCertified,
      handloomCertified: p.handloomCertified,
      occasion: p.occasion as any,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice || undefined,
      isCustomizable: p.isCustomizable,
      customizationFee: p.customizationFee,
      isFeatured: p.isFeatured,
      badge: p.badge || undefined,
      tags: p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [],
      images: (p.images || []).map((img: any) => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        macroZoomUrl: img.macroZoomUrl || undefined,
      })),
      variants: (p.variants || []).map((v: any) => ({
        id: v.id,
        title: v.title,
        size: v.size || undefined,
        colorName: v.colorName || undefined,
        colorHex: v.colorHex || undefined,
        stockQuantity: v.stockQuantity,
      })),
    }));
  } catch (err) {
    console.error('Error fetching category products:', err);
    return [];
  }
}

export async function addProductToDb(product: MockProduct): Promise<MockProduct[]> {
  try {
    const rawSlug =
      product.slug ||
      product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const safeSlug = rawSlug || `prod-${Date.now()}`;
    const safeTags = Array.isArray(product.tags)
      ? product.tags.join(', ')
      : typeof product.tags === 'string'
      ? product.tags
      : '';
    const safeImages =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [{ url: '/images/hero-lehenga.jpg', altText: product.name, isPrimary: true }];
    const safeVariants =
      Array.isArray(product.variants) && product.variants.length > 0
        ? product.variants
        : [{ id: `v-${Date.now()}`, title: 'Standard', size: 'Standard', stockQuantity: 5 }];

    // Check if product with this slug or id exists
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug: safeSlug }, product.id ? { id: product.id } : {}],
      },
      include: { images: true, variants: true },
    });

    if (existing) {
      // Clean up old relations before re-creating
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });

      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: product.name,
          garmentType: product.garmentType || 'SAREE',
          categorySlug: product.categorySlug || 'sarees',
          subCategorySlug: product.subCategorySlug || null,
          description: product.description || 'Authentic luxury Indian ethnic wear.',
          fabricDetails: product.fabricDetails || 'Pure Silk',
          fabricType: product.fabricType || 'Pure Katan Silk',
          craftDetails: product.craftDetails || 'Handcrafted traditional artisan weave.',
          weaveTechnique: product.weaveTechnique || null,
          careInstructions: product.careInstructions || 'Dry Clean Only',
          silkMarkCertified: Boolean(product.silkMarkCertified),
          handloomCertified: Boolean(product.handloomCertified),
          occasion: product.occasion || 'Bridal',
          basePrice: Math.max(0, Number(product.basePrice) || 0),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          isCustomizable: Boolean(product.isCustomizable),
          customizationFee: Number(product.customizationFee) || 0,
          isFeatured: Boolean(product.isFeatured ?? true),
          badge: product.badge || null,
          tags: safeTags,
          images: {
            create: safeImages.map((img) => ({
              url: img.url,
              altText: img.altText || product.name,
              isPrimary: Boolean(img.isPrimary),
              macroZoomUrl: img.macroZoomUrl || null,
            })),
          },
          variants: {
            create: safeVariants.map((v) => ({
              title: v.title || v.size || 'Standard',
              size: v.size || null,
              colorName: v.colorName || null,
              colorHex: v.colorHex || null,
              stockQuantity: Math.max(0, Number(v.stockQuantity) || 0),
            })),
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: product.name,
          slug: safeSlug,
          garmentType: product.garmentType || 'SAREE',
          categorySlug: product.categorySlug || 'sarees',
          subCategorySlug: product.subCategorySlug || null,
          description: product.description || 'Authentic luxury Indian ethnic wear.',
          fabricDetails: product.fabricDetails || 'Pure Silk',
          fabricType: product.fabricType || 'Pure Katan Silk',
          craftDetails: product.craftDetails || 'Handcrafted traditional artisan weave.',
          weaveTechnique: product.weaveTechnique || null,
          careInstructions: product.careInstructions || 'Dry Clean Only',
          silkMarkCertified: Boolean(product.silkMarkCertified),
          handloomCertified: Boolean(product.handloomCertified),
          occasion: product.occasion || 'Bridal',
          basePrice: Math.max(0, Number(product.basePrice) || 0),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          isCustomizable: Boolean(product.isCustomizable),
          customizationFee: Number(product.customizationFee) || 0,
          isFeatured: Boolean(product.isFeatured ?? true),
          badge: product.badge || null,
          tags: safeTags,
          images: {
            create: safeImages.map((img) => ({
              url: img.url,
              altText: img.altText || product.name,
              isPrimary: Boolean(img.isPrimary),
              macroZoomUrl: img.macroZoomUrl || null,
            })),
          },
          variants: {
            create: safeVariants.map((v) => ({
              title: v.title || v.size || 'Standard',
              size: v.size || null,
              colorName: v.colorName || null,
              colorHex: v.colorHex || null,
              stockQuantity: Math.max(0, Number(v.stockQuantity) || 0),
            })),
          },
        },
      });
    }

    return getAllProductsFromDb();
  } catch (err) {
    console.error('CRITICAL: addProductToDb database error:', err);
    throw err;
  }
}

export async function deleteProductFromDb(id: string): Promise<MockProduct[]> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch {}
  return getAllProductsFromDb();
}

export async function updateStockInDb(productId: string, delta: number): Promise<MockProduct[]> {
  try {
    const variants = await prisma.productVariant.findMany({ where: { productId } });
    for (const v of variants) {
      await prisma.productVariant.update({
        where: { id: v.id },
        data: { stockQuantity: Math.max(0, v.stockQuantity + delta) },
      });
    }
  } catch {}
  return getAllProductsFromDb();
}
