'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrderStore, type OrderRecord, type AtelierOrderStatus } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { OrderDetailModal } from './OrderDetailModal';

const STATUS_FILTERS: { id: string; label: string; countId?: AtelierOrderStatus }[] = [
  { id: 'ALL', label: 'All Orders' },
  { id: 'CONFIRMED', label: '📥 Confirmed', countId: 'CONFIRMED' },
  { id: 'QUALITY_CHECK', label: '🔍 Quality Check', countId: 'QUALITY_CHECK' },
  { id: 'PACKAGING', label: '🎁 Packaging', countId: 'PACKAGING' },
  { id: 'OUT_FOR_DELIVERY', label: '🚚 In Transit', countId: 'OUT_FOR_DELIVERY' },
  { id: 'DELIVERED', label: '🏠 Delivered', countId: 'DELIVERED' },
];

export function OrdersManagementTab() {
  const { orders, updateOrderStatus, syncOrdersWithServer } = useOrderStore();
  const { formatPrice } = useCurrencyStore();

  React.useEffect(() => {
    syncOrdersWithServer();
  }, [syncOrdersWithServer]);

  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = orders.filter((o) => {
    // Status filter
    if (activeStatus !== 'ALL' && o.status !== activeStatus) return false;
    // Payment filter
    if (paymentFilter !== 'ALL' && o.paymentMethod !== paymentFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.orderId.toLowerCase().includes(q);
      const matchName = o.customer.name.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchCity = o.shippingAddress.district.toLowerCase().includes(q) || o.shippingAddress.municipality.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
            <span>📥</span>
            <span>Confirmed</span>
          </span>
        );
      case 'QUALITY_CHECK':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
            <span>🔍</span>
            <span>Quality Check</span>
          </span>
        );
      case 'PACKAGING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
            <span>🎁</span>
            <span>Packaging</span>
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap">
            <span>🚚</span>
            <span>In Transit</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            <span>🏠</span>
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  const getNextStatus = (current: AtelierOrderStatus): AtelierOrderStatus | null => {
    switch (current) {
      case 'CONFIRMED':
        return 'QUALITY_CHECK';
      case 'QUALITY_CHECK':
        return 'PACKAGING';
      case 'PACKAGING':
        return 'OUT_FOR_DELIVERY';
      case 'OUT_FOR_DELIVERY':
        return 'DELIVERED';
      default:
        return null;
    }
  };

  const getNextStatusLabel = (next: AtelierOrderStatus): string => {
    switch (next) {
      case 'QUALITY_CHECK':
        return 'Send to Quality →';
      case 'PACKAGING':
        return 'Move to Packaging →';
      case 'OUT_FOR_DELIVERY':
        return 'Courier Handover →';
      case 'DELIVERED':
        return 'Mark Delivered ✓';
      default:
        return 'Advance →';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Top Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, customer, phone (+977), or district..."
              className="w-full pl-9 pr-4 py-2.5 text-xs font-sans rounded-xl border border-slate-200 focus:border-[#be123c] focus:ring-2 focus:ring-rose-500/10 outline-none"
            />
          </div>

          {/* Payment filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 outline-none cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="FONEPAY">Fonepay Dynamic QR</option>
              <option value="COD">Cash on Delivery (COD)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_FILTERS.map((tab) => {
            const count = tab.countId
              ? orders.filter((o) => o.status === tab.countId).length
              : orders.length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeStatus === tab.id
                    ? 'bg-[#be123c] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID &amp; Date</th>
                  <th className="py-3.5 px-4">Customer &amp; Phone</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Ensembles</th>
                  <th className="py-3.5 px-4">Total &amp; Payment</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Current Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  const cleanPhone = order.customer.phone.replace(/\D/g, '');

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Order ID */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-bold text-[#be123c] block">
                          #{order.orderId}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 align-top">
                        <strong className="text-[#0f172a] block">{order.customer.name}</strong>
                        <span className="font-mono text-[11px] text-slate-500">
                          +977 {cleanPhone}
                        </span>
                      </td>

                      {/* Destination */}
                      <td className="py-4 px-4 align-top">
                        <p className="text-slate-700 font-medium">
                          {order.shippingAddress.municipality}, Ward {order.shippingAddress.ward}
                        </p>
                        <p className="text-[11px] text-[#b45309] font-semibold">
                          {order.shippingAddress.district}, {order.shippingAddress.province}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="relative w-9 h-11 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <Image
                              src={order.items[0]?.image || '/images/hero-lehenga.jpg'}
                              alt={order.items[0]?.name || 'Item'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-[#0f172a] block truncate max-w-[130px]">
                              {order.items[0]?.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-bold text-[#0f172a] block">
                          {formatPrice(order.totalAmountNPR)}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                            order.paymentMethod === 'FONEPAY'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {order.paymentMethod === 'FONEPAY' ? 'Fonepay QR' : 'COD'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {nextStatus && (
                            <button
                              onClick={() => updateOrderStatus(order.orderId, nextStatus)}
                              className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#be123c] text-white hover:bg-[#9f1239] transition-all shadow-sm cursor-pointer whitespace-nowrap"
                            >
                              {getNextStatusLabel(nextStatus)}
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                            title="View Full Order Details"
                          >
                            👁️
                          </button>
                          <a
                            href={`https://wa.me/977${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 border border-[#25D366]/30"
                            title="Message on WhatsApp"
                          >
                            💬
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center space-y-2">
            <span className="text-3xl block">📦</span>
            <h3 className="font-display text-lg font-bold text-[#0f172a]">No Orders Found</h3>
            <p className="font-sans text-xs text-slate-500 max-w-sm mx-auto">
              No orders matched your selected filters or search terms.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
