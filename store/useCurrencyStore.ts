'use client';

import { create } from 'zustand';

interface CurrencyStore {
  formatPrice: (amountNPR: number) => string;
}

export const useCurrencyStore = create<CurrencyStore>(() => ({
  formatPrice: (amountNPR: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amountNPR);

    return `रू ${formatted}`;
  },
}));
