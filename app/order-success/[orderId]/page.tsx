import React from 'react';
import type { Metadata } from 'next';
import { OrderSuccessView } from '@/components/order/OrderSuccessView';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order #${orderId} Confirmed | Puja Collection`,
    description: `Your order #${orderId} has been confirmed with Puja Collection. Quality inspection and packaging in progress with Free All-Nepal Delivery.`,
  };
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="bg-[#f9f9f6] min-h-screen">
      <OrderSuccessView orderId={orderId} />
    </div>
  );
}
