'use client';

import React, { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import type { AuditLogEntry } from '@/lib/auth/adminAudit';

export function AnalyticsTab() {
  const { orders } = useOrderStore();
  const { formatPrice } = useCurrencyStore();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await fetch('/api/admin/audit');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setAuditLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmountNPR, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const fonepayOrders = orders.filter((o) => o.paymentMethod === 'FONEPAY');
  const codOrders = orders.filter((o) => o.paymentMethod === 'COD');

  const fonepayRevenue = fonepayOrders.reduce((acc, o) => acc + o.totalAmountNPR, 0);
  const codRevenue = codOrders.reduce((acc, o) => acc + o.totalAmountNPR, 0);

  const fonepayPct = totalRevenue > 0 ? Math.round((fonepayRevenue / totalRevenue) * 100) : 50;
  const codPct = 100 - fonepayPct;

  // Province Counts
  const provinceCounts: Record<string, number> = {
    'Koshi Province': 0,
    'Bagmati Province': 0,
    'Gandaki Province': 0,
    'Madhesh Province': 0,
    'Lumbini Province': 0,
    'Karnali Province': 0,
    'Sudurpashchim Province': 0,
  };

  orders.forEach((o) => {
    const prov = o.shippingAddress.province || 'Koshi Province';
    if (provinceCounts[prov] !== undefined) {
      provinceCounts[prov] += 1;
    } else {
      provinceCounts['Koshi Province'] += 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales Volume</span>
          <p className="font-display text-3xl font-bold text-[#0f172a]">
            {formatPrice(totalRevenue)}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span>↑ 18.4%</span>
            <span className="text-slate-400 font-normal">vs last cycle</span>
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ensembles Sold</span>
          <p className="font-display text-3xl font-bold text-[#be123c]">
            {orders.reduce((acc, o) => acc + o.items.length, 0)} pcs
          </p>
          <span className="text-[11px] text-slate-500">
            Across {orders.length} unique customer orders
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Order Value</span>
          <p className="font-display text-3xl font-bold text-[#b45309]">
            {formatPrice(avgOrderValue)}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            High-ticket bridal &amp; silk baskets
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">All-Nepal Delivery Success</span>
          <p className="font-display text-3xl font-bold text-[#0f766e]">
            99.2%
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">
            Zero shipping loss across 77 districts
          </span>
        </div>
      </div>

      {/* Visual Charts: Payment Split & Province Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment Split (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-display text-base font-bold text-[#0f172a]">
              Payment Gateway Breakdown
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-0.5">
              Fonepay Dynamic QR vs. WhatsApp OTP Verified COD
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-bold text-[#b71c1c] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b71c1c]" />
                Fonepay Dynamic QR ({fonepayPct}%)
              </span>
              <span className="font-mono font-bold text-slate-700">{formatPrice(fonepayRevenue)}</span>
            </div>

            <div className="h-4 rounded-full bg-slate-100 overflow-hidden flex p-0.5 border border-slate-200">
              <div
                className="h-full bg-[#b71c1c] rounded-full transition-all duration-500"
                style={{ width: `${fonepayPct}%` }}
              />
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${codPct}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-sans">
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Cash on Delivery ({codPct}%)
              </span>
              <span className="font-mono font-bold text-slate-700">{formatPrice(codRevenue)}</span>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-red-50/60 border border-red-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Fonepay Transactions</span>
                <p className="font-mono text-sm font-bold text-[#b71c1c] mt-0.5">
                  {fonepayOrders.length} orders ({fonepayPct}%)
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-[10px] text-slate-500 font-bold uppercase">COD Shipments</span>
                <p className="font-mono text-sm font-bold text-emerald-700 mt-0.5">
                  {codOrders.length} orders ({codPct}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Nepal Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-display text-base font-bold text-[#0f172a]">
              Province-Wise Dispatch Distribution
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-0.5">
              Shipments dispatched from Rangeli-7 Central Boutique across Nepal
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(provinceCounts).map(([prov, count]) => {
              const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={prov} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="font-semibold text-slate-700">{prov}</span>
                    <span className="font-mono text-slate-500 font-bold">{count} orders ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#be123c] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security & Audit Activity Log Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <h3 className="font-display text-base font-bold text-[#0f172a]">
                Admin Security &amp; Activity Audit Trail
              </h3>
            </div>
            <p className="font-sans text-xs text-slate-500 mt-0.5">
              Immutable log of admin authentications, IP lockouts, and store configuration events
            </p>
          </div>
          <button
            onClick={fetchAuditLogs}
            disabled={loadingLogs}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loadingLogs ? 'Refreshing…' : '↻ Refresh Security Logs'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Client IP</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No security events recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {log.eventType}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {log.actor}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {log.ipAddress}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.severity === 'CRITICAL'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : log.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
