'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OrdersManagementTab } from './OrdersManagementTab';
import { InventoryTab } from './InventoryTab';
import { CouponsTab } from './CouponsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { CustomersTab } from './CustomersTab';
import { AdminLoginScreen } from './AdminLoginScreen';
import { useOrderStore } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';
import { STORE_ADDRESS, STORE_PHONE_DISPLAY } from '@/lib/nepal-address';

type TabId = 'orders' | 'inventory' | 'coupons' | 'analytics' | 'customers';

export function AdminDashboardLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('orders');
  const { orders } = useOrderStore();
  const { products, syncWithServer } = useProductStore();

  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED').length;

  const checkSession = async () => {
    try {
      const res = await fetch('/api/admin/session');
      const data = await res.json();
      setIsAuthenticated(Boolean(res.ok && data.authenticated));
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkSession();
    syncWithServer();
  }, [syncWithServer]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
    }
  };

  // Loading state while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mx-auto" />
          <p className="font-sans text-xs font-bold text-slate-300 uppercase tracking-widest">
            Loading Admin Console...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, show secure Login Gate
  if (!isAuthenticated) {
    return <AdminLoginScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col">
      {/* Top Simple Admin Navbar */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-30 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Store Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700 bg-white flex-shrink-0">
              <Image src="/images/logo.png" alt="Logo" fill className="object-contain p-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-sm text-white tracking-wide">
                  Puja Collection
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                📍 {STORE_ADDRESS} · {STORE_PHONE_DISPLAY}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span>🌐</span>
              <span className="hidden sm:inline">Storefront ↗</span>
            </Link>

            <Link
              href="/track-order"
              target="_blank"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors flex items-center gap-1.5"
            >
              <span>🚚</span>
              <span className="hidden sm:inline">Track ↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-rose-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <span>🔓</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto scrollbar-none border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'text-white border-rose-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <span>📦 Orders</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                confirmedCount > 0
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'inventory'
                ? 'text-white border-rose-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <span>👗 Products</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-700 text-slate-300">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'coupons'
                ? 'text-white border-rose-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <span>🎟️ Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-white border-rose-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <span>📊 Sales &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'customers'
                ? 'text-white border-rose-500 bg-slate-800/40'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <span>👥 Customers</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-40 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {activeTab === 'orders' && <OrdersManagementTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'coupons' && <CouponsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'customers' && <CustomersTab />}
      </main>
    </div>
  );
}
