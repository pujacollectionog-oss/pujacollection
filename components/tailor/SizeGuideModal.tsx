'use client';

import React, { useState } from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { size: 'XS', bustIn: 32, waistIn: 26, hipIn: 35, shoulderIn: 13.5, blouseLenIn: 13.5 },
  { size: 'S',  bustIn: 34, waistIn: 28, hipIn: 37, shoulderIn: 14.0, blouseLenIn: 14.0 },
  { size: 'M',  bustIn: 36, waistIn: 30, hipIn: 39, shoulderIn: 14.5, blouseLenIn: 14.5 },
  { size: 'L',  bustIn: 38, waistIn: 32, hipIn: 41, shoulderIn: 15.0, blouseLenIn: 15.0 },
  { size: 'XL', bustIn: 40, waistIn: 34, hipIn: 43, shoulderIn: 15.5, blouseLenIn: 15.5 },
  { size: '2XL',bustIn: 42, waistIn: 36, hipIn: 45, shoulderIn: 16.0, blouseLenIn: 16.0 },
  { size: '3XL',bustIn: 44, waistIn: 38, hipIn: 47, shoulderIn: 16.5, blouseLenIn: 16.5 },
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'IN' | 'CM'>('IN');

  if (!isOpen) return null;

  const toDisplay = (inches: number) => {
    if (unit === 'IN') return `${inches}"`;
    return `${Math.round(inches * 2.54)} cm`;
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#f9f9f6] rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-[rgba(115,92,0,0.3)] animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(226,190,194,0.4)]">
          <div>
            <h3 className="font-display text-xl font-bold text-[#1a1c1b]">
              Ethnic Wear Sizing Guide
            </h3>
            <p className="font-sans text-xs text-[#8e6f74] mt-0.5">
              Standard South Asian atelier fit standards
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(160,0,65,0.08)] text-[#5a4044] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-between my-4">
          <span className="font-sans text-xs text-[#5a4044]">
            All measurements represent body size.
          </span>
          <div className="flex gap-1 bg-[#eeeeeb] p-1 rounded-lg">
            <button
              onClick={() => setUnit('IN')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                unit === 'IN' ? 'bg-[#c81857] text-white shadow-sm' : 'text-[#5a4044]'
              }`}
            >
              Inches (&quot;)
            </button>
            <button
              onClick={() => setUnit('CM')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                unit === 'CM' ? 'bg-[#c81857] text-white shadow-sm' : 'text-[#5a4044]'
              }`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[rgba(226,190,194,0.4)] bg-white">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[#f4f4f1] border-b border-[rgba(226,190,194,0.4)] text-[#735c00]">
              <tr>
                <th className="py-2.5 px-4 font-bold">Size</th>
                <th className="py-2.5 px-3 font-bold">Bust</th>
                <th className="py-2.5 px-3 font-bold">Waist</th>
                <th className="py-2.5 px-3 font-bold">Hip</th>
                <th className="py-2.5 px-3 font-bold">Shoulder</th>
                <th className="py-2.5 px-3 font-bold">Blouse Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(226,190,194,0.3)]">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-[#f9f9f6] transition-colors">
                  <td className="py-2 px-4 font-bold text-[#a00041]">{row.size}</td>
                  <td className="py-2 px-3">{toDisplay(row.bustIn)}</td>
                  <td className="py-2 px-3">{toDisplay(row.waistIn)}</td>
                  <td className="py-2 px-3">{toDisplay(row.hipIn)}</td>
                  <td className="py-2 px-3">{toDisplay(row.shoulderIn)}</td>
                  <td className="py-2 px-3">{toDisplay(row.blouseLenIn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sizing Tips */}
        <div className="mt-5 p-3.5 rounded-xl bg-[rgba(115,92,0,0.06)] border border-[rgba(115,92,0,0.18)] text-[11px] text-[#5a4044] space-y-1">
          <p className="font-bold text-[#735c00]">💡 Perfect Fit Guidance:</p>
          <p>
            Choose the standard size closest to your bust and waist measurements. All readymade kurtis and blouses include generous 2-inch internal seam margins for effortless tailoring adjustment if needed.
          </p>
        </div>
      </div>
    </div>
  );
}
