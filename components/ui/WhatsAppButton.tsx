'use client';

import React, { useState } from 'react';
import { STORE_WHATSAPP_URL, STORE_PHONE_DISPLAY } from '@/lib/nepal-address';

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <aside
      aria-label="WhatsApp customer support"
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      {/* Tooltip badge */}
      <div
        className={`hidden sm:flex items-center gap-2 mr-3 px-3.5 py-2 rounded-2xl bg-[#1a1c1b]/95 text-white backdrop-blur-md shadow-2xl border border-[rgba(233,195,73,0.3)] transition-all duration-300 pointer-events-none ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        <div className="flex flex-col text-left">
          <span className="font-sans text-[11px] font-bold text-white tracking-wide">
            Chat with Puja Collection
          </span>
          <span className="font-mono text-[10px] text-[#25D366]">
            {STORE_PHONE_DISPLAY}
          </span>
        </div>
      </div>

      {/* Floating Action Button */}
      <a
        href={STORE_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Chat with Puja Collection on WhatsApp (+977 9811313666)"
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-pulse pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative z-10 drop-shadow-sm"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.072.043.419-.101.824zm-3.392-10.416c-4.412 0-8 3.588-8 8 0 1.543.439 2.986 1.199 4.218l-1.272 4.654 4.773-1.252c1.179.643 2.525.98 3.944.98 4.412 0 8-3.588 8-8s-3.588-8-8-8z"/>
        </svg>

        {/* Online Indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow">
          <span className="w-2.5 h-2.5 bg-[#25D366] rounded-full" />
        </span>
      </a>
    </aside>
  );
}
