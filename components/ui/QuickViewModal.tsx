'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import type { MockProduct } from '@/lib/mock/products';
import { Button } from './Button';

interface QuickViewModalProps {
  product: MockProduct | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem, openCart } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      setSelectedVariantId(product.variants[0]?.id ?? '');
    }
  }, [product]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  if (!product) return null;

  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: product.basePrice,
      image: primaryImage?.url ?? '',
      quantity: 1,
      size: selectedVariant?.size,
      colorName: selectedVariant?.colorName,
      isCustomTailored: false,
    });
    openCart();
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="modal-backdrop animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="glass-panel rounded-2xl overflow-hidden w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in-up"
        style={{ animationDelay: '0.05s' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[420px] bg-[#f4f4f1]">
            <Image
              src={primaryImage?.url ?? '/images/hero-lehenga.jpg'}
              alt={primaryImage?.altText ?? product.name}
              fill
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 label-sm bg-[#c81857] text-white px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col gap-4">
            {/* Close */}
            <div className="flex justify-between items-start">
              <span className="label-sm text-[#055858]">
                {product.garmentType.replace(/_/g, ' ').replace('AND', '&')}
              </span>
              <button
                onClick={onClose}
                aria-label="Close quick view"
                className="text-[#5a4044] hover:text-[#a00041] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <h2 className="headline-sm text-[#1a1c1b]">{product.name}</h2>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-semibold text-[#a00041] font-sans">
                {formatPrice(product.basePrice)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-[#8e6f74] line-through font-sans">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-[#5a4044] leading-relaxed font-sans line-clamp-3">
              {product.description}
            </p>

            {/* Fabric */}
            <div className="text-xs text-[#5a4044] font-sans border-t border-[rgba(226,190,194,0.4)] pt-3">
              <span className="font-semibold text-[#735c00]">Fabric: </span>
              {product.fabricDetails}
            </div>

            {/* Variant selector */}
            {product.variants.length > 1 && (
              <div>
                <p className="label-sm text-[#1a1c1b] mb-2">
                  {product.variants[0]?.size ? 'Select Size' : 'Select Option'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={[
                        'px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all',
                        selectedVariantId === v.id
                          ? 'bg-[#c81857] text-white border-[#c81857]'
                          : 'bg-transparent text-[#1a1c1b] border-[rgba(226,190,194,0.6)] hover:border-[#a00041]',
                      ].join(' ')}
                    >
                      {v.size ?? v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            <p className="text-xs text-center text-[#8e6f74] font-sans">
              🚚 Free doorstep delivery all over Nepal in 4–5 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
