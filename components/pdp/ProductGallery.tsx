'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MacroZoomInspector } from './MacroZoomInspector';
import type { ProductImageItem } from '@/lib/mock/products';

interface ProductGalleryProps {
  images: ProductImageItem[];
  productName: string;
  silkMarkCertified: boolean;
  handloomCertified: boolean;
}

export function ProductGallery({
  images,
  productName,
  silkMarkCertified,
  handloomCertified,
}: ProductGalleryProps) {
  const initialIdx = Math.max(
    0,
    images.findIndex((img) => img.isPrimary)
  );
  const [selectedIdx, setSelectedIdx] = useState(initialIdx !== -1 ? initialIdx : 0);
  const activeImage = images[selectedIdx] ?? images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
      {/* Thumbnails: Desktop Left Column (lg:order-1) / Mobile Below Hero (order-2) */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto pb-1 lg:pb-0 w-full lg:w-20 flex-shrink-0 scrollbar-none">
        {images.map((img, idx) => (
          <button
            key={img.url + idx}
            onClick={() => setSelectedIdx(idx)}
            aria-label={`View image ${idx + 1}`}
            className={[
              'relative w-14 h-18 sm:w-16 sm:h-20 lg:w-20 lg:h-24 rounded-xl overflow-hidden bg-[#f4f4f1] border-2 transition-all flex-shrink-0 cursor-pointer',
              selectedIdx === idx
                ? 'border-[#a00041] shadow-md ring-2 ring-[#a00041]/20 scale-102'
                : 'border-slate-200 hover:border-[rgba(115,92,0,0.4)] opacity-75 hover:opacity-100',
            ].join(' ')}
          >
            <Image
              src={img.url}
              alt={img.altText || `${productName} thumbnail ${idx + 1}`}
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container & Certifications: Order 1 on Mobile / Order 2 on Desktop */}
      <div className="order-1 lg:order-2 flex-1 w-full space-y-3 sm:space-y-4">
        {/* Main Photo with Macro Zoom & Navigation */}
        <div className="relative group">
          <MacroZoomInspector
            imageUrl={activeImage.url}
            macroZoomUrl={activeImage.macroZoomUrl}
            altText={activeImage.altText || productName}
          />

          {/* Mobile & Tablet Next / Prev Chevrons */}
          {images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20">
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center text-sm font-bold pointer-events-auto hover:bg-[#be123c] hover:text-white transition-all cursor-pointer backdrop-blur-xs"
              >
                ‹
              </button>
              <button
                onClick={handleNext}
                aria-label="Next image"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 text-slate-800 shadow-md flex items-center justify-center text-sm font-bold pointer-events-auto hover:bg-[#be123c] hover:text-white transition-all cursor-pointer backdrop-blur-xs"
              >
                ›
              </button>
            </div>
          )}

          {/* Image Counter Badge */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-sm text-white text-[10px] font-mono font-bold tracking-wider pointer-events-none">
              {selectedIdx + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Authenticity Certifications Badges (Compact 2-col on mobile) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-[rgba(180,83,9,0.08)] border border-[rgba(180,83,9,0.22)]">
            <span className="text-base sm:text-lg flex-shrink-0">🔄</span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[11px] sm:text-xs font-bold text-[#b45309] truncate">7-Day Exchange</span>
              <span className="text-[9px] sm:text-[10px] text-[#64748b] truncate">Doorstep Exchange</span>
            </div>
          </div>

          {handloomCertified && (
            <div className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-[rgba(5,88,88,0.06)] border border-[rgba(5,88,88,0.22)]">
              <span className="text-base sm:text-lg flex-shrink-0">🧶</span>
              <div className="flex flex-col min-w-0">
                <span className="font-sans text-[11px] sm:text-xs font-bold text-[#055858] truncate">Authentic Handloom</span>
                <span className="text-[9px] sm:text-[10px] text-[#8e6f74] truncate">Master Weaver Heritage</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

