import React from 'react';
import type { Metadata } from 'next';
import { OrderTrackingView } from '@/components/tracking/OrderTrackingView';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Tracking Order #${orderId} | Puja Collection`,
    description: `Real-time atelier progress and courier delivery status for order #${orderId}.`,
  };
}

export default async function TrackOrderDynamicPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <OrderTrackingView initialOrderId={orderId} />
    </div>
  );
}
