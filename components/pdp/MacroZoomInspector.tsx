'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

interface MacroZoomInspectorProps {
  imageUrl: string;
  macroZoomUrl?: string;
  altText: string;
}

export function MacroZoomInspector({
  imageUrl,
  macroZoomUrl,
  altText,
}: MacroZoomInspectorProps) {
  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const zoomImage = macroZoomUrl || imageUrl;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();

    // Mouse coordinates relative to container (in %)
    const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));

    setMousePosition({ x: x * 100, y: y * 100 });
    setLensPosition({ x: e.clientX - left, y: e.clientY - top });
  };

  return (
    <div className="relative flex flex-col gap-3 select-none">
      {/* Badge Indicator */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#735c00] bg-[rgba(115,92,0,0.08)] px-2.5 py-1 rounded-full border border-[rgba(115,92,0,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#735c00] animate-pulse" />
          4K Zari &amp; Weave Macro Inspector
        </span>
        <span className="text-[11px] font-sans text-[#8e6f74] hidden sm:inline">
          Hover image to inspect weave
        </span>
      </div>

      {/* Main Image Container */}
      <div
        ref={imageContainerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#f4f4f1] border border-[rgba(115,92,0,0.2)] cursor-crosshair shadow-md"
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Magnifier Lens Follower */}
        {isZooming && (
          <div
            className="hidden lg:block absolute pointer-events-none w-32 h-32 rounded-full border-2 border-[#fed65b] shadow-2xl bg-white/20 backdrop-contrast-125 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
            }}
          />
        )}
      </div>

      {/* High-Resolution Zoom Window (Appears to the right or overlaid on hover) */}
      {isZooming && (
        <div
          className="hidden lg:block absolute left-[103%] top-0 z-30 w-[420px] h-[480px] rounded-2xl overflow-hidden border-2 border-[rgba(115,92,0,0.3)] shadow-2xl bg-black animate-fade-in"
          style={{
            backgroundImage: `url('${zoomImage}')`,
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            backgroundSize: '350%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[10px] font-semibold text-[#fed65b] uppercase tracking-widest border border-white/10">
            3.5x Zari Magnification
          </div>
        </div>
      )}
    </div>
  );
}
