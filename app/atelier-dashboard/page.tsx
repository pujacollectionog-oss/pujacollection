import React from 'react';
import type { Metadata } from 'next';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';

export const metadata: Metadata = {
  title: 'Store Operations & Admin Dashboard | Puja Collection',
  description:
    'Real-time order fulfillment, inventory management, customer outreach & all-Nepal courier dispatches.',
};

export default function AtelierDashboardPage() {
  return <AdminDashboardLayout />;
}
