'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrderStore, type OrderRecord } from '@/store/useOrderStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { STORE_PHONE_DISPLAY, STORE_PHONE } from '@/lib/nepal-address';

interface OrderTrackingViewProps {
  initialOrderId?: string;
}

const STAGES = [
  { id: 'CONFIRMED', label: 'Order Confirmed', icon: '✓', desc: 'Payment verified & order queued' },
  { id: 'QUALITY_CHECK', label: 'Quality Inspection', icon: '🔍', desc: 'Fabric & weave verification' },
  { id: 'PACKAGING', label: 'Packaging', icon: '🎁', desc: 'Secured protective packing' },
  { id: 'OUT_FOR_DELIVERY', label: 'Courier Handover', icon: '🚚', desc: 'Courier dispatch across Nepal' },
  { id: 'DELIVERED', label: 'Delivered', icon: '🏠', desc: 'Doorstep delivery confirmed' },
];

export function OrderTrackingView({ initialOrderId }: OrderTrackingViewProps) {
  const { getOrderBySearch, getOrderById } = useOrderStore();
  const { formatPrice } = useCurrencyStore();

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderRecord | undefined>(
    initialOrderId ? getOrderById(initialOrderId) : undefined
  );
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setHasSearched(true);

    const cleanOrderId = orderIdInput.trim();
    const cleanPhone = phoneInput.trim().replace(/\D/g, '');

    if (!cleanOrderId && !cleanPhone) {
      setError('Please provide your Order ID and registered 10-digit mobile number.');
      setSearchedOrder(undefined);
      return;
    }

    // 1. Try local state first if orderId exists
    if (cleanOrderId) {
      const found = getOrderById(cleanOrderId);
      if (found) {
        if (!cleanPhone || found.customer.phone.replace(/\D/g, '').includes(cleanPhone)) {
          setSearchedOrder(found);
          setError('');
          return;
        }
      }
    }

    // 2. Query Prisma Server Database securely
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (cleanOrderId) params.append('orderId', cleanOrderId);
      if (cleanPhone) params.append('phone', cleanPhone);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.order) {
        const dbO = data.order;
        const mapped: OrderRecord = {
          orderId: dbO.id,
          customer: {
            name: dbO.customerName,
            email: dbO.customerEmail,
            phone: dbO.customerPhone,
          },
          shippingAddress: {
            province: dbO.province,
            district: dbO.district,
            municipality: dbO.municipality,
            ward: dbO.ward,
            toleAndStreet: dbO.toleAndStreet,
            landmark: dbO.landmark || undefined,
          },
          items: dbO.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            size: item.size || undefined,
            colorName: item.colorName || undefined,
            isCustomTailored: false,
          })),
          subtotalNPR: dbO.subtotalNPR,
          discountNPR: dbO.discountNPR,
          couponCode: dbO.couponCode || undefined,
          deliveryFeeNPR: dbO.deliveryFeeNPR,
          totalAmountNPR: dbO.totalAmountNPR,
          paymentMethod: dbO.paymentMethod as any,
          paymentStatus: dbO.paymentStatus as any,
          status: dbO.status as any,
          createdAt: dbO.createdAt,
          courier: {
            consignmentId: dbO.consignmentId || 'PTH-NP-TRACK',
            partner: 'PATHAO',
            partnerName: dbO.courierPartner || 'Pathao Express Nepal',
            contactNumber: '+977-1-5970000',
            dispatchDate: 'Scheduled upon Packaging',
            estimatedDeliveryDate: '2-3 Business Days',
            origin: 'Puja Collection Central Atelier, Rangeli-7, Morang',
            destination: `${dbO.toleAndStreet}, ${dbO.district}`,
            trackingHistory: [
              {
                status: dbO.status.replace(/_/g, ' '),
                location: 'Rangeli Central Atelier',
                timestamp: 'Today',
                description: `Current order status: ${dbO.status.replace(/_/g, ' ')}.`,
              },
            ],
          },
        };

        setSearchedOrder(mapped);
        setError('');
        return;
      } else {
        setError(data.message || 'No matching order found. Please verify your Order ID and registered mobile number.');
        setSearchedOrder(undefined);
      }
    } catch {
      setError('Unable to fetch order status. Please check your internet connection.');
      setSearchedOrder(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setOrderIdInput('');
    setPhoneInput('');
    setSearchedOrder(undefined);
    setHasSearched(false);
    setError('');
  };

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 0;
      case 'FABRIC_CUTTING':
      case 'QUALITY_CHECK':
        return 1;
      case 'TAILOR_STITCHING':
      case 'PACKAGING':
        return 2;
      case 'OUT_FOR_DELIVERY':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIdx = searchedOrder ? getStageIndex(searchedOrder.status) : 0;

  return (
    <div className="container-luxury py-10 md:py-16">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
        <span className="label-sm text-[#b45309]">Real-Time Nepal Delivery &amp; Dispatch Status</span>
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f172a]">
          Live Order Tracking
        </h1>
        <p className="font-sans text-xs md:text-sm text-[#475569]">
          Enter your Order ID (e.g. <span className="font-mono font-bold text-[#be123c]">PUJA-2026-0842</span>) or the 10-digit mobile number used during checkout to track your package.
        </p>

        {/* Secure Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto pt-2">
          <input
            type="text"
            value={orderIdInput}
            onChange={(e) => {
              setOrderIdInput(e.target.value);
              setError('');
            }}
            placeholder="Order ID (e.g. PUJA-2026-X8...)"
            className="flex-1 px-4 py-3.5 text-xs font-sans font-mono rounded-2xl border border-slate-300 bg-white focus:border-[#be123c] focus:ring-2 focus:ring-rose-500/20 outline-none shadow-sm text-center sm:text-left"
            autoFocus={!initialOrderId}
          />
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => {
              setPhoneInput(e.target.value);
              setError('');
            }}
            placeholder="Mobile (e.g. 98XXXXXXXX)"
            className="w-full sm:w-44 px-4 py-3.5 text-xs font-sans font-mono rounded-2xl border border-slate-300 bg-white focus:border-[#be123c] focus:ring-2 focus:ring-rose-500/20 outline-none shadow-sm text-center sm:text-left"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3.5 rounded-2xl font-sans text-xs font-bold uppercase tracking-wider bg-[#be123c] text-white hover:bg-[#9f1239] transition-all shadow-md hover:shadow-lg cursor-pointer flex-shrink-0 disabled:opacity-60"
          >
            {isLoading ? 'Verifying...' : 'Track Order →'}
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-fade-in max-w-lg mx-auto mt-2">
            <p>{error}</p>
            <p className="mt-1 text-[11px] text-[#475569]">
              Need help? WhatsApp us directly at{' '}
              <a
                href={`https://wa.me/${STORE_PHONE.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#075E54] hover:underline"
              >
                {STORE_PHONE_DISPLAY}
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Initial Empty State (When no search has been performed) */}
      {!searchedOrder && !hasSearched && (
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 animate-fade-in text-center">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl block">📦</span>
            <h3 className="font-sans text-xs font-bold text-[#0f172a]">Live Dispatch Stages</h3>
            <p className="font-sans text-[11px] text-slate-500">
              Track from quality inspection to courier handover in real time.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl block">🚚</span>
            <h3 className="font-sans text-xs font-bold text-[#0f172a]">All 7 Provinces</h3>
            <p className="font-sans text-[11px] text-slate-500">
              Free nationwide delivery covering 77 districts across Nepal.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <span className="text-2xl block">💬</span>
            <h3 className="font-sans text-xs font-bold text-[#0f172a]">WhatsApp Support</h3>
            <p className="font-sans text-[11px] text-slate-500">
              Instant delivery inquiries via our Rangeli store hotline.
            </p>
          </div>
        </div>
      )}

      {/* Result Display (Only shown after user searches and order is found) */}
      {searchedOrder && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          {/* Status Header Banner */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold text-[#0f172a]">
                  Order #{searchedOrder.orderId}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {searchedOrder.paymentStatus}
                </span>
              </div>
              <p className="font-sans text-xs text-[#475569]">
                Placed by <strong>{searchedOrder.customer.name}</strong> on {new Date(searchedOrder.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left md:text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Delivery</span>
                <p className="font-display text-lg font-bold text-[#b45309]">
                  {searchedOrder.courier?.estimatedDeliveryDate || '4–5 Days Across Nepal'}
                </p>
              </div>

              <button
                onClick={handleResetSearch}
                className="text-xs font-bold text-[#be123c] hover:underline px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                Track Another
              </button>
            </div>
          </div>

          {/* Visual Progress Stepper */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-display text-base font-bold text-[#0f172a] pb-3 border-b border-slate-100">
              Live Dispatch &amp; Delivery Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {STAGES.map((stg, idx) => {
                const isCompleted = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div key={stg.id} className="flex flex-col items-center text-center space-y-1 relative">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold transition-all ${
                        isCompleted
                          ? 'bg-[#0f766e] text-white shadow-md'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-110' : ''}`}
                    >
                      {isCompleted ? stg.icon : idx + 1}
                    </div>
                    <p className={`font-sans text-xs font-bold pt-1 leading-snug ${isCompleted ? 'text-[#0f172a]' : 'text-slate-400'}`}>
                      {stg.label}
                    </p>
                    <p className="font-sans text-[10px] text-slate-500 leading-tight">
                      {stg.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier Consignment Card */}
          {searchedOrder.courier && (
            <div className="bg-[#f8fafc] p-6 md:p-8 rounded-3xl border border-slate-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#0f172a]">
                      Assigned Courier: {searchedOrder.courier.partnerName}
                    </h3>
                    <p className="font-mono text-xs text-[#0f766e] font-bold">
                      Waybill / Consignment #{searchedOrder.courier.consignmentId}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${searchedOrder.courier.contactNumber}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#b45309] hover:underline"
                >
                  📞 Courier Helpline: {searchedOrder.courier.contactNumber}
                </a>
              </div>

              {/* Courier Logs */}
              <div className="space-y-3">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                  Activity Log
                </h4>
                <div className="space-y-2.5 divide-y divide-slate-200">
                  {searchedOrder.courier.trackingHistory.map((evt, idx) => (
                    <div key={idx} className="pt-2.5 first:pt-0 flex items-start justify-between gap-4 text-xs font-sans">
                      <div>
                        <strong className="text-[#0f172a] block font-bold">{evt.status}</strong>
                        <p className="text-slate-600 text-[11px] mt-0.5">{evt.description}</p>
                        <span className="text-[10px] text-[#b45309] font-medium block mt-0.5">📍 {evt.location}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                        {evt.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Itemized Outfits Summary */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-[#0f172a] pb-2 border-b border-slate-100">
              Ensemble &amp; Item Summary
            </h3>

            <div className="space-y-4 divide-y divide-slate-100">
              {searchedOrder.items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-sans text-sm font-bold text-[#0f172a]">{item.name}</h4>
                      <span className="font-bold text-[#be123c] text-xs">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-slate-500">
                      Qty: {item.quantity} {item.size && `· Size: ${item.size}`} {item.colorName && `· Color: ${item.colorName}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Destination Address */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-sans text-[#475569] mt-4 space-y-1">
              <strong className="text-[#0f172a] block">📍 Delivery Destination:</strong>
              <p>{searchedOrder.shippingAddress.toleAndStreet}, Ward {searchedOrder.shippingAddress.ward}</p>
              <p>{searchedOrder.shippingAddress.municipality}, {searchedOrder.shippingAddress.district}, {searchedOrder.shippingAddress.province}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
