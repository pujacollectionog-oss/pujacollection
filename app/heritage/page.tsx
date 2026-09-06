import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Heritage Stories — A Legacy of Threads | Puja Collection',
  description:
    'Discover the ancient weaving traditions of Varanasi, Kanchipuram, and Jaipur. The artisans and master weavers behind Puja Collection.',
};

export default function HeritagePage() {
  return (
    <div className="bg-[#f9f9f6] min-h-screen">
      {/* Editorial Banner */}
      <section className="relative bg-[#1a1c1b] text-white py-20 md:py-28 overflow-hidden border-b border-[rgba(115,92,0,0.3)]">
        <div className="container-luxury relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#e9c349]" />
            <span className="label-sm text-[#e9c349]">Living Heritage</span>
          </div>
          <h1 className="display-lg text-white mb-6">
            A Legacy of <span className="text-gold-shimmer">Threads</span>
          </h1>
          <p className="font-sans text-base text-[rgba(241,241,238,0.85)] leading-relaxed">
            Every motif, border, and zari thread carries centuries of sacred South Asian textile art. We work directly with generational weaving families across India to bring mastercrafted heirlooms to Nepal.
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section className="section-padding container-luxury space-y-20">
        {/* Chapter 1: Varanasi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[rgba(115,92,0,0.2)]">
            <Image
              src="/images/bento-banarasi.jpg"
              alt="Banarasi Golden Kadwa Weave"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <span className="label-sm text-[#735c00]">Chapter I · Varanasi, Uttar Pradesh</span>
            <h2 className="headline-md text-[#1a1c1b]">The Kadwa Looms of Banaras</h2>
            <p className="font-sans text-sm text-[#5a4044] leading-relaxed">
              In the narrow alleys of Varanasi, master weavers still pass the wooden shuttle by hand. The Kadwa technique involves weaving each floral motif individually without loose floating threads on the back — an art that requires up to 4 months of continuous manual labor for a single bridal saree.
            </p>
            <Link
              href="/sarees"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a00041] hover:text-[#c81857]"
            >
              Explore Banarasi Silks →
            </Link>
          </div>
        </div>

        {/* Chapter 2: Kanchipuram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
            <span className="label-sm text-[#735c00]">Chapter II · Kanchipuram, Tamil Nadu</span>
            <h2 className="headline-md text-[#1a1c1b]">The Sacred Korvai Temple Weave</h2>
            <p className="font-sans text-sm text-[#5a4044] leading-relaxed">
              Known as the &quot;City of a Thousand Temples,&quot; Kanchipuram produces India&apos;s heaviest mulberry silks. The iconic Korvai technique links the contrast border with the saree body using a triangular temple zig-zag join, ensuring the gold zari border never separates from the silk.
            </p>
            <Link
              href="/sarees"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a00041] hover:text-[#c81857]"
            >
              Explore Kanjivaram Silks →
            </Link>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[rgba(115,92,0,0.2)]">
            <Image
              src="/images/kanjivaram-blue.jpg"
              alt="Kanjivaram Peacock Temple Saree"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Chapter 3: Lucknow & Jaipur */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-[rgba(115,92,0,0.2)]">
            <Image
              src="/images/zardozi-macro.jpg"
              alt="Zardozi Gold Bullion Embroidery"
              fill
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <span className="label-sm text-[#735c00]">Chapter III · Lucknow &amp; Jaipur</span>
            <h2 className="headline-md text-[#1a1c1b]">Zardozi &amp; Gota Patti Splendor</h2>
            <p className="font-sans text-sm text-[#5a4044] leading-relaxed">
              Dating back to the Mughal imperial workshops, Zardozi (gold bullion sewing) is an opulent art reserved for royal garments. Our bridal lehengas combine 3D gold wire hand-embroidery with micro-pearl setting and Gota ribbon work from the courts of Rajasthan.
            </p>
            <Link
              href="/lehengas"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#a00041] hover:text-[#c81857]"
            >
              Explore Bridal Lehengas →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
