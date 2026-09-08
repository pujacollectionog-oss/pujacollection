'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './useCartStore';
import { CourierShipment, assignCourierForDestination, generateConsignmentNumber } from '@/lib/courier';

export type AtelierOrderStatus =
  | 'CONFIRMED'
  | 'QUALITY_CHECK'
  | 'PACKAGING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderRecord {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    province: string;
    district: string;
    municipality: string;
    ward: string;
    toleAndStreet: string;
    landmark?: string;
  };
  items: CartItem[];
  subtotalNPR: number;
  discountNPR: number;
  couponCode?: string;
  deliveryFeeNPR: number;
  totalAmountNPR: number;
  paymentMethod: 'FONEPAY' | 'COD';
  paymentStatus: 'PAID' | 'COD_VERIFIED';
  status: AtelierOrderStatus;
  courier?: CourierShipment;
  createdAt: string;
  smsReceipt?: string;
  urgency?: 'NORMAL' | 'BRIDAL_RUSH' | 'WEDDING_SEASON';
}

const SEED_ORDERS: OrderRecord[] = [
  {
    orderId: 'PUJA-2026-A8F29C3B',
    customer: {
      name: 'Aayusha Shrestha',
      email: 'aayusha.shrestha@gmail.com',
      phone: '9841234567',
    },
    shippingAddress: {
      province: 'Bagmati Province',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City',
      ward: '4',
      toleAndStreet: 'Baluwatar, Gairidhara Marg',
      landmark: 'Opposite Russian Embassy',
    },
    items: [
      {
        id: 'cart-item-1',
        productId: 'banarshi-saree',
        name: 'Regal Crimson Banarasi Katan Silk Saree',
        price: 48500,
        image: '/images/bento-banarasi.jpg',
        quantity: 1,
        size: 'Standard',
        colorName: 'Crimson Red',
        isCustomTailored: false,
      },
    ],
    subtotalNPR: 48500,
    discountNPR: 4850,
    couponCode: 'PUJA2026',
    deliveryFeeNPR: 0,
    totalAmountNPR: 43650,
    paymentMethod: 'FONEPAY',
    paymentStatus: 'PAID',
    status: 'PACKAGING',
    urgency: 'BRIDAL_RUSH',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    courier: {
      consignmentId: 'PTH-NP-94812',
      partner: 'PATHAO',
      partnerName: 'Pathao Express Kathmandu',
      contactNumber: '+977-1-5970099',
      dispatchDate: 'Scheduled for Today',
      estimatedDeliveryDate: '24-48 Hours',
      origin: 'Puja Collection Central Boutique, Rangeli-7, Morang',
      destination: 'Baluwatar, Ward 4, Kathmandu',
      trackingHistory: [
        {
          status: 'Order Confirmed',
          location: 'Rangeli Boutique HQ',
          timestamp: 'Yesterday 11:30 AM',
          description: 'Payment settled via Fonepay Dynamic QR.',
        },
        {
          status: 'Quality Inspection',
          location: 'Quality Department',
          timestamp: 'Yesterday 03:00 PM',
          description: 'Pure Katan silk weave and Zari luster verified 100% authentic.',
        },
        {
          status: 'Packaging & Seal',
          location: 'Packaging Station',
          timestamp: 'Today 09:15 AM',
          description: 'Packed into signature Puja Collection protective gift box.',
        },
      ],
    },
    smsReceipt: 'Namaste! Your order #PUJA-2026-A8F29C3B for NPR 43,650 is confirmed. Fast courier delivery via Pathao.',
  },
  {
    orderId: 'PUJA-2026-B7E14D89',
    customer: {
      name: 'Sunita Gurung',
      email: 'sunita.g@outlook.com',
      phone: '9856012345',
    },
    shippingAddress: {
      province: 'Gandaki Province',
      district: 'Kaski',
      municipality: 'Pokhara Metropolitan City',
      ward: '6',
      toleAndStreet: 'Lakeside Marg, Street 14',
      landmark: 'Near Barahi Temple',
    },
    items: [
      {
        id: 'cart-item-2',
        productId: 'royal-velvet-anarkali-suit-multi',
        name: 'Deep Red & Gold Bridal Lehenga — Zardozi Edition',
        price: 125000,
        image: '/images/hero-lehenga.jpg',
        quantity: 1,
        size: 'L (Chest: 40")',
        colorName: 'Bridal Crimson',
        isCustomTailored: false,
      },
    ],
    subtotalNPR: 125000,
    discountNPR: 5000,
    couponCode: 'BRIDAL5000',
    deliveryFeeNPR: 0,
    totalAmountNPR: 120000,
    paymentMethod: 'COD',
    paymentStatus: 'COD_VERIFIED',
    status: 'QUALITY_CHECK',
    urgency: 'WEDDING_SEASON',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    courier: {
      consignmentId: 'UPY-NP-88214',
      partner: 'UPAYA',
      partnerName: 'Upaya CityCargo Nepal Logistics',
      contactNumber: '+977-1-5970033',
      dispatchDate: 'Today 04:00 PM',
      estimatedDeliveryDate: '2-3 Days (Pokhara Hub)',
      origin: 'Puja Collection Central Boutique, Rangeli-7, Morang',
      destination: 'Lakeside, Ward 6, Pokhara',
      trackingHistory: [
        {
          status: 'Order Confirmed',
          location: 'Rangeli Boutique HQ',
          timestamp: '2 days ago',
          description: 'Cash on Delivery verified via WhatsApp OTP.',
        },
        {
          status: 'Quality Inspection & Steam Pressing',
          location: 'Finishing Department',
          timestamp: 'Today 10:00 AM',
          description: 'Hand embroidery inspected. Ready for packaging.',
        },
      ],
    },
  },
];

export interface AddOrderItemPayload {
  productId?: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  colorName?: string;
  image?: string;
}

interface OrderStore {
  orders: OrderRecord[];
  currentOrder: OrderRecord | null;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: AtelierOrderStatus) => void;
  addItemToOrder: (orderId: string, item: AddOrderItemPayload) => Promise<{ success: boolean; error?: string }>;
  removeItemFromOrder: (orderId: string, itemId: string) => Promise<{ success: boolean; error?: string }>;
  cancelOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  deleteOrder: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  syncOrdersWithServer: () => Promise<void>;
  getOrderById: (orderId: string) => OrderRecord | undefined;
  getOrderBySearch: (query: string) => OrderRecord | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,
      currentOrder: SEED_ORDERS[0],

      addOrder: (order) => {
        const courierInfo = assignCourierForDestination(
          order.shippingAddress.district,
          order.shippingAddress.province
        );
        const consignmentId = generateConsignmentNumber(courierInfo.partner);

        const enrichedOrder: OrderRecord = {
          ...order,
          courier: {
            consignmentId,
            partner: courierInfo.partner,
            partnerName: courierInfo.partnerName,
            contactNumber: courierInfo.contact,
            dispatchDate: 'Scheduled upon Packaging',
            estimatedDeliveryDate: courierInfo.estDays,
            origin: 'Puja Collection Central Boutique, Rangeli-7, Morang',
            destination: `${order.shippingAddress.toleAndStreet}, ${order.shippingAddress.district}`,
            trackingHistory: [
              {
                status: 'Order Confirmed',
                location: 'Rangeli Central Boutique',
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                description: `Order placed via ${order.paymentMethod}. Queued for quality inspection and packaging.`,
              },
            ],
          },
        };

        set((state) => ({
          orders: [enrichedOrder, ...state.orders.filter((o) => o.orderId !== enrichedOrder.orderId)],
          currentOrder: enrichedOrder,
        }));
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.orderId !== orderId) return o;
            const updatedTracking = o.courier
              ? [
                  ...o.courier.trackingHistory,
                  {
                    status: status.replace(/_/g, ' '),
                    location: 'Rangeli Central Boutique',
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    description: `Status updated to ${status.replace(/_/g, ' ')}.`,
                  },
                ]
              : [];

            return {
              ...o,
              status,
              courier: o.courier
                ? {
                    ...o.courier,
                    trackingHistory: updatedTracking,
                  }
                : undefined,
            };
          }),
        }));

        try {
          fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status }),
          }).catch(() => {});
        } catch {}
      },

      addItemToOrder: async (orderId, item) => {
        try {
          const res = await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'ADD_ITEM',
              orderId,
              item,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            return { success: false, error: data.error || 'Failed to add product to order.' };
          }
          await get().syncOrdersWithServer();
          return { success: true };
        } catch {
          return { success: false, error: 'Network error adding product.' };
        }
      },

      removeItemFromOrder: async (orderId, itemId) => {
        try {
          const res = await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'REMOVE_ITEM',
              orderId,
              itemId,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            return { success: false, error: data.error || 'Failed to remove item.' };
          }
          await get().syncOrdersWithServer();
          return { success: true };
        } catch {
          return { success: false, error: 'Network error removing item.' };
        }
      },

      cancelOrder: async (orderId) => {
        try {
          const res = await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              status: 'CANCELLED',
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            return { success: false, error: data.error || 'Failed to cancel order.' };
          }
          get().updateOrderStatus(orderId, 'CANCELLED');
          await get().syncOrdersWithServer();
          return { success: true };
        } catch {
          return { success: false, error: 'Network error cancelling order.' };
        }
      },

      deleteOrder: async (orderId) => {
        try {
          const res = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, {
            method: 'DELETE',
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            return { success: false, error: data.error || 'Failed to delete order.' };
          }
          set((state) => ({
            orders: state.orders.filter((o) => o.orderId !== orderId),
          }));
          return { success: true };
        } catch {
          set((state) => ({
            orders: state.orders.filter((o) => o.orderId !== orderId),
          }));
          return { success: true };
        }
      },

      syncOrdersWithServer: async () => {
        try {
          const res = await fetch('/api/orders');
          if (res.ok) {
            const data = await res.json();
            if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
              const mapped: OrderRecord[] = data.orders.map((dbO: any) => ({
                orderId: dbO.id,
                customer: {
                  name: dbO.customerName,
                  email: dbO.customerEmail,
                  phone: dbO.customerPhone,
                },
                shippingAddress: {
                  province: dbO.province,
                  district: dbO.district,
                  municipality: dbO.municipality,
                  ward: dbO.ward,
                  toleAndStreet: dbO.toleAndStreet,
                  landmark: dbO.landmark || undefined,
                },
                items: dbO.items.map((item: any) => ({
                  id: item.id,
                  productId: item.productId,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: item.quantity,
                  size: item.size || undefined,
                  colorName: item.colorName || undefined,
                  isCustomTailored: false,
                })),
                subtotalNPR: dbO.subtotalNPR,
                discountNPR: dbO.discountNPR,
                couponCode: dbO.couponCode || undefined,
                deliveryFeeNPR: dbO.deliveryFeeNPR,
                totalAmountNPR: dbO.totalAmountNPR,
                paymentMethod: dbO.paymentMethod as any,
                paymentStatus: dbO.paymentStatus as any,
                status: dbO.status as any,
                createdAt: dbO.createdAt,
                courier: {
                  consignmentId: dbO.consignmentId || 'PTH-NP-2026',
                  partner: 'PATHAO',
                  partnerName: dbO.courierPartner || 'Pathao Express Nepal',
                  contactNumber: '+977-1-5970000',
                  dispatchDate: 'Scheduled upon Packaging',
                  estimatedDeliveryDate: '2-3 Business Days',
                  origin: 'Puja Collection Central Boutique, Rangeli-7, Morang',
                  destination: `${dbO.toleAndStreet}, ${dbO.district}`,
                  trackingHistory: [
                    {
                      status: dbO.status.replace(/_/g, ' '),
                      location: 'Rangeli Central Boutique',
                      timestamp: 'Today',
                      description: `Current order status: ${dbO.status.replace(/_/g, ' ')}.`,
                    },
                  ],
                },
              }));

              set({ orders: mapped });
            }
          }
        } catch {}
      },

      getOrderById: (orderId) => {
        if (!orderId) return undefined;
        return get().orders.find((o) => o.orderId.toUpperCase() === orderId.trim().toUpperCase());
      },

      getOrderBySearch: (query) => {
        if (!query || !query.trim()) return undefined;
        const clean = query.trim().toUpperCase().replace(/\s+/g, '');
        const cleanPhone = query.trim().replace(/\D/g, '');
        return get().orders.find(
          (o) =>
            o.orderId.toUpperCase() === clean ||
            (cleanPhone.length >= 6 && o.customer.phone.replace(/\D/g, '').includes(cleanPhone)) ||
            (o.courier?.consignmentId && o.courier.consignmentId.toUpperCase() === clean)
        );
      },
    }),
    { name: 'puja-orders' }
  )
);
