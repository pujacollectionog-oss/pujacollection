'use client';

import React, { useState } from 'react';
import type { MockProduct } from '@/lib/mock/products';

interface CraftsmanshipAccordionProps {
  product: MockProduct;
}

export function CraftsmanshipAccordion({ product }: CraftsmanshipAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>('sizing');
  const [unit, setUnit] = useState<'IN' | 'CM'>('IN');

  const toggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const toDisplay = (inches: number) => {
    if (unit === 'IN') return `${inches}"`;
    return `${Math.round(inches * 2.54)} cm`;
  };

  const sections = [
    {
      id: 'sizing',
      title: 'Size Chart, Dimensions & Fit Guide',
      icon: '📐',
      content: (
        <div className="space-y-3 text-xs text-[#5a4044] leading-relaxed">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(226,190,194,0.3)]">
            <span className="font-sans font-bold text-[#1a1c1b]">Standard South Asian Fit Dimensions</span>
            <div className="flex gap-1 bg-[#eeeeeb] p-0.5 rounded-lg text-[10px]">
              <button
                type="button"
                onClick={() => setUnit('IN')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  unit === 'IN' ? 'bg-[#c81857] text-white shadow-sm' : 'text-[#5a4044]'
                }`}
              >
                Inches (&quot;)
              </button>
              <button
                type="button"
                onClick={() => setUnit('CM')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  unit === 'CM' ? 'bg-[#c81857] text-white shadow-sm' : 'text-[#5a4044]'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Quick Table */}
          <div className="overflow-x-auto rounded-xl border border-[rgba(226,190,194,0.4)] bg-white">
            <table className="w-full text-left font-sans text-[11px]">
              <thead className="bg-[#f4f4f1] text-[#735c00] border-b border-[rgba(226,190,194,0.4)] font-bold">
                <tr>
                  <th className="py-2 px-3">Size</th>
                  <th className="py-2 px-2.5">Bust</th>
                  <th className="py-2 px-2.5">Waist</th>
                  <th className="py-2 px-2.5">Hip</th>
                  <th className="py-2 px-2.5">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(226,190,194,0.3)]">
                {[
                  { size: 'XS', bust: 32, waist: 26, hip: 35, len: 14 },
                  { size: 'S',  bust: 34, waist: 28, hip: 37, len: 14 },
                  { size: 'M',  bust: 36, waist: 30, hip: 39, len: 14.5 },
                  { size: 'L',  bust: 38, waist: 32, hip: 41, len: 15 },
                  { size: 'XL', bust: 40, waist: 34, hip: 43, len: 15.5 },
                  { size: '2XL',bust: 42, waist: 36, hip: 45, len: 16 },
                ].map((row) => (
                  <tr key={row.size} className="hover:bg-[#f9f9f6]">
                    <td className="py-1.5 px-3 font-bold text-[#a00041]">{row.size}</td>
                    <td className="py-1.5 px-2.5">{toDisplay(row.bust)}</td>
                    <td className="py-1.5 px-2.5">{toDisplay(row.waist)}</td>
                    <td className="py-1.5 px-2.5">{toDisplay(row.hip)}</td>
                    <td className="py-1.5 px-2.5">{toDisplay(row.len)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Garment Drape & Dimension Specifics */}
          <div className="p-2.5 rounded-xl bg-[rgba(115,92,0,0.06)] border border-[rgba(115,92,0,0.18)] space-y-1 text-[11px]">
            <p className="font-bold text-[#735c00]">✨ Garment Drape &amp; Margin Specifications:</p>
            {product.garmentType === 'SAREE' ? (
              <p>• <strong>Saree Dimensions:</strong> Full length of 5.5 meters with an additional 0.8 meter unstitched matching blouse fabric piece.</p>
            ) : product.garmentType === 'LEHENGA' ? (
              <p>• <strong>Lehenga Dimensions:</strong> Semi-stitched skirt fits waist up to 42&quot;, flared skirt length 42–44&quot; with reinforced canvas/cancan lining.</p>
            ) : (
              <p>• <strong>Kurti &amp; Suit Dimensions:</strong> Standard South Asian sizing with 2-inch internal seam margins for effortless tailoring adjustments.</p>
            )}
            <p className="text-[#5a4044]">• All readymade apparel includes generous internal allowances for easy alteration at your local tailor if desired.</p>
          </div>
        </div>
      ),
    },
    {
      id: 'craft',
      title: 'Weave & Craftsmanship Story',
      icon: '🧵',
      content: (
        <div className="space-y-2 text-xs text-[#5a4044] leading-relaxed">
          <p>
            <strong className="text-[#1a1c1b]">Technique:</strong> {product.weaveTechnique || product.craftDetails}
          </p>
          <p>{product.craftDetails}</p>
          <p className="text-[11px] text-[#735c00] italic">
            Each piece represents hundreds of hours of painstaking manual loomwork by certified master karigars.
          </p>
        </div>
      ),
    },
    {
      id: 'fabric',
      title: 'Fabric Composition & Authenticity',
      icon: '🌿',
      content: (
        <div className="space-y-2 text-xs text-[#5a4044] leading-relaxed">
          <p>
            <strong className="text-[#1a1c1b]">Fabric:</strong> {product.fabricDetails}
          </p>
          {product.silkMarkCertified && (
            <p className="text-[#735c00] font-semibold">
              ✓ Silk Mark Certified: Guaranteed 100% natural silk without synthetic blending.
            </p>
          )}
          {product.handloomCertified && (
            <p className="text-[#055858] font-semibold">
              ✓ Handloom Verified: Woven on traditional pit/frame looms preserving indigenous South Asian techniques.
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'care',
      title: 'Care & Muslin Preservation',
      icon: '✨',
      content: (
        <div className="space-y-2 text-xs text-[#5a4044] leading-relaxed">
          <p>
            <strong className="text-[#1a1c1b]">Instructions:</strong> {product.careInstructions}
          </p>
          <p>
            All garments are dispatched with an unbleached muslin storage bag to protect the pure zari threads from atmospheric oxidation.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="border-t border-[rgba(226,190,194,0.4)] mt-6 space-y-1">
      {sections.map((sec) => {
        const isOpen = openSection === sec.id;
        return (
          <div key={sec.id} className="border-b border-[rgba(226,190,194,0.3)] py-3">
            <button
              onClick={() => toggle(sec.id)}
              className="flex items-center justify-between w-full text-left font-sans text-xs font-bold uppercase tracking-wider text-[#1a1c1b] hover:text-[#a00041] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>{sec.icon}</span>
                {sec.title}
              </span>
              <span className="text-lg text-[#8e6f74] font-normal leading-none">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="pt-3 pl-6 pr-2 animate-fade-in">
                {sec.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
