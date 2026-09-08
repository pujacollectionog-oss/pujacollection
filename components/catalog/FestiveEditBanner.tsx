'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { STORE_WHATSAPP_URL, STORE_PHONE_DISPLAY } from '@/lib/nepal-address';

interface FestiveEditBannerProps {
  categorySlug?: string;
}

export function FestiveEditBanner({ categorySlug }: FestiveEditBannerProps) {
  const whatsAppText = encodeURIComponent(
    'Namaste Puja Collection, I would like to inquire about the upcoming Festive Edit (Timeless Sarees & Lehengas) and book an appointment.'
  );
  const customWhatsAppUrl = `https://wa.me/9779767784053?text=${whatsAppText}`;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-[rgba(233,195,73,0.3)] bg-[#1a120b] my-4 animate-fade-in">
      {/* Background Lifestyle Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/festive-edit-banner.jpg"
          alt="The Festive Edit — Timeless Sarees & Lehengas for every celebration"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1280px"
          className="object-cover object-center lg:object-right"
        />
        {/* Cinematic Multi-Layer Gradient Overlays for perfect text readability & negative space */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/60 lg:to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent to-black/40" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 px-6 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24 max-w-3xl space-y-6">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] bg-[rgba(254,214,91,0.15)] text-[#fed65b] border border-[rgba(254,214,91,0.35)] backdrop-blur-md shadow-xs">
            <span>✨</span>
            <span>THE FESTIVE EDIT</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#be123c]/85 text-white backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>Coming Soon</span>
          </span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-sm">
            Timeless Sarees &amp; Lehengas for every celebration
          </h2>
          <p className="font-serif italic text-base sm:text-xl text-[#fed65b]/90 leading-snug">
            Handcrafted with master weaver heritage, pure gold zari threads, and artisanal silk drapes.
          </p>
        </div>

        {/* Narrative Description */}
        <p className="font-sans text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-xl">
          Our master karigars are curating a royal selection of authentic Banarasi Katan silks, Kanjivaram heirlooms, and bespoke bridal lehengas for the festive season.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-3">
          <a
            href={customWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-sans text-xs sm:text-sm font-bold tracking-wide hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-102 active:scale-98"
          >
            <span>💬</span>
            <span>Inquire on WhatsApp</span>
          </a>

          <Link
            href="/collections"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-sans text-xs sm:text-sm font-bold tracking-wide border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Explore All Available Ensembles →</span>
          </Link>
        </div>

        {/* Guarantee Notes */}
        <div className="pt-4 flex flex-wrap items-center gap-4 text-[11px] text-white/70 font-sans border-t border-white/10">
          <span className="flex items-center gap-1.5">
            <span className="text-[#fed65b]">✓</span> Bespoke Bridal Consultations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#fed65b]">✓</span> Direct Master Karigar Handlooms
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[#fed65b]">✓</span> Free All-Nepal Delivery
          </span>
        </div>
      </div>
    </div>
  );
}
