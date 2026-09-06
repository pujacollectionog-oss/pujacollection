import React from 'react';
import type { Metadata } from 'next';
import { CheckoutEngine } from '@/components/checkout/CheckoutEngine';

export const metadata: Metadata = {
  title: 'Luxury Checkout — Free Delivery All Over Nepal | Puja Collection',
  description:
    'Complete your order with Fonepay Dynamic QR or Cash on Delivery. Free delivery across all 7 provinces of Nepal.',
};

export default function CheckoutPage() {
  return (
    <div className="bg-[#f9f9f6] min-h-screen">
      <CheckoutEngine />
    </div>
  );
}
