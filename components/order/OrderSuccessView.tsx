'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOrderStore, type AtelierOrderStatus } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { STORE_ADDRESS, STORE_PHONE_DISPLAY, STORE_WHATSAPP_URL } from '@/lib/nepal-address';

interface OrderSuccessViewProps {
  orderId: string;
}

const TIMELINE_STEPS = [
  { id: 'CONFIRMED', label: 'Order Confirmed', icon: '✓', desc: 'Order & payment recorded' },
  { id: 'QUALITY_CHECK', label: 'Quality Inspection', icon: '🔍', desc: 'Fabric & weave verification' },
  { id: 'PACKAGING', label: 'Packaging', icon: '🎁', desc: 'Secured protective packing' },
  { id: 'OUT_FOR_DELIVERY', label: 'Courier Handover', icon: '📦', desc: 'Nepal Express dispatch' },
  { id: 'DELIVERED', label: 'Doorstep Delivery', icon: '🚚', desc: '4–5 days across Nepal' },
];

function getStageIndex(status: AtelierOrderStatus | undefined): number {
  switch (status) {
    case 'CONFIRMED':
      return 0; // Only Order Confirmed is shaded/active
    case 'QUALITY_CHECK':
      return 1;
    case 'PACKAGING':
      return 2;
    case 'OUT_FOR_DELIVERY':
      return 3;
    case 'DELIVERED':
      return 4;
    default:
      return 0;
  }
}

function getStatusLabel(status: AtelierOrderStatus | undefined): string {
  switch (status) {
    case 'CONFIRMED':
      return 'Status: Order Confirmed (Rangeli-7 Boutique HQ)';
    case 'QUALITY_CHECK':
      return 'Status: Quality Inspection & Steam Pressing';
    case 'PACKAGING':
      return 'Status: Packaging & Gift Box Seal';
    case 'OUT_FOR_DELIVERY':
      return 'Status: In Transit / Out for Delivery';
    case 'DELIVERED':
      return 'Status: Delivered to Doorstep';
    default:
      return `Status: Order Confirmed (${STORE_ADDRESS})`;
  }
}

export function OrderSuccessView({ orderId }: OrderSuccessViewProps) {
  const { getOrderById, currentOrder } = useOrderStore();
  const { formatPrice } = useCurrencyStore();
  const [copied, setCopied] = React.useState(false);

  const order = getOrderById(orderId) || currentOrder;
  const currentStageIdx = getStageIndex(order?.status);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-luxury py-10 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Celebratory Banner */}
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[rgba(115,92,0,0.25)] shadow-md text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[rgba(5,88,88,0.1)] text-[#055858] flex items-center justify-center text-3xl mx-auto">
            🎉
          </div>

          <div>
            <span className="label-sm text-[#735c00] block mb-1">Payment &amp; Order Registered</span>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1a1c1b]">
              Dhanyabad, {order?.customer.name || 'Valued Customer'}!
            </h1>
            <p className="font-sans text-xs md:text-sm text-[#5a4044] mt-2 max-w-md mx-auto">
              Your luxury Indian ethnic wear order has been confirmed.
            </p>

            {/* Interactive Copy Order ID Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50/80 border border-rose-200 shadow-sm mt-3">
              <span className="text-xs text-slate-500 font-sans">Order ID:</span>
              <strong className="text-[#a00041] font-mono text-sm font-bold tracking-wide">
                #{orderId}
              </strong>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="ml-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 shadow-sm transition-all cursor-pointer flex items-center gap-1"
                title="Copy Order ID to clipboard"
              >
                {copied ? (
                  <span className="text-emerald-700 font-bold">✓ Copied!</span>
                ) : (
                  <span>📋 Copy</span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#f4f4f1] text-[#1a1c1b] border border-[rgba(115,92,0,0.3)] hover:bg-[#e8e8e5] transition-colors cursor-pointer"
            >
              🖨️ Print Order Receipt
            </button>
            <a
              href={STORE_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#1ebd5d] transition-colors"
            >
              💬 WhatsApp Support
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041] transition-colors"
            >
              Continue Browsing →
            </Link>
          </div>
        </div>

        {/* SMS / Email Notification Receipt */}
        {order?.smsReceipt && (
          <div className="p-4 rounded-2xl bg-[#1a1c1b] text-white border border-[rgba(233,195,73,0.3)] shadow-lg space-y-1.5 animate-slide-in-right">
            <div className="flex items-center justify-between text-[10px] text-[#fed65b] font-bold uppercase tracking-wider">
              <span>💬 Confirmation Dispatched to +977 {order.customer.phone}</span>
              <span className="text-green-400 font-semibold">Delivered</span>
            </div>
            <p className="font-sans text-xs text-[#f1f1ee] leading-relaxed">
              {order.smsReceipt}
            </p>
          </div>
        )}

        {/* Dynamic Live Order Status Timeline */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[rgba(115,92,0,0.18)] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[rgba(226,190,194,0.4)] gap-2">
            <h2 className="font-display text-base font-bold text-[#1a1c1b]">
              Order Fulfillment &amp; Dispatch Timeline
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[rgba(5,88,88,0.1)] text-[#055858] self-start sm:self-auto">
              {getStatusLabel(order?.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {TIMELINE_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div key={step.id} className="flex flex-col items-center text-center space-y-1 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#055858] text-white ring-4 ring-[#055858]/15'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted && idx < currentStageIdx ? '✓' : step.icon}
                  </div>
                  <p
                    className={`font-sans text-xs font-bold pt-1 leading-snug ${
                      isCompleted ? 'text-[#1a1c1b]' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`font-sans text-[10px] leading-tight ${
                      isCurrent ? 'text-[#735c00] font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {isCurrent ? '● Active Step' : step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Receipt & Items */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-[rgba(115,92,0,0.18)] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(226,190,194,0.4)]">
            <h2 className="font-display text-base font-bold text-[#1a1c1b]">
              Order Receipt &amp; Items
            </h2>
            <span className="font-sans text-xs text-[#735c00] font-bold">
              Payment: {order?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Fonepay'} ({order?.paymentStatus || 'CONFIRMED'})
            </span>
          </div>

          <div className="space-y-4 divide-y divide-[rgba(226,190,194,0.3)]">
            {order?.items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f4f4f1] flex-shrink-0 border border-[rgba(226,190,194,0.4)]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm font-bold text-[#1a1c1b] truncate">
                    {item.name}
                  </h4>
                  <p className="font-sans text-xs text-[#8e6f74] mt-0.5">
                    Qty: {item.quantity} · Size: {item.size || 'Standard'} {item.colorName ? `· ${item.colorName}` : ''}
                  </p>
                  <p className="font-display text-sm font-bold text-[#a00041] mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="pt-4 border-t border-[rgba(226,190,194,0.4)] space-y-2 font-sans text-xs">
            <div className="flex justify-between text-[#5a4044]">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(order?.subtotalNPR || 0)}</span>
            </div>

            {order?.discountNPR ? (
              <div className="flex justify-between text-[#055858] font-bold">
                <span>Coupon Discount ({order?.couponCode})</span>
                <span className="font-mono">- {formatPrice(order.discountNPR)}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-[#5a4044]">
              <span>Nationwide Delivery</span>
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</span>
            </div>

            <div className="flex justify-between font-display text-base font-bold text-[#1a1c1b] pt-2 border-t border-[rgba(226,190,194,0.3)]">
              <span>Total Amount</span>
              <span className="text-[#a00041] font-mono">
                {formatPrice(order?.totalAmountNPR || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address Details */}
        <div className="bg-[#fdfbf7] p-6 rounded-3xl border border-[rgba(115,92,0,0.2)] text-xs text-[#5a4044] space-y-2">
          <h3 className="font-display text-sm font-bold text-[#1a1c1b]">
            Delivery Destination Details
          </h3>
          <p className="font-sans">
            <strong>Recipient:</strong> {order?.customer.name} · +977 {order?.customer.phone}
          </p>
          <p className="font-sans">
            <strong>Address:</strong> {order?.shippingAddress.toleAndStreet}, Ward {order?.shippingAddress.ward}, {order?.shippingAddress.municipality}, {order?.shippingAddress.district}, {order?.shippingAddress.province}
            {order?.shippingAddress.landmark ? ` (Landmark: ${order.shippingAddress.landmark})` : ''}
          </p>
          <p className="font-sans text-[11px] text-[#735c00] pt-1">
            🚚 Dispatched from Puja Collection Boutique, Rangeli-7, Morang via Nepal Express.
          </p>
        </div>

      </div>
    </div>
  );
}
