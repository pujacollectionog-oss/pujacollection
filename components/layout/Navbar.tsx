'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

const NAV_CATEGORIES = [
  {
    label: 'Sarees',
    href: '/sarees',
    subcategories: [
      { label: 'Banarasi Silk', href: '/sarees', desc: 'Handwoven Katan & Brocade' },
      { label: 'Kanjivaram', href: '/sarees', desc: 'Pure Mulberry Silk, GI Tag' },
      { label: 'Chiffon', href: '/sarees', desc: 'Lightweight & Festive' },
      { label: 'Georgette', href: '/sarees', desc: 'Printed & Embroidered' },
      { label: 'Organza', href: '/sarees', desc: 'Sheer Elegance' },
      { label: 'Pre-Stitched', href: '/sarees', desc: 'Ready-to-Drape' },
    ],
  },
  {
    label: 'Lehengas',
    href: '/lehengas',
    subcategories: [
      { label: 'Bridal Lehengas', href: '/lehengas', desc: 'Heavy Embroidery & Zardozi' },
      { label: 'Reception', href: '/lehengas', desc: 'Elegant & Graceful' },
      { label: 'Sangeet', href: '/lehengas', desc: 'Lightweight & Vibrant' },
      { label: 'Floral & Organza', href: '/lehengas', desc: 'Pastel & Dreamy' },
      { label: 'Velvet Lehengas', href: '/lehengas', desc: 'Regal & Rich' },
    ],
  },
  {
    label: 'Kurtis & Suits',
    href: '/kurtis-suits',
    subcategories: [
      { label: 'Festive Kurtis', href: '/kurtis-suits', desc: 'For Celebrations' },
      { label: 'Sharara Sets', href: '/kurtis-suits', desc: 'Flared Bottoms' },
      { label: 'Gharara Sets', href: '/kurtis-suits', desc: 'Traditional Silhouette' },
      { label: 'Straight Suits', href: '/kurtis-suits', desc: 'Versatile & Chic' },
      { label: 'Floor-Length Gowns', href: '/kurtis-suits', desc: 'Grand Entrances & Soirées' },
    ],
  },
  {
    label: 'Heritage Stories',
    href: '/heritage',
    subcategories: [
      { label: 'Art of Banarasi Weaving', href: '/heritage', desc: 'A 2000-year tradition' },
      { label: 'Zari & Embroidery Guide', href: '/heritage', desc: 'Threads of gold' },
      { label: 'Our Master Weavers', href: '/heritage', desc: 'Faces behind the craft' },
    ],
  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedIdx, setMobileExpandedIdx] = useState<number | null>(null);
  const { totalItems, openCart } = useCartStore();
  const { totalWishlisted } = useWishlistStore();

  const cartCount = totalItems();
  const wishlistCount = totalWishlisted();

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f9f9f6]/95 backdrop-blur-xl border-b border-[rgba(115,92,0,0.18)] shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-200">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20 md:h-22">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0" aria-label="Puja Collection — Home">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[rgba(115,92,0,0.4)] shadow-sm group-hover:scale-105 transition-transform duration-200 bg-white">
              <Image src="/images/logo.png" alt="Puja Collection Logo" fill className="object-contain p-0.5" priority />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-[#1a1c1b] group-hover:text-[#a00041] transition-colors leading-none">
                Puja
              </span>
              <span className="font-sans text-[11px] font-semibold text-[#735c00] tracking-[0.2em] uppercase mt-0.5">
                Collection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.label} className="mega-menu-trigger relative group">
                <Link
                  href={cat.href}
                  className="px-4 py-2 font-sans text-sm font-semibold text-[#1a1c1b] hover:text-[#a00041] transition-colors duration-200 tracking-wide flex items-center gap-1.5"
                >
                  {cat.label}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="opacity-40 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all duration-200"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Link>

                {/* Mega Menu Dropdown */}
                <div className="mega-menu absolute top-full left-1/2 -translate-x-1/2 pt-3 w-80">
                  <div className="bg-[#f9f9f6] rounded-2xl p-5 shadow-2xl border border-[rgba(115,92,0,0.2)]">
                    <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-[rgba(226,190,194,0.4)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c81857]" />
                      <span className="label-sm text-[#735c00]">{cat.label}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="group/item flex flex-col px-3 py-2 rounded-xl hover:bg-[rgba(160,0,65,0.06)] transition-colors duration-150"
                        >
                          <span className="text-sm font-semibold text-[#1a1c1b] group-hover/item:text-[#a00041] transition-colors">
                            {sub.label}
                          </span>
                          <span className="text-xs text-[#8e6f74] mt-0.5 font-sans">{sub.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Right Action Icons & Quick Links */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Track Order Quick Link */}
            <Link
              href="/track-order"
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[#0f172a] hover:text-[#be123c] px-3 py-1.5 rounded-full hover:bg-rose-50 transition-colors"
            >
              <span>🚚</span>
              <span>Track Order</span>
            </Link>



            {/* Wishlist Icon Button */}
            <button
              aria-label={`Wishlist (${wishlistCount} items)`}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#0f172a] hover:text-[#be123c] hover:bg-rose-50 transition-all duration-150"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#055858] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-button"
              onClick={openCart}
              aria-label={`Shopping bag (${cartCount} items)`}
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[#c81857] text-white hover:bg-[#a00041] transition-all duration-150 shadow-sm hover:shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#fed65b] text-[#745c00] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md border border-white animate-fade-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden ml-1 w-10 h-10 flex items-center justify-center rounded-full text-[#1a1c1b] hover:bg-[rgba(160,0,65,0.08)] transition-colors"
            >
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#f9f9f6] border-t border-[rgba(115,92,0,0.18)] max-h-[calc(100vh-5rem)] overflow-y-auto shadow-2xl">
          <div className="container-luxury py-5 space-y-1">
            {NAV_CATEGORIES.map((cat, idx) => (
              <div key={cat.label} className="border-b border-[rgba(226,190,194,0.3)] last:border-0 pb-1">
                <button
                  onClick={() => setMobileExpandedIdx(mobileExpandedIdx === idx ? null : idx)}
                  className="flex justify-between items-center w-full py-3 text-base font-semibold text-[#1a1c1b] font-sans"
                >
                  <span>{cat.label}</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`transition-transform duration-200 ${mobileExpandedIdx === idx ? 'rotate-180 text-[#c81857]' : 'text-[#8e6f74]'}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {mobileExpandedIdx === idx && (
                  <div className="pb-3 pl-3 grid gap-1 animate-fade-in">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex flex-col py-2 px-3 rounded-lg hover:bg-[rgba(160,0,65,0.06)] text-sm font-medium text-[#5a4044] hover:text-[#a00041] transition-colors"
                      >
                        <span className="font-semibold">{sub.label}</span>
                        <span className="text-xs text-[#8e6f74]">{sub.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
