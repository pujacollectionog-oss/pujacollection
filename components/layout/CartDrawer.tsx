'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotalNPR } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const subtotal = subtotalNPR();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={closeCart} aria-hidden="true" />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-[#f9f9f6] shadow-2xl animate-slide-in-right border-l border-[rgba(115,92,0,0.18)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(226,190,194,0.4)]">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-[#1a1c1b]">Shopping Bag</h2>
            {items.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[rgba(160,0,65,0.08)] text-[#a00041]">
                {items.reduce((a, i) => a + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(160,0,65,0.08)] text-[#5a4044] hover:text-[#a00041] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[rgba(160,0,65,0.07)] flex items-center justify-center text-[#c81857]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-[#1a1c1b]">Your bag is empty</p>
              </div>
              <Button variant="primary" onClick={closeCart} size="md">
                Explore Collection
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-[rgba(226,190,194,0.3)] last:border-0">
                {/* Image */}
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#f4f4f1] flex-shrink-0 border border-[rgba(226,190,194,0.3)]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="font-sans text-sm font-semibold text-[#1a1c1b] leading-snug">{item.name}</h3>
                  {item.size && <p className="font-sans text-xs text-[#8e6f74]">Size: {item.size}</p>}
                  {item.colorName && <p className="font-sans text-xs text-[#8e6f74]">Color: {item.colorName}</p>}
                  {item.isCustomTailored && (
                    <div className="bg-[rgba(115,92,0,0.06)] p-2 rounded-lg border border-[rgba(115,92,0,0.2)] mt-1">
                      <p className="font-sans text-[11px] text-[#735c00] font-bold">✂ Bespoke Made-to-Measure</p>
                      {item.tailoringSummary && (
                        <p className="font-sans text-[10px] text-[#5a4044] mt-0.5 leading-snug">
                          {item.tailoringSummary}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <p className="font-sans text-sm font-bold text-[#a00041]">
                      {formatPrice(item.price + (item.tailoringFee ?? 0))}
                    </p>
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[rgba(226,190,194,0.6)] rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 flex items-center justify-center text-[#5a4044] hover:bg-[rgba(160,0,65,0.06)] transition-colors text-sm font-bold"
                      >−</button>
                      <span className="w-7 text-center font-sans text-xs font-semibold text-[#1a1c1b]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                        aria-label="Increase quantity"
                        className="w-7 h-7 flex items-center justify-center text-[#5a4044] hover:bg-[rgba(160,0,65,0.06)] transition-colors text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="self-start text-[#8e6f74] hover:text-[#ba1a1a] transition-colors p-1"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="border-t border-[rgba(226,190,194,0.4)] px-6 py-5 space-y-3.5 bg-white">
            <div className="flex justify-between items-baseline">
              <span className="font-sans text-sm font-medium text-[#5a4044]">Subtotal</span>
              <span className="font-display text-xl font-bold text-[#1a1c1b]">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="block">
              <Button variant="primary" size="lg" fullWidth>
                Proceed to Checkout →
              </Button>
            </Link>
            <Button variant="secondary" size="md" fullWidth onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
