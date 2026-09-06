import React from 'react';
import type { Metadata } from 'next';
import { AdminDashboardLayout } from '@/components/admin/AdminDashboardLayout';

export const metadata: Metadata = {
  title: 'Store Admin & Operations Command | Puja Collection',
  description: 'Manage order fulfillments, inventory, customer outreach & all-Nepal courier dispatches for Puja Collection (Rangeli-7, Morang).',
};

export default function AdminPage() {
  return <AdminDashboardLayout />;
}
