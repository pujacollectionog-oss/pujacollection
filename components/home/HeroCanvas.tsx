'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function HeroCanvas() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#1a1c1b]"
      aria-label="Hero — Puja Collection"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-section.png"
          alt="Puja Collection — Luxury Indian Ethnic Wear in Nepal"
          fill
          unoptimized
          priority
          className="object-cover object-[72%_center] sm:object-center lg:object-[80%_center]"
          sizes="100vw"
        />
        {/* Multi-Layer Cinematic Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120b]/95 via-[#1a120b]/65 to-black/35 lg:bg-gradient-to-r lg:from-[#1a120b]/92 lg:via-[#1a120b]/55 lg:to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent to-black/30" />
      </div>

      {/* Decorative gold lines */}
      <div className="absolute top-0 left-16 w-px h-32 bg-gradient-to-b from-transparent via-[rgba(233,195,73,0.4)] to-transparent" />
      <div className="absolute bottom-0 right-16 w-px h-32 bg-gradient-to-b from-transparent via-[rgba(233,195,73,0.4)] to-transparent" />

      {/* Content */}
      <div className="relative container-luxury w-full pt-28 pb-16 md:py-0">
        <div className="max-w-2xl">

          {/* Eyebrow with decorative flourish */}
          <div
            className="flex items-center gap-2.5 mb-4 sm:mb-5 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="h-px w-6 sm:w-8 bg-[#f59e0b]" />
            <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#fef08a] flex items-center gap-1.5">
              <span>❖</span>
              Nepal&apos;s Finest Indian Ethnic Wear
            </span>
          </div>

          {/* Majestic Editorial Headline */}
          <h1
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-medium leading-[1.08] md:leading-[1.02] tracking-[-0.01em] mb-4 sm:mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Where Every
            <br />
            <span className="italic font-normal text-[#fed65b]">Thread Tells</span>
            <br />
            a Story.
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-lg mb-6 sm:mb-10 font-normal animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            Mastercrafted Banarasi silks, bridal lehengas &amp; festive ensembles — woven for grand celebrations, weddings, and every cherished memory.
          </p>

          {/* CTAs */}
          <div
            className="grid grid-cols-2 sm:flex sm:flex-row gap-2.5 sm:gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              href="/lehengas"
              className="inline-flex items-center justify-center text-center gap-1.5 sm:gap-2.5 px-4 py-3.5 sm:px-8 sm:py-4 rounded-xl font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] bg-[#b45309] text-white hover:bg-[#92400e] transition-all shadow-lg hover:shadow-amber-900/30 hover:scale-[1.02]"
            >
              Lehengas →
            </Link>
            <Link
              href="/sarees"
              className="inline-flex items-center justify-center text-center gap-1.5 sm:gap-2.5 px-4 py-3.5 sm:px-8 sm:py-4 rounded-xl font-sans text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-white border border-amber-400/60 hover:border-amber-400 hover:bg-amber-400/10 transition-all backdrop-blur-sm"
            >
              Sarees
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-2 sm:gap-8 mt-8 sm:mt-14 pt-5 sm:pt-6 border-t border-white/10 sm:border-0 animate-fade-in-up"
            style={{ animationDelay: '0.55s' }}
          >
            {[
              { value: '500+', label: 'Curated Pieces' },
              { value: '4.9★', label: 'Customer Rating' },
              { value: '7', label: 'Provinces Delivered' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="font-display text-lg sm:text-2xl font-bold text-white">{stat.value}</span>
                <span className="font-sans text-[10px] sm:text-xs text-[rgba(241,241,238,0.7)] mt-0.5 leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator - hidden on small mobile to avoid overlap */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <span className="font-sans text-xs text-white/40 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
