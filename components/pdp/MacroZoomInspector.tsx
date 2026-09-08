'use client';

import React, { useState, useRef, MouseEvent, TouchEvent } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoomLevel, setModalZoomLevel] = useState<1 | 2.5 | 4>(1);
  const [modalPan, setModalPan] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

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

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX - modalPan.x, y: e.touches[0].clientY - modalPan.y });
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStart || modalZoomLevel === 1 || e.touches.length !== 1) return;
    setModalPan({
      x: e.touches[0].clientX - touchStart.x,
      y: e.touches[0].clientY - touchStart.y,
    });
  };

  const toggleModalZoom = () => {
    setModalZoomLevel((prev) => (prev === 1 ? 2.5 : prev === 2.5 ? 4 : 1));
    if (modalZoomLevel === 4) {
      setModalPan({ x: 0, y: 0 });
    }
  };

  const openFullscreenZoom = () => {
    setIsModalOpen(true);
    setModalZoomLevel(2.5);
    setModalPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex flex-col select-none w-full max-w-full">
      {/* Main Image Container */}
      <div
        ref={imageContainerRef}
        onClick={openFullscreenZoom}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#f4f4f1] border border-slate-200 cursor-zoom-in shadow-xs"
        title="Click or tap to open full-screen 4K weave inspector"
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          unoptimized
          priority
          className="object-cover transition-transform duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Tap to Zoom Hint Icon (Mobile) */}
        <div className="lg:hidden absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
          <span>🔍</span>
          <span>Tap to 4K Zoom</span>
        </div>

        {/* Desktop Magnifier Lens Follower */}
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

      {/* Desktop High-Resolution Side Zoom Window */}
      {isZooming && (
        <div
          className="hidden lg:block absolute left-[103%] top-0 z-30 w-[440px] h-[500px] rounded-2xl overflow-hidden border-2 border-[rgba(115,92,0,0.3)] shadow-2xl bg-black animate-fade-in pointer-events-none"
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

      {/* Mobile & Fullscreen 4K Macro Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in touch-none select-none"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Top Modal Controls Header */}
          <div
            className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-black/50 backdrop-blur-xs text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🔍</span>
              <span className="text-xs font-bold font-sans tracking-wide">
                4K Zari &amp; Weave Macro Inspector
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#be123c] text-white font-bold ml-1">
                {modalZoomLevel}x
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleModalZoom}
                className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {modalZoomLevel === 4 ? 'Reset (1x)' : `Zoom ${modalZoomLevel === 1 ? '2.5x' : '4x'}`}
              </button>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close zoom viewer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Zoomable Image Viewport */}
          <div
            className="flex-1 w-full overflow-hidden flex items-center justify-center p-2 cursor-grab active:cursor-grabbing relative"
            onClick={(e) => {
              e.stopPropagation();
              toggleModalZoom();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setTouchStart(null)}
          >
            <div
              className="relative w-full h-full max-w-2xl max-h-[80vh] transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${modalZoomLevel}) translate(${modalPan.x / modalZoomLevel}px, ${modalPan.y / modalZoomLevel}px)`,
              }}
            >
              <Image
                src={zoomImage}
                alt={altText}
                fill
                unoptimized
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Bottom Hint Footer */}
          <div
            className="px-4 py-2.5 text-center text-[11px] text-white/70 bg-black/50 backdrop-blur-xs font-sans z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <span>💡 Tap anywhere to toggle 2.5x / 4x zoom · Drag to pan across pure zari weave details</span>
          </div>
        </div>
      )}
    </div>
  );
}

