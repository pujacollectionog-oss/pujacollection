'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import type { MockProduct } from '@/lib/mock/products';

interface ProductCardProps {
  product: MockProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { openCart, addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const wishlisted = isWishlisted(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: '/images/hero-lehenga.jpg', altText: product.name, isPrimary: true }];
  
  const currentImage = images[activeImageIdx] || images[0];
  const defaultVariant = product.variants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variantId: defaultVariant?.id,
      name: product.name,
      price: product.basePrice,
      image: currentImage?.url ?? '',
      quantity: 1,
      maxStock: defaultVariant?.stockQuantity ?? 5,
      size: defaultVariant?.size,
      colorName: defaultVariant?.colorName,
      isCustomTailored: false,
    });
    openCart();
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      variantId: defaultVariant?.id,
      name: product.name,
      price: product.basePrice,
      image: currentImage?.url ?? '',
      quantity: 1,
      maxStock: defaultVariant?.stockQuantity ?? 5,
      size: defaultVariant?.size,
      colorName: defaultVariant?.colorName,
      isCustomTailored: false,
    });
    router.push('/checkout');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const savings = product.compareAtPrice
    ? product.compareAtPrice - product.basePrice
    : null;
  const discountPct = savings
    ? Math.round((savings / product.compareAtPrice!) * 100)
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card group relative flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-amber-200"
      aria-label={`View ${product.name}`}
    >
      {/* Image Gallery Container */}
      <div className="product-card-image relative aspect-[3/4] bg-[#f8fafc] overflow-hidden">
        <Image
          src={currentImage?.url ?? '/images/hero-lehenga.jpg'}
          alt={currentImage?.altText ?? product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Multi-Image Next / Prev Chevrons */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-1.5 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="w-7 h-7 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center text-xs font-bold pointer-events-auto hover:bg-[#be123c] hover:text-white transition-colors cursor-pointer"
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next photo"
              className="w-7 h-7 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center text-xs font-bold pointer-events-auto hover:bg-[#be123c] hover:text-white transition-colors cursor-pointer"
            >
              ›
            </button>
          </div>
        )}

        {/* Multi-Image Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1 z-10 pointer-events-auto">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIdx(dotIdx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeImageIdx === dotIdx
                    ? 'w-4 bg-[#be123c] shadow-sm'
                    : 'w-1.5 bg-white/70 hover:bg-white'
                }`}
                title={`View photo ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-[#be123c] text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full z-10 shadow-sm">
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discountPct && (
          <span className="absolute top-2.5 right-11 sm:right-12 text-[9px] sm:text-[10px] font-bold uppercase bg-[#b45309] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full z-10 shadow-sm">
            -{discountPct}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm transition-all duration-200 hover:scale-110"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wishlisted ? '#be123c' : 'none'}
            stroke={wishlisted ? '#be123c' : '#0f766e'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-4 sm:h-4"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Buy Now + Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 bg-gradient-to-t from-black/75 via-black/40 to-transparent pt-6">
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={handleBuyNow}
              className="flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#b45309] text-white rounded-lg sm:rounded-xl hover:bg-[#92400e] transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>⚡</span>
              <span>Buy</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#be123c] text-white rounded-lg sm:rounded-xl hover:bg-[#9f1239] transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>+ Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4 justify-between">
        <div>
          {/* Fabric / Type */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#5a4044] mb-1">
            <span className="capitalize">{product.categorySlug.replace('-', ' ')}</span>
            {images.length > 1 && (
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
                📷 {images.length}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-display text-xs sm:text-sm font-semibold text-[#1a1c1b] group-hover:text-[#be123c] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Fabric notes */}
          <p className="font-sans text-[10px] sm:text-[11px] text-[#8e6f74] mt-0.5 sm:mt-1 line-clamp-1">
            {product.fabricDetails}
          </p>
        </div>

        {/* Pricing & Free Delivery tag */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-100 flex flex-wrap items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="font-mono text-xs sm:text-sm font-bold text-[#be123c]">
              {formatPrice(product.basePrice)}
            </span>
            {product.compareAtPrice && (
              <span className="font-mono text-[10px] sm:text-[11px] text-[#8e6f74] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex-shrink-0">
            Free Delivery
          </span>
        </div>
      </div>
    </Link>
  );
}
