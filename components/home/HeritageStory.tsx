import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const WEAVER_STORIES = [
  {
    city: 'Varanasi',
    craft: 'Banarasi Silk & Zari',
    desc: 'For over 2,000 years, the weavers of Banaras have transformed raw silk and gold into living art. Each Banarasi saree passes through 22 pairs of hands before reaching you.',
  },
  {
    city: 'Kanchipuram',
    craft: 'Kanjivaram Silk',
    desc: 'In the temple city of Tamil Nadu, Kanjivaram weavers weave two separate silks — body and border — intertwined at the join. The result? A saree that outlives generations.',
  },
  {
    city: 'Jaipur',
    craft: 'Gota Patti & Zardozi',
    desc: 'From the Pink City comes the most luminous of traditions — fine gold ribbon appliqué (Gota Patti) and Mughal-era raised gold thread embroidery (Zardozi) that turns cloth into regalia.',
  },
];

export function HeritageStory() {
  return (
    <section
      className="section-padding bg-[#1a1c1b] overflow-hidden relative"
      aria-labelledby="heritage-heading"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #735c00 0, #735c00 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative container-luxury">

        {/* Layout: image left, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          {/* Image column */}
          <div className="relative order-2 lg:order-1">
            {/* Main image */}
            <div className="relative aspect-[4/3] sm:aspect-[3/4] rounded-2xl overflow-hidden max-w-md mx-auto lg:mx-0">
              <Image
                src="/images/heritage-artisan.jpg"
                alt="Master weaver creating a Banarasi silk saree on a traditional loom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
              {/* Gold frame accent */}
              <div className="absolute inset-0 border border-[rgba(233,195,73,0.25)] rounded-2xl pointer-events-none" />
            </div>

            {/* Floating stat card */}
            <div className="absolute bottom-3 right-3 lg:-bottom-4 lg:-right-4 glass-dark rounded-xl p-3 sm:p-4 shadow-xl border border-[rgba(233,195,73,0.2)] max-w-[140px] sm:max-w-[160px]">
              <p className="font-display text-xl sm:text-2xl font-bold text-[#e9c349]">2,000+</p>
              <p className="font-sans text-[10px] sm:text-xs text-[rgba(241,241,238,0.7)] mt-0.5 leading-tight">Years of Craft Heritage</p>
            </div>
          </div>

          {/* Text column */}
          <div className="order-1 lg:order-2 flex flex-col gap-5 sm:gap-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-px w-8 sm:w-10 bg-[#e9c349]" />
              <span className="label-sm text-[#e9c349]">Our Heritage</span>
            </div>

            <h2 id="heritage-heading" className="headline-lg text-white">
              A Legacy of<br />
              <span className="text-gold-shimmer">Threads</span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-[rgba(241,241,238,0.75)] leading-relaxed">
              At Puja Collection, we travel to India&apos;s most celebrated textile hubs to bring you garments that carry the soul of their origins. Every piece is not just clothing — it is a chapter in a story thousands of years old.
            </p>

            {/* City stories */}
            <div className="space-y-3.5 sm:space-y-5">
              {WEAVER_STORIES.map((story, i) => (
                <div
                  key={story.city}
                  className="flex gap-3 sm:gap-4 border-l-2 pl-3.5 sm:pl-4 transition-colors hover:border-[#e9c349]"
                  style={{ borderColor: i === 0 ? '#e9c349' : 'rgba(233,195,73,0.2)' }}
                >
                  <div>
                    <p className="font-display text-sm sm:text-base font-semibold text-white">
                      {story.city} — <span className="text-[#e9c349]">{story.craft}</span>
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-[rgba(241,241,238,0.6)] mt-0.5 sm:mt-1 leading-relaxed">
                      {story.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4 pt-1 sm:pt-2">
              <Link
                href="/heritage"
                className="inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-semibold text-[#e9c349] border-b border-[rgba(233,195,73,0.4)] pb-0.5 hover:border-[#e9c349] transition-colors"
              >
                Read Our Full Story
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
