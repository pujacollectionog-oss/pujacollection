'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number; // in NPR
  image: string;
  quantity: number;
  maxStock?: number;
  size?: string;
  colorName?: string;
  isCustomTailored: boolean;
  tailoringFee?: number;
  tailoringSummary?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Computed
  totalItems: () => number;
  subtotalNPR: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (item) =>
        set((state) => {
          const maxAvailable = typeof item.maxStock === 'number' ? Math.max(1, item.maxStock) : 10;
          const existingIdx = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === item.variantId &&
              !item.isCustomTailored
          );
          if (existingIdx > -1 && !item.isCustomTailored) {
            const updated = [...state.items];
            const newQty = Math.min(maxAvailable, updated[existingIdx].quantity + item.quantity);
            updated[existingIdx] = {
              ...updated[existingIdx],
              quantity: newQty,
              maxStock: maxAvailable,
            };
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                id: `${item.productId}-${Date.now()}`,
                quantity: Math.min(maxAvailable, Math.max(1, item.quantity)),
                maxStock: maxAvailable,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => {
                  if (i.id !== id) return i;
                  const limit = typeof i.maxStock === 'number' ? i.maxStock : 10;
                  return { ...i, quantity: Math.min(limit, quantity) };
                }),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotalNPR: () =>
        get().items.reduce(
          (acc, i) =>
            acc + (i.price + (i.tailoringFee ?? 0)) * i.quantity,
          0
        ),
    }),
    { name: 'puja-cart' }
  )
);
