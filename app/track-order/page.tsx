import React from 'react';
import type { Metadata } from 'next';
import { OrderTrackingView } from '@/components/tracking/OrderTrackingView';

export const metadata: Metadata = {
  title: 'Live Order Tracking — Nepal Delivery & Dispatch Status | Puja Collection',
  description:
    'Track your luxury Indian ethnic wear order in real-time. Live quality inspection, packaging, and courier dispatch across Nepal.',
};

export default function TrackOrderPage() {
  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <OrderTrackingView />
    </div>
  );
}
