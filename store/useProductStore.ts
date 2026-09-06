'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProducts, type MockProduct } from '@/lib/mock/products';

interface ProductStore {
  products: MockProduct[];
  addProduct: (product: MockProduct) => void;
  updateProduct: (id: string, updates: Partial<MockProduct>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, delta: number) => void;
  getProductBySlug: (slug: string) => MockProduct | undefined;
  getProductsByCategory: (categorySlug: string) => MockProduct[];
  syncWithServer: () => Promise<void>;
  resetToDefaults: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,

      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products.filter((p) => p.id !== product.id)],
        }));
        // Sync with server in background
        try {
          fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          }).catch(() => {});
        } catch {}
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        try {
          fetch('/api/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          }).catch(() => {});
        } catch {}
      },

      updateStock: (productId, delta) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== productId) return p;
            const updatedVariants = p.variants.map((v) => ({
              ...v,
              stockQuantity: Math.max(0, v.stockQuantity + delta),
            }));
            return { ...p, variants: updatedVariants };
          }),
        }));
        try {
          fetch('/api/products', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: productId, delta }),
          }).catch(() => {});
        } catch {}
      },

      getProductBySlug: (slug) => {
        return get().products.find((p) => p.slug === slug);
      },

      getProductsByCategory: (categorySlug) => {
        if (categorySlug === 'collections') return get().products;
        return get().products.filter((p) => p.categorySlug === categorySlug);
      },

      syncWithServer: async () => {
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const data = await res.json();
            if (data.products && Array.isArray(data.products)) {
              set({ products: data.products });
            }
          }
        } catch {}
      },

      resetToDefaults: () => set({ products: mockProducts }),
    }),
    {
      name: 'puja-products',
    }
  )
);
