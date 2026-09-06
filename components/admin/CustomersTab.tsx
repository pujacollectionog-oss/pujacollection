'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';

interface CustomerRecord {
  name: string;
  phone: string;
  email: string;
  city: string;
  province: string;
  orderCount: number;
  totalSpend: number;
  lastOrderDate: string;
}

export function CustomersTab() {
  const { orders } = useOrderStore();
  const { formatPrice } = useCurrencyStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate customers from orders
  const customerMap: Record<string, CustomerRecord> = {};

  orders.forEach((o) => {
    const key = o.customer.phone.replace(/\D/g, '');
    if (!customerMap[key]) {
      customerMap[key] = {
        name: o.customer.name,
        phone: key,
        email: o.customer.email,
        city: `${o.shippingAddress.municipality}, ${o.shippingAddress.district}`,
        province: o.shippingAddress.province,
        orderCount: 1,
        totalSpend: o.totalAmountNPR,
        lastOrderDate: o.createdAt,
      };
    } else {
      customerMap[key].orderCount += 1;
      customerMap[key].totalSpend += o.totalAmountNPR;
      if (new Date(o.createdAt) > new Date(customerMap[key].lastOrderDate)) {
        customerMap[key].lastOrderDate = o.createdAt;
      }
    }
  });

  const customerList = Object.values(customerMap);

  const filteredCustomers = customerList.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center">
        <div className="relative flex-1 max-w-md w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, mobile number, or city..."
            className="w-full pl-9 pr-4 py-2.5 text-xs font-sans rounded-xl border border-slate-200 focus:border-[#be123c] outline-none"
          />
        </div>

        <p className="font-sans text-xs text-slate-500 font-medium">
          Showing <strong>{filteredCustomers.length}</strong> registered VIP patrons
        </p>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer Patron</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Location (Nepal)</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Lifetime Value</th>
                <th className="py-3.5 px-4 text-right">Direct Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const whatsAppMsg = encodeURIComponent(
                  `Namaste ${cust.name}! Greetings from Puja Collection (Rangeli-7, Morang). How can our styling concierge assist you today?`
                );
                const whatsAppLink = `https://wa.me/977${cust.phone}?text=${whatsAppMsg}`;

                return (
                  <tr key={cust.phone} className="hover:bg-slate-50/80 transition-colors">
                    {/* Customer */}
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#be123c]/10 text-[#be123c] font-bold flex items-center justify-center text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-[#0f172a] block">{cust.name}</strong>
                          <span className="text-[11px] text-slate-500">{cust.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-mono font-bold text-slate-800">
                        +977 {cust.phone}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 align-top">
                      <p className="font-medium text-slate-700">{cust.city}</p>
                      <span className="text-[10px] text-[#b45309] font-bold block">{cust.province}</span>
                    </td>

                    {/* Orders */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-mono font-bold text-slate-800 block">
                        {cust.orderCount} {cust.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Last: {new Date(cust.lastOrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </td>

                    {/* Lifetime Value */}
                    <td className="py-4 px-4 align-top">
                      <span className="font-mono font-bold text-[#be123c] text-sm block">
                        {formatPrice(cust.totalSpend)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">✓ Verified Buyer</span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 align-top text-right">
                      <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#1ebd5d] shadow-sm transition-all"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
