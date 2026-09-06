'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  productIds: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  totalWishlisted: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      addToWishlist: (id) =>
        set((s) =>
          s.productIds.includes(id)
            ? s
            : { productIds: [...s.productIds, id] }
        ),

      removeFromWishlist: (id) =>
        set((s) => ({ productIds: s.productIds.filter((p) => p !== id) })),

      toggleWishlist: (id) => {
        const { productIds } = get();
        if (productIds.includes(id)) {
          set({ productIds: productIds.filter((p) => p !== id) });
        } else {
          set({ productIds: [...productIds, id] });
        }
      },

      isWishlisted: (id) => get().productIds.includes(id),

      totalWishlisted: () => get().productIds.length,
    }),
    { name: 'puja-wishlist' }
  )
);
