'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BENTO_TILES = [
  {
    id: 'bridal-lehenga',
    title: 'Bridal Lehengas',
    subtitle: 'Deep Red & Gold Zardozi — The Grand Entrance',
    description: 'Handcrafted by master karigars of Lucknow & Jaipur',
    href: '/lehengas',
    image: '/images/bento-bridal-lehenga.png',
    cta: 'Explore Lehengas',
    span: 'lg:col-span-7 lg:row-span-2',
    tall: true,
    accentColor: '#f59e0b',
    objectPosition: 'center 20%',
  },
  {
    id: 'banarasi-sarees',
    title: 'Banarasi & Kanjivaram Silks',
    subtitle: 'Pure Katan Silk · Real Zari Weave',
    description: 'From the sacred looms of Varanasi & Kanchipuram',
    href: '/sarees',
    image: '/images/bento-silk-embroidery.jpeg',
    cta: 'View Sarees',
    span: 'lg:col-span-5',
    tall: false,
    accentColor: '#e11d48',
    objectPosition: 'center center',
  },
  {
    id: 'kurtis-gowns',
    title: 'Kurtis, Suits & Gowns',
    subtitle: 'Pastel Chikankari · Shararas & Floor Gowns',
    description: 'Lucknawi needlework meets flowing modern silhouettes',
    href: '/kurtis-suits',
    image: '/images/bento-traditional-gown.jpeg',
    cta: 'Explore Kurtis & Gowns',
    span: 'lg:col-span-5',
    tall: false,
    accentColor: '#0f766e',
    objectPosition: 'center 20%',
  },
];

export function BentoGrid() {
  return (
    <section
      className="section-padding bg-[#fafaf9]"
      aria-labelledby="bento-heading"
    >
      <div className="container-luxury">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="label-sm text-[#b45309] block mb-2 font-bold tracking-widest">
              Curated Collections
            </span>
            <h2 id="bento-heading" className="headline-lg text-[#0f172a]">
              Draped in Tradition,<br />
              <span className="text-[#be123c]">Designed for Today</span>
            </h2>
          </div>
          <Link
            href="/collections"
            className="font-sans text-xs font-bold uppercase tracking-wider text-[#0f766e] hover:text-[#be123c] transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            View All Collections
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5" style={{ gridTemplateRows: 'auto auto' }}>
          {BENTO_TILES.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className={`bento-tile group block ${tile.span} ${tile.tall ? 'aspect-[4/5] md:aspect-auto' : 'aspect-[4/3]'}`}
              style={{ minHeight: tile.tall ? '520px' : '280px' }}
              aria-label={tile.title}
            >
              {/* Image */}
              <Image
                src={tile.image}
                alt={tile.subtitle}
                fill
                quality={95}
                priority={tile.tall}
                className="object-cover"
                style={{ objectPosition: tile.objectPosition }}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 900px"
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: tile.tall
                    ? 'linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.4) 50%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)',
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                {/* Category eyebrow */}
                <div
                  className="h-0.5 w-8 mb-3 transition-all duration-300 group-hover:w-14"
                  style={{ backgroundColor: tile.accentColor }}
                />

                <h3 className={`font-display font-bold text-white mb-1 ${tile.tall ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                  {tile.title}
                </h3>
                <p className="font-sans text-sm text-slate-200 mb-1">
                  {tile.subtitle}
                </p>
                {tile.tall && (
                  <p className="font-sans text-xs text-slate-400 mb-5">
                    {tile.description}
                  </p>
                )}

                {/* CTA */}
                <div className="flex items-center gap-2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span
                    className="font-sans text-xs font-bold uppercase tracking-widest"
                    style={{ color: tile.accentColor }}
                  >
                    {tile.cta}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={tile.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Craft badges row with 7-Day Exchange */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔄', title: '7-Day Exchange', desc: 'Hassle-free size & style exchange' },
            { icon: '🕊️', title: '100% Pure Silks', desc: 'Authentic handloom & bridal wear' },
            { icon: '🚚', title: 'Free All-Nepal Delivery', desc: 'Direct to all 7 provinces' },
            { icon: '💳', title: 'Fonepay & COD', desc: 'QR Scan & Cash on Delivery' },
          ].map((badge) => (
            <div
              key={badge.title}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#b45309] transition-all hover:shadow-md"
            >
              <span className="text-2xl flex-shrink-0">{badge.icon}</span>
              <div>
                <p className="font-sans text-xs font-bold text-[#0f172a]">{badge.title}</p>
                <p className="font-sans text-xs text-[#475569] mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
