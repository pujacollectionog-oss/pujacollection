import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { STORE_ADDRESS, STORE_PHONE_DISPLAY, STORE_WHATSAPP_URL } from '@/lib/nepal-address';

const FOOTER_LINKS = {
  Sarees: [
    { label: 'Banarasi Silk', href: '/sarees' },
    { label: 'Kanjivaram', href: '/sarees' },
    { label: 'Chiffon & Georgette', href: '/sarees' },
    { label: 'Pre-Stitched Sarees', href: '/sarees' },
  ],
  Lehengas: [
    { label: 'Bridal Lehengas', href: '/lehengas' },
    { label: 'Sangeet & Reception', href: '/lehengas' },
    { label: 'Floral Organza', href: '/lehengas' },
    { label: 'Velvet Lehengas', href: '/lehengas' },
  ],
  'Kurtis, Suits & Gowns': [
    { label: 'Festive Kurtis', href: '/kurtis-suits' },
    { label: 'Sharara Sets', href: '/kurtis-suits' },
    { label: 'Gharara Sets', href: '/kurtis-suits' },
    { label: 'Straight Suits', href: '/kurtis-suits' },
    { label: 'Floor-Length Gowns', href: '/kurtis-suits' },
  ],
  'Customer Care & Services': [
    { label: 'Live Order Tracking', href: '/track-order' },
    { label: 'All-Nepal Free Delivery', href: '/checkout' },
    { label: `WhatsApp Support (${STORE_PHONE_DISPLAY})`, href: STORE_WHATSAPP_URL },
    { label: 'Heritage & Weaving Stories', href: '/heritage' },
    { label: '7-Day Easy Exchange Policy', href: '/track-order' },
  ],
};

const PAYMENT_METHODS = ['Fonepay Dynamic QR', 'Cash on Delivery (COD)'];
const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
];

export function Footer() {
  return (
    <footer className="bg-[#2f312f] text-[#f1f1ee]" role="contentinfo">
      {/* Main footer */}
      <div className="container-luxury section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(233,195,73,0.4)] bg-white">
                <Image src="/images/logo.png" alt="Puja Collection" fill className="object-contain p-0.5" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white block leading-none">Puja</span>
                <span className="font-display text-xs font-medium text-[#e9c349] tracking-widest uppercase">Collection</span>
              </div>
            </div>

            <p className="font-sans text-sm text-[#dadad7] leading-relaxed max-w-xs">
              Nepal&apos;s premier destination for authentic Indian ethnic wear — Banarasi silks, bridal lehengas, and artisan-crafted suits, delivered across Nepal.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-1">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-[rgba(233,195,73,0.25)] flex items-center justify-center text-[#dadad7] hover:border-[#e9c349] hover:text-[#e9c349] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-1.5 text-sm font-sans text-[#dadad7]">
              <p className="flex items-center gap-2">
                <span>📍</span> {STORE_ADDRESS}
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <a href={`tel:${STORE_PHONE}`} className="hover:text-[#e9c349] transition-colors font-mono">
                  {STORE_PHONE_DISPLAY}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>💬</span>
                <a
                  href={STORE_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-semibold"
                >
                  WhatsApp: {STORE_PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="lg:col-span-1">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#e9c349] mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-sm text-[#dadad7] hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-[#dadad7] hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[rgba(233,195,73,0.12)]" />

      {/* Bottom bar */}
      <div className="container-luxury py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Payment badges (Fonepay & COD) */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <span className="font-sans text-xs text-[#8e6f74]">Accepted payments:</span>
            {PAYMENT_METHODS.map((pm) => (
              <span
                key={pm}
                className="px-2.5 py-1 rounded-md border border-[rgba(233,195,73,0.2)] font-sans text-xs font-semibold text-[#e9c349] bg-[rgba(233,195,73,0.05)]"
              >
                {pm}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-sans text-xs text-[#8e6f74] text-center">
            © {new Date().getFullYear()} Puja Collection Pvt. Ltd. · {STORE_ADDRESS} · All-Nepal Free Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
