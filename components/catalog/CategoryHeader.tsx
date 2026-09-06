import React from 'react';
import Link from 'next/link';
import type { CategoryMeta } from '@/lib/mock/categories';

interface CategoryHeaderProps {
  category: CategoryMeta;
  totalCount: number;
}

export function CategoryHeader({ category, totalCount }: CategoryHeaderProps) {
  return (
    <header className="relative bg-[#2f312f] text-[#f1f1ee] py-14 md:py-20 overflow-hidden border-b border-[rgba(115,92,0,0.2)]">
      {/* Subtle gold line pattern background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#fed65b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container-luxury relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 font-sans text-xs text-[rgba(241,241,238,0.7)]">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li className="text-[rgba(233,195,73,0.6)]">/</li>
            <li className="font-semibold text-[#fed65b]" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Title & Subtitle */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="label-sm text-[#fed65b]">Exclusive Catalog</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[rgba(254,214,91,0.15)] text-[#fed65b] font-sans font-semibold">
              {totalCount} {totalCount === 1 ? 'Design' : 'Designs'}
            </span>
          </div>

          <h1 className="display-lg text-white mb-3">
            {category.name}
          </h1>

          <p className="font-display italic text-lg md:text-xl text-[#e9c349] mb-4">
            {category.subtitle}
          </p>

          <p className="font-sans text-sm md:text-base text-[rgba(241,241,238,0.8)] leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Subcategory Pills */}
        {category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)]">
            {category.subcategories.map((sub) => (
              <span
                key={sub.slug}
                className="px-3.5 py-1.5 rounded-full text-xs font-sans font-medium text-white/90 bg-white/10 hover:bg-white/20 transition-colors cursor-default border border-white/10"
              >
                {sub.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
