export interface ProductImageItem {
  url: string;
  altText: string;
  isPrimary?: boolean;
  macroZoomUrl?: string; // 4K close-up image for Zari & weave inspector
}

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  garmentType: 'SAREE' | 'LEHENGA' | 'KURTI_AND_SUIT' | 'DUPATTA_AND_ACCESSORIES';
  categorySlug: string;
  subCategorySlug?: string;
  description: string;
  fabricDetails: string;
  fabricType: 'Pure Katan Silk' | 'Mulberry Silk' | 'Velvet' | 'Organza' | 'Georgette' | 'Chiffon' | 'Chanderi Cotton';
  craftDetails: string;
  weaveTechnique?: string;
  careInstructions: string;
  silkMarkCertified: boolean;
  handloomCertified: boolean;
  occasion: 'Bridal' | 'Reception' | 'Sangeet & Mehendi' | 'Festive' | 'Everyday Luxury';
  basePrice: number; // NPR
  compareAtPrice?: number; // NPR
  isCustomizable: boolean;
  customizationFee: number;
  isFeatured: boolean;
  badge?: string; // e.g. "New", "Bestseller", "Heritage"
  images: ProductImageItem[];
  variants: {
    id: string;
    title: string;
    colorName?: string;
    colorHex?: string;
    size?: string;
    stockQuantity: number;
  }[];
  tags: string[];
}

export const mockProducts: MockProduct[] = [];

// Live Server-Side In-Memory Product State
export let liveProducts: MockProduct[] = [];

export const addProductToStore = (product: MockProduct) => {
  liveProducts = [product, ...liveProducts.filter((p) => p.id !== product.id)];
  return liveProducts;
};

export const deleteProductFromStore = (id: string) => {
  liveProducts = liveProducts.filter((p) => p.id !== id);
  return liveProducts;
};

export const updateStockInStore = (productId: string, delta: number) => {
  liveProducts = liveProducts.map((p) => {
    if (p.id !== productId) return p;
    const updatedVariants = p.variants.map((v) => ({
      ...v,
      stockQuantity: Math.max(0, v.stockQuantity + delta),
    }));
    return { ...p, variants: updatedVariants };
  });
  return liveProducts;
};

// Helper Query Functions
export const getAllProducts = () => liveProducts;
export const getFeaturedProducts = () => liveProducts.filter((p) => p.isFeatured);
export const getProductBySlug = (slug: string) => liveProducts.find((p) => p.slug === slug);
export const getProductsByCategory = (categorySlug: string) =>
  categorySlug === 'collections'
    ? liveProducts
    : liveProducts.filter((p) => p.categorySlug === categorySlug);
export const getNewArrivals = () => liveProducts.filter((p) => p.badge === 'New');
export const getBestsellers = () => liveProducts.filter((p) => p.badge === 'Bestseller');
export const getRelatedProducts = (currentSlug: string, categorySlug: string) =>
  liveProducts.filter((p) => p.categorySlug === categorySlug && p.slug !== currentSlug).slice(0, 4);
