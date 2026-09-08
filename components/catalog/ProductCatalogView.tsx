'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import type { MockProduct } from '@/lib/mock/products';

interface ProductCatalogViewProps {
  initialProducts: MockProduct[];
  categorySlug: string;
}

export function ProductCatalogView({ initialProducts, categorySlug }: ProductCatalogViewProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const { products, syncWithServer } = useProductStore();

  useEffect(() => {
    setHasMounted(true);
    syncWithServer();
  }, [syncWithServer]);

  const activeProducts = useMemo(() => {
    const list = products && products.length > 0 ? products : initialProducts;
    if (categorySlug === 'collections') return list;
    return list.filter(
      (p) =>
        p.categorySlug === categorySlug ||
        p.garmentType?.toLowerCase() === categorySlug.toLowerCase()
    );
  }, [products, categorySlug, initialProducts]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    return [...activeProducts].sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'newest') return (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [activeProducts, sortBy]);

  return (
    <div className="container-luxury py-10">
      {/* Top Header & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(226,190,194,0.4)] mb-8">
        <div>
          <p className="font-sans text-xs text-[#5a4044] tracking-wide">
            Showing <strong className="text-[#1a1c1b]">{sortedProducts.length}</strong> handcrafted pieces
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="font-sans text-xs font-semibold text-[#735c00] whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[rgba(115,92,0,0.3)] text-[#1a1c1b] focus:border-[#a00041] outline-none cursor-pointer shadow-xs"
          >
            <option value="featured">Featured Collection</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      {/* Full-Width Product Grid */}
      <main className="w-full">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(226,190,194,0.4)]">
            <span className="text-4xl block mb-3">🛍️</span>
            <h3 className="font-display text-xl font-bold text-[#1a1c1b] mb-2">No garments found</h3>
            <p className="font-sans text-sm text-[#5a4044]">
              Try adjusting your category or check back soon for our newest handwoven arrivals.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
