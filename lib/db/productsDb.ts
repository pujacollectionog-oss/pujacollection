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
  await prisma.product.upsert({
    where: { slug: product.slug },
    update: {
      name: product.name,
      garmentType: product.garmentType,
      categorySlug: product.categorySlug,
      subCategorySlug: product.subCategorySlug || null,
      description: product.description,
      fabricDetails: product.fabricDetails,
      fabricType: product.fabricType,
      craftDetails: product.craftDetails,
      weaveTechnique: product.weaveTechnique || null,
      careInstructions: product.careInstructions,
      silkMarkCertified: product.silkMarkCertified,
      handloomCertified: product.handloomCertified,
      occasion: product.occasion,
      basePrice: product.basePrice,
      compareAtPrice: product.compareAtPrice || null,
      isCustomizable: product.isCustomizable,
      customizationFee: product.customizationFee,
      isFeatured: product.isFeatured,
      badge: product.badge || null,
      tags: product.tags.join(', '),
    },
    create: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      garmentType: product.garmentType,
      categorySlug: product.categorySlug,
      subCategorySlug: product.subCategorySlug || null,
      description: product.description,
      fabricDetails: product.fabricDetails,
      fabricType: product.fabricType,
      craftDetails: product.craftDetails,
      weaveTechnique: product.weaveTechnique || null,
      careInstructions: product.careInstructions,
      silkMarkCertified: product.silkMarkCertified,
      handloomCertified: product.handloomCertified,
      occasion: product.occasion,
      basePrice: product.basePrice,
      compareAtPrice: product.compareAtPrice || null,
      isCustomizable: product.isCustomizable,
      customizationFee: product.customizationFee,
      isFeatured: product.isFeatured,
      badge: product.badge || null,
      tags: product.tags.join(', '),
      images: {
        create: product.images.map((img) => ({
          url: img.url,
          altText: img.altText || product.name,
          isPrimary: img.isPrimary ?? false,
          macroZoomUrl: img.macroZoomUrl || null,
        })),
      },
      variants: {
        create: product.variants.map((v) => ({
          id: v.id,
          title: v.title,
          size: v.size || null,
          colorName: v.colorName || null,
          colorHex: v.colorHex || null,
          stockQuantity: v.stockQuantity,
        })),
      },
    },
  });

  return getAllProductsFromDb();
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
