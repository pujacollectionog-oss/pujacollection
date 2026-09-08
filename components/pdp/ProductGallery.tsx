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

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 items-start">
      {/* Thumbnails Row / Column */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 w-full lg:w-20 flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={img.url + idx}
            onClick={() => setSelectedIdx(idx)}
            aria-label={`View image ${idx + 1}`}
            className={[
              'relative w-16 h-20 lg:w-20 lg:h-24 rounded-xl overflow-hidden bg-[#f4f4f1] border-2 transition-all flex-shrink-0 cursor-pointer',
              selectedIdx === idx
                ? 'border-[#a00041] shadow-md scale-105'
                : 'border-transparent hover:border-[rgba(115,92,0,0.3)] opacity-70 hover:opacity-100',
            ].join(' ')}
          >
            <Image
              src={img.url}
              alt={img.altText || `${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image with 4K Macro Zoom */}
      <div className="flex-1 w-full space-y-4">
        <MacroZoomInspector
          imageUrl={activeImage.url}
          macroZoomUrl={activeImage.macroZoomUrl}
          altText={activeImage.altText || productName}
        />

        {/* Authenticity Certifications */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(180,83,9,0.08)] border border-[rgba(180,83,9,0.25)]">
            <span className="text-sm">🔄</span>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-bold text-[#b45309]">7-Day Exchange</span>
              <span className="text-[9px] text-[#64748b]">Hassle-Free Doorstep Exchange</span>
            </div>
          </div>

          {handloomCertified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(5,88,88,0.06)] border border-[rgba(5,88,88,0.25)]">
              <span className="text-sm">🧶</span>
              <div className="flex flex-col">
                <span className="font-sans text-[11px] font-bold text-[#055858]">Authentic Handloom</span>
                <span className="text-[9px] text-[#8e6f74]">Master Weaver Heritage</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
