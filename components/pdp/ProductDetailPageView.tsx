'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { CraftsmanshipAccordion } from '@/components/pdp/CraftsmanshipAccordion';
import { DeliveryWidget } from '@/components/pdp/DeliveryWidget';
import { ProductReviewsSection } from '@/components/pdp/ProductReviewsSection';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductPurchaseClient } from '@/app/product/[slug]/ProductPurchaseClient';
import type { MockProduct } from '@/lib/mock/products';

interface ProductDetailPageViewProps {
  initialProduct?: MockProduct | null;
  slug: string;
}

export function ProductDetailPageView({ initialProduct, slug }: ProductDetailPageViewProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const { getProductBySlug, products } = useProductStore();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Determine active product
  const product = initialProduct || (hasMounted ? getProductBySlug(slug) : null);

  // If initialProduct is missing and client has not mounted yet, render matching loading skeleton
  if (!initialProduct && !hasMounted) {
    return (
      <div className="bg-[#f9f9f6] min-h-screen py-8 md:py-12 animate-pulse">
        <div className="container-luxury space-y-6">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7 h-[500px] bg-slate-200 rounded-3xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
              <div className="h-6 w-1/3 bg-slate-200 rounded-lg" />
              <div className="h-24 bg-slate-200 rounded-2xl" />
              <div className="h-12 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If after mounting, product still cannot be found anywhere
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container-luxury text-center py-20">
        <span className="text-5xl block mb-4">👗</span>
        <h1 className="font-display text-2xl font-bold text-[#0f172a] mb-2">
          Ensemble Not Found
        </h1>
        <p className="font-sans text-sm text-slate-500 max-w-md mb-6">
          The artisanal piece you are looking for may have been archived or moved. Explore our latest handwoven collections below.
        </p>
        <Link
          href="/collections"
          className="px-6 py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#be123c] text-white hover:bg-[#9f1239] transition-all shadow-md"
        >
          Explore All Collections →
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="bg-[#f9f9f6] min-h-screen py-4 sm:py-8 md:py-12 animate-fade-in">
      <div className="container-luxury">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-1.5 font-sans text-[11px] sm:text-xs text-[#8e6f74] flex-wrap">
            <li>
              <Link href="/" className="hover:text-[#a00041] transition-colors whitespace-nowrap">Home</Link>
            </li>
            <li className="text-slate-300">/</li>
            <li>
              <Link href={`/${product.categorySlug}`} className="hover:text-[#a00041] transition-colors capitalize whitespace-nowrap">
                {product.categorySlug.replace('-', ' ')}
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li className="font-semibold text-[#1a1c1b] truncate max-w-[160px] sm:max-w-md" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
          {/* Left: Gallery with 4K Macro Zoom (7 cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              productName={product.name}
              silkMarkCertified={product.silkMarkCertified}
              handloomCertified={product.handloomCertified}
            />
          </div>

          {/* Right: Purchase Details & Order Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ProductPurchaseClient product={product} />

            {/* Delivery All Over Nepal Widget */}
            <DeliveryWidget />

            {/* Craftsmanship Accordion */}
            <CraftsmanshipAccordion product={product} />
          </div>
        </div>

        {/* Product Reviews Section */}
        <ProductReviewsSection productId={product.id} productName={product.name} />

        {/* Related Products Section */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[rgba(226,190,194,0.4)]" aria-labelledby="related-heading">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="label-sm text-[#735c00] block mb-1">Complete the Look</span>
                <h2 id="related-heading" className="headline-md text-[#1a1c1b]">
                  You May Also Love
                </h2>
              </div>
              <Link
                href={`/${product.categorySlug}`}
                className="font-sans text-xs font-semibold text-[#a00041] hover:underline"
              >
                View More {product.categorySlug.replace('-', ' ')} →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
