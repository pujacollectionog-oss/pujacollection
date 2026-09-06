'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '../ui/ProductCard';
import { useProductStore } from '@/store/useProductStore';
import { mockProducts } from '@/lib/mock/products';

export function SignaturePiecesTabs() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('bestsellers');
  const { products, syncWithServer } = useProductStore();

  useEffect(() => {
    setHasMounted(true);
    syncWithServer();
  }, [syncWithServer]);

  const activeProductList = hasMounted ? products : mockProducts;

  const bestsellers = activeProductList.filter((p) => p.badge === 'Bestseller');
  const newArrivals = activeProductList.filter((p) => p.badge === 'New');
  const featured = activeProductList.filter((p) => p.isFeatured).slice(0, 4);

  const getTabProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return bestsellers.length > 0 ? bestsellers : activeProductList.slice(0, 4);
      case 'new-arrivals':
        return newArrivals.length > 0 ? newArrivals : activeProductList.slice(0, 4);
      case 'trending':
        return featured.length > 0 ? featured : activeProductList.slice(0, 4);
      case 'all':
      default:
        return activeProductList.slice(0, 8);
    }
  };

  const currentProducts = getTabProducts();

  const TABS = [
    { id: 'bestsellers', label: 'Bestsellers' },
    { id: 'new-arrivals', label: 'New Arrivals', count: newArrivals.length },
    { id: 'trending', label: 'Trending' },
    { id: 'all', label: 'All Pieces' },
  ];

  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="signature-heading"
    >
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <span className="label-sm text-[#be123c] block mb-1 font-bold tracking-widest">
              Exclusive Showcase
            </span>
            <h2 id="signature-heading" className="headline-lg text-[#0f172a]">
              Signature Pieces
            </h2>
          </div>

          {/* Tab Pills - smooth edge-to-edge scroll on mobile */}
          <div
            className="flex gap-1.5 bg-[#f4f4f1] p-1.5 rounded-2xl overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-1.5"
            role="tablist"
            aria-label="Product collections"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'relative px-3.5 sm:px-4 py-2 rounded-xl font-sans text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0',
                  activeTab === tab.id
                    ? 'bg-[#be123c] text-white shadow-sm'
                    : 'text-[#5a4044] hover:text-[#1a1c1b]',
                ].join(' ')}
              >
                {tab.label}
                {tab.id === 'new-arrivals' && tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-[#e9c349] text-[#1a1c1b] text-[9px] font-bold rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {currentProducts.length > 0 ? (
            currentProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <ProductCard
                  product={product}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="font-display text-lg text-[#8e6f74]">
                Curating the finest pieces for you…
              </p>
            </div>
          )}
        </div>

        {/* View more */}
        <div className="mt-10 text-center">
          <a
            href="/collections"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#a00041] hover:text-[#c81857] transition-colors border-b border-[rgba(160,0,65,0.3)] pb-0.5"
          >
            View Full Collection
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
