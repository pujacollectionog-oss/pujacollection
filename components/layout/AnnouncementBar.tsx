'use client';

import React, { useEffect, useState } from 'react';

const MESSAGES = [
  '🎊 Festive Indian Ethnic Collection Live — Free Delivery All Over Nepal',
  '✨ Authentic Banarasi, Kanjivaram & Bridal Lehengas — Direct from Master Weavers',
  '💎 100% Genuine Handcrafted Fabrics — Premium Quality & Timeless Elegance',
  '🚚 Fast & Reliable All-Nepal Delivery to Your Doorstep in 4–5 Days',
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('puja-announcement-dismissed');
    if (saved === 'true') setDismissed(true);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('puja-announcement-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <div className="announcement-bar relative z-50 py-2 overflow-hidden">
      <div className="flex items-center justify-between px-4">
        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {[...MESSAGES, ...MESSAGES].map((msg, i) => (
              <span key={i} className="inline-block font-sans text-xs font-medium tracking-wide text-white/95 mx-8">
                {msg}
              </span>
            ))}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="ml-4 flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
