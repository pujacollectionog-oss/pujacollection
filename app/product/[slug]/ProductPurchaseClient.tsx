'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { Button } from '@/components/ui/Button';
import { SizeGuideModal } from '@/components/tailor/SizeGuideModal';
import type { MockProduct } from '@/lib/mock/products';

interface ProductPurchaseClientProps {
  product: MockProduct;
}

export function ProductPurchaseClient({ product }: ProductPurchaseClientProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { formatPrice } = useCurrencyStore();

  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const availableStock = selectedVariant?.stockQuantity ?? 5;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: product.basePrice,
      image: primaryImage?.url || '/images/hero-lehenga.jpg',
      quantity,
      maxStock: availableStock,
      size: selectedVariant?.size,
      colorName: selectedVariant?.colorName,
      isCustomTailored: false,
    });
    openCart();
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: product.basePrice,
      image: primaryImage?.url || '/images/hero-lehenga.jpg',
      quantity,
      maxStock: availableStock,
      size: selectedVariant?.size,
      colorName: selectedVariant?.colorName,
      isCustomTailored: false,
    });
    router.push('/checkout');
  };

  const savings = product.compareAtPrice ? product.compareAtPrice - product.basePrice : null;
  const discountPct = savings ? Math.round((savings / product.compareAtPrice!) * 100) : null;

  return (
    <div className="space-y-6">
      {/* Category & Badge */}
      <div className="flex items-center justify-between">
        <span className="label-sm text-[#055858]">
          {product.garmentType.replace(/_/g, ' ').replace('AND', '&')}
        </span>
        {product.badge && (
          <span className="label-sm bg-[#c81857] text-white px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      {/* Title & Ratings */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1a1c1b] leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex text-[#fed65b] text-sm">★★★★★</div>
          <span className="text-xs font-sans font-semibold text-[#1a1c1b]">4.9 / 5.0</span>
          <span className="text-xs font-sans text-[#8e6f74]">(48 Verified Reviews)</span>
          <span className="text-xs text-[#8e6f74]">·</span>
          <span className="text-xs font-sans text-[#735c00]">SKU: {product.id.toUpperCase()}</span>
        </div>
      </div>

      {/* Pricing in NPR */}
      <div className="flex items-baseline gap-3.5 pb-4 border-b border-[rgba(226,190,194,0.4)]">
        <span className="font-display text-2xl md:text-3xl font-bold text-[#a00041]">
          {formatPrice(product.basePrice)}
        </span>
        {product.compareAtPrice && (
          <span className="font-sans text-sm text-[#8e6f74] line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
        {discountPct && (
          <span className="text-xs font-bold text-[#735c00] bg-[rgba(115,92,0,0.1)] px-2 py-0.5 rounded">
            Save {discountPct}% ({formatPrice(savings!)})
          </span>
        )}
      </div>

      {/* Description Excerpt */}
      <p className="font-sans text-xs md:text-sm text-[#5a4044] leading-relaxed">
        {product.description}
      </p>

      {/* Size / Option Selector & Size Guide Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#1a1c1b]">
            {product.variants[0]?.size ? 'Select Standard Size' : 'Select Option'}
          </span>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="text-xs text-[#a00041] font-bold hover:underline flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[rgba(160,0,65,0.06)] border border-[rgba(160,0,65,0.2)] transition-all hover:bg-[rgba(160,0,65,0.12)] cursor-pointer"
          >
            <span>📐</span>
            <span>Size Guide &amp; Chart</span>
          </button>
        </div>

        {product.variants.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const isSizeOutOfStock = v.stockQuantity <= 0;
                const isLow = v.stockQuantity > 0 && v.stockQuantity <= 3;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(v.id);
                      setQuantity(1);
                    }}
                    className={[
                      'px-4 py-2.5 text-xs rounded-xl border transition-all cursor-pointer flex items-center gap-1.5',
                      isSelected
                        ? 'bg-[#c81857] text-white border-[#c81857] shadow-sm font-bold'
                        : isSizeOutOfStock
                        ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        : 'bg-white text-[#1a1c1b] border-[rgba(226,190,194,0.6)] hover:border-[#a00041] font-semibold',
                    ].join(' ')}
                  >
                    <span>{v.size || v.title}</span>
                    {isLow && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.stockQuantity} left
                      </span>
                    )}
                    {isSizeOutOfStock && (
                      <span className="text-[9px] text-rose-500 font-bold ml-0.5">Sold out</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Size Stock Indicator */}
            {selectedVariant && (
              <div className="text-[11px] font-sans flex items-center gap-1.5 pt-0.5">
                {selectedVariant.stockQuantity > 3 ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    In Stock in {selectedVariant.size || selectedVariant.title} ({selectedVariant.stockQuantity} pieces available for immediate dispatch)
                  </span>
                ) : selectedVariant.stockQuantity > 0 ? (
                  <span className="text-amber-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                    Hurry! Only {selectedVariant.stockQuantity} left in {selectedVariant.size || selectedVariant.title}
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    Currently Sold Out in {selectedVariant.size || selectedVariant.title}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons: Quantity, Add to Bag & Buy Now */}
      <div className="space-y-3 pt-2">
        {isOutOfStock ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center font-sans text-xs font-bold">
            ⚠️ Size {selectedVariant?.size || selectedVariant?.title} is currently Sold Out. Please choose another size or contact our Rangeli Atelier.
          </div>
        ) : (
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 items-stretch">
            {/* Quantity Counter */}
            <div className="flex items-center border border-[rgba(226,190,194,0.8)] rounded-xl bg-white overflow-hidden shadow-xs h-11 flex-shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 sm:w-10 h-full flex items-center justify-center text-sm font-bold text-[#5a4044] hover:bg-[#f4f4f1] cursor-pointer"
              >
                −
              </button>
              <span className="w-7 sm:w-8 text-center text-xs font-bold text-[#1a1c1b]">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                disabled={quantity >= availableStock}
                className="w-8 sm:w-10 h-full flex items-center justify-center text-sm font-bold text-[#5a4044] hover:bg-[#f4f4f1] cursor-pointer disabled:opacity-40"
              >
                +
              </button>
            </div>

            {/* Add to Shopping Bag */}
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 min-w-[105px] !text-xs sm:!text-sm !h-11 font-bold cursor-pointer !border-[#c81857] !text-[#c81857] hover:!bg-[rgba(200,24,87,0.06)]"
              onClick={handleAddToCart}
            >
              Add to Bag
            </Button>

            {/* Instant Buy Now Button */}
            <Button
              variant="primary"
              size="lg"
              className="flex-1 min-w-[105px] !text-xs sm:!text-sm !h-11 font-bold cursor-pointer !bg-[#b45309] hover:!bg-[#92400e] shadow-sm hover:shadow-md"
              onClick={handleBuyNow}
            >
              ⚡ Buy Now
            </Button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="w-11 h-11 flex items-center justify-center rounded-xl border border-[rgba(226,190,194,0.8)] bg-white hover:bg-[#f4f4f1] transition-colors cursor-pointer shadow-xs flex-shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={wishlisted ? '#c81857' : 'none'}
                stroke={wishlisted ? '#c81857' : '#055858'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
