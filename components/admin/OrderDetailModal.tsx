'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrderStore, type OrderRecord, type AtelierOrderStatus } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';

interface OrderDetailModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

const STAGES: { id: AtelierOrderStatus; label: string; icon: string }[] = [
  { id: 'CONFIRMED', label: 'Confirmed', icon: '📥' },
  { id: 'QUALITY_CHECK', label: 'Quality Inspection', icon: '🔍' },
  { id: 'PACKAGING', label: 'Packaging', icon: '🎁' },
  { id: 'OUT_FOR_DELIVERY', label: 'Courier Handover', icon: '🚚' },
  { id: 'DELIVERED', label: 'Delivered', icon: '🏠' },
];

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { updateOrderStatus } = useOrderStore();
  const { formatPrice } = useCurrencyStore();

  const [courierName, setCourierName] = useState(order?.courier?.partnerName || 'Pathao Express Nepal');
  const [consignmentId, setConsignmentId] = useState(order?.courier?.consignmentId || `NP-EXP-${Date.now().toString().slice(-6)}`);
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleAdvanceStatus = (nextStatus: AtelierOrderStatus) => {
    updateOrderStatus(order.orderId, nextStatus);
  };

  const cleanPhone = order.customer.phone.replace(/\D/g, '');
  const whatsAppText = encodeURIComponent(
    `Namaste ${order.customer.name}! Greetings from Puja Collection (Rangeli, Morang).\n\nRegarding your Order #${order.orderId}:\n• Status: ${order.status.replace(/_/g, ' ')}\n• Delivery Address: ${order.shippingAddress.toleAndStreet}, Ward ${order.shippingAddress.ward}, ${order.shippingAddress.municipality}, ${order.shippingAddress.district}\n• Total Amount: NPR ${order.totalAmountNPR.toLocaleString()}\n• Payment: ${order.paymentMethod === 'FONEPAY' ? 'Fonepay QR (Paid)' : 'Cash on Delivery (COD)'}\n\nOur team is ensuring your handcrafted ensemble is packed with care. You can track your package anytime at: https://pujacollection.com.np/track-order?orderId=${order.orderId}\n\nThank you for choosing Puja Collection!`
  );

  const whatsAppLink = `https://wa.me/977${cleanPhone}?text=${whatsAppText}`;

  const copyTrackingLink = () => {
    const url = `${window.location.origin}/track-order?orderId=${order.orderId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 animate-fade-in-up max-h-[90vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-lg font-bold text-[#0f172a]">
                Order #{order.orderId}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  order.paymentMethod === 'FONEPAY'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentMethod === 'FONEPAY' ? 'Fonepay QR (Verified)' : 'Cash on Delivery (COD)'}
              </span>
            </div>
            <p className="font-sans text-xs text-[#475569]">
              Placed on {new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg p-1 rounded-lg hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Status Stepper & Advancement */}
        <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#0f172a]">
              Order Fulfillment Stage
            </span>
            <span className="font-mono text-xs font-bold text-[#be123c]">
              Current: {order.status.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAGES.map((stg, idx) => {
              const isCurrent = order.status === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => handleAdvanceStatus(stg.id)}
                  className={`p-2.5 rounded-xl text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all border cursor-pointer ${
                    isCurrent
                      ? 'bg-[#be123c] text-white border-[#be123c] shadow-sm ring-2 ring-rose-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#be123c]'
                  }`}
                >
                  <span className="text-base">{stg.icon}</span>
                  <span className="text-[10px] leading-tight font-bold">{stg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer & Direct WhatsApp Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 block">Customer Information</span>
            <h4 className="font-sans text-sm font-bold text-[#0f172a]">{order.customer.name}</h4>
            <p className="font-mono text-xs text-[#be123c] font-bold">📱 +977 {cleanPhone}</p>
            <p className="text-xs text-slate-600">✉️ {order.customer.email}</p>

            <div className="pt-2 flex gap-2">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl font-sans text-xs font-bold bg-[#25D366] text-white hover:bg-[#1ebd5d] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>💬 WhatsApp Customer</span>
              </a>
              <a
                href={`tel:+977${cleanPhone}`}
                className="py-2 px-3 rounded-xl font-sans text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 flex items-center justify-center"
              >
                📞 Call
              </a>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 block">Delivery Destination</span>
            <p className="text-xs font-bold text-[#0f172a]">
              📍 {order.shippingAddress.toleAndStreet}, Ward {order.shippingAddress.ward}
            </p>
            <p className="text-xs text-slate-600">
              {order.shippingAddress.municipality}, {order.shippingAddress.district}
            </p>
            <p className="text-xs text-[#b45309] font-bold">
              {order.shippingAddress.province}
            </p>
            {order.shippingAddress.landmark && (
              <p className="text-[11px] text-slate-500 italic">
                Landmark: {order.shippingAddress.landmark}
              </p>
            )}
          </div>
        </div>

        {/* Itemized Products Summary */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase text-[#0f172a] block">Itemized Ensembles ({order.items.length})</span>
          <div className="space-y-2 divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h5 className="font-sans font-bold text-[#0f172a]">{item.name}</h5>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} {item.size && `· Size: ${item.size}`} {item.colorName && `· ${item.colorName}`}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-[#be123c] font-mono">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Financial Summary */}
        <div className="bg-slate-100 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-bold block">Total Amount Payable</span>
            <span className="font-display text-xl font-bold text-[#0f172a]">
              {formatPrice(order.totalAmountNPR)}
            </span>
          </div>

          <button
            onClick={copyTrackingLink}
            className="py-2 px-3 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{copied ? '✓ Copied Link' : '🔗 Copy Tracking Link'}</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl font-sans text-xs font-bold bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
