import React from 'react';

export function DeliveryWidget() {
  return (
    <div className="bg-[#f8fafc] p-4 rounded-2xl border border-slate-200 space-y-3">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[rgba(180,83,9,0.1)] flex items-center justify-center text-sm flex-shrink-0">
          🚚
        </div>
        <div>
          <p className="font-sans text-xs font-bold text-[#0f172a]">
            Free Delivery all over Nepal in 4–5 days
          </p>
          <p className="font-sans text-[11px] text-[#475569]">
            Dispatched to all 7 Provinces (Kathmandu, Pokhara, Biratnagar, Butwal, Chitwan &amp; beyond).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px] text-[#475569]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#0f766e] font-bold">✓</span>
          <span>Fonepay Dynamic QR</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#0f766e] font-bold">✓</span>
          <span>Cash on Delivery (COD)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#0f766e] font-bold">✓</span>
          <span>Free Muslin Bag Included</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#0f766e] font-bold">✓</span>
          <span>7-Day Exchange Guarantee</span>
        </div>
      </div>
    </div>
  );
}
