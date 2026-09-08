'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrderStore, type OrderRecord, type AtelierOrderStatus } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';
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

interface ConfirmDialogState {
  isOpen: boolean;
  type: 'CANCEL' | 'DELETE' | 'REMOVE_ITEM';
  title: string;
  badge: string;
  description: string;
  itemId?: string;
  itemName?: string;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { orders, updateOrderStatus, addItemToOrder, removeItemFromOrder, cancelOrder, deleteOrder } = useOrderStore();
  const { products } = useProductStore();
  const { formatPrice } = useCurrencyStore();

  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Custom confirmation dialog state (replaces browser window.confirm)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);

  // Add Item form state
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [customQty, setCustomQty] = useState<number>(1);
  const [customSize, setCustomSize] = useState('Standard');
  const [customColor, setCustomColor] = useState('');
  const [customImage, setCustomImage] = useState('/images/hero-lehenga.jpg');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  if (!order) return null;

  // Always use the latest state from the store
  const liveOrder = orders.find((o) => o.orderId === order.orderId) || order;

  const handleAdvanceStatus = (nextStatus: AtelierOrderStatus) => {
    updateOrderStatus(liveOrder.orderId, nextStatus);
  };

  const cleanPhone = liveOrder.customer.phone.replace(/\D/g, '');
  const whatsAppText = encodeURIComponent(
    `Namaste ${liveOrder.customer.name}! Greetings from Puja Collection (Rangeli, Morang).\n\nRegarding your Order #${liveOrder.orderId}:\n• Status: ${liveOrder.status.replace(/_/g, ' ')}\n• Delivery Address: ${liveOrder.shippingAddress.toleAndStreet}, Ward ${liveOrder.shippingAddress.ward}, ${liveOrder.shippingAddress.municipality}, ${liveOrder.shippingAddress.district}\n• Total Amount: NPR ${liveOrder.totalAmountNPR.toLocaleString()}\n• Payment: ${liveOrder.paymentMethod === 'FONEPAY' ? 'Fonepay QR (Paid)' : 'Cash on Delivery (COD)'}\n\nOur team is ensuring your handcrafted ensemble is packed with care. You can track your package anytime at: https://pujacollection.com.np/track-order?orderId=${liveOrder.orderId}\n\nThank you for choosing Puja Collection!`
  );

  const whatsAppLink = `https://wa.me/977${cleanPhone}?text=${whatsAppText}`;

  const copyTrackingLink = () => {
    const url = `${window.location.origin}/track-order?orderId=${liveOrder.orderId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) {
      setCustomName('');
      setCustomPrice(0);
      setCustomSize('Standard');
      setCustomColor('');
      setCustomImage('/images/hero-lehenga.jpg');
      setSelectedVariantId('');
      return;
    }

    const prod = products.find((p) => p.id === prodId || p.slug === prodId);
    if (prod) {
      setCustomName(prod.name);
      setCustomPrice(prod.basePrice);
      setCustomImage(prod.images[0]?.url || '/images/hero-lehenga.jpg');
      if (prod.variants && prod.variants.length > 0) {
        setSelectedVariantId(prod.variants[0].id);
        setCustomSize(prod.variants[0].size || 'Standard');
        setCustomColor(prod.variants[0].colorName || '');
      } else {
        setSelectedVariantId('');
        setCustomSize('Standard');
        setCustomColor('');
      }
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || customPrice <= 0) {
      setActionError('Please provide a valid product name and price.');
      return;
    }

    setIsSubmitting(true);
    setActionError('');

    const res = await addItemToOrder(liveOrder.orderId, {
      productId: selectedProductId || undefined,
      variantId: selectedVariantId || undefined,
      name: customName.trim(),
      price: customPrice,
      quantity: Math.max(1, customQty),
      size: customSize || 'Standard',
      colorName: customColor || undefined,
      image: customImage || '/images/hero-lehenga.jpg',
    });

    setIsSubmitting(false);

    if (res.success) {
      setShowAddForm(false);
      setSelectedProductId('');
      setCustomName('');
      setCustomPrice(0);
      setCustomQty(1);
    } else {
      setActionError(res.error || 'Failed to add product to order.');
    }
  };

  // Trigger custom confirmation dialogs
  const promptRemoveItem = (itemId: string, itemName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'REMOVE_ITEM',
      badge: 'Order Adjustment',
      title: 'Remove Product from Order?',
      description: `Are you sure you want to remove "${itemName}" from this order? The order total will be recalculated automatically and stock restored.`,
      itemId,
      itemName,
    });
  };

  const promptCancelOrder = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'CANCEL',
      badge: 'Stock Restoration',
      title: `Cancel Order #${liveOrder.orderId}?`,
      description: 'This will mark the order as Cancelled and return all product quantities back into your active inventory stock.',
    });
  };

  const promptDeleteOrder = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'DELETE',
      badge: 'Permanent Action',
      title: `Permanently Delete Order #${liveOrder.orderId}?`,
      description: 'This action cannot be undone. All itemized data and history for this order will be permanently purged.',
    });
  };

  // Execute confirmed action
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;

    setIsSubmitting(true);
    setActionError('');

    if (confirmDialog.type === 'REMOVE_ITEM' && confirmDialog.itemId) {
      const res = await removeItemFromOrder(liveOrder.orderId, confirmDialog.itemId);
      setIsSubmitting(false);
      setConfirmDialog(null);
      if (!res.success) {
        setActionError(res.error || 'Failed to remove item.');
      }
    } else if (confirmDialog.type === 'CANCEL') {
      const res = await cancelOrder(liveOrder.orderId);
      setIsSubmitting(false);
      setConfirmDialog(null);
      if (!res.success) {
        setActionError(res.error || 'Failed to cancel order.');
      }
    } else if (confirmDialog.type === 'DELETE') {
      const res = await deleteOrder(liveOrder.orderId);
      setIsSubmitting(false);
      setConfirmDialog(null);
      if (res.success) {
        onClose();
      } else {
        setActionError(res.error || 'Failed to delete order.');
      }
    }
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId || p.slug === selectedProductId);

  return (
    <>
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
                  Order #{liveOrder.orderId}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    liveOrder.status === 'CANCELLED'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : liveOrder.paymentMethod === 'FONEPAY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {liveOrder.status === 'CANCELLED'
                    ? '❌ Cancelled'
                    : liveOrder.paymentMethod === 'FONEPAY'
                    ? 'Fonepay QR (Verified)'
                    : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <p className="font-sans text-xs text-[#475569]">
                Placed on {new Date(liveOrder.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 text-lg p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {actionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-between">
              <span>{actionError}</span>
              <button onClick={() => setActionError('')} className="text-rose-400 hover:text-rose-700 text-sm">✕</button>
            </div>
          )}

          {/* Status Stepper & Advancement */}
          {liveOrder.status === 'CANCELLED' ? (
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚫</span>
                <div>
                  <h4 className="text-xs font-bold text-rose-800">Order is Cancelled</h4>
                  <p className="text-[11px] text-rose-600">Product inventory has been restored.</p>
                </div>
              </div>
              <button
                onClick={() => handleAdvanceStatus('CONFIRMED')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-100 cursor-pointer"
              >
                Re-activate Order
              </button>
            </div>
          ) : (
            <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                  Order Fulfillment Stage
                </span>
                <span className="font-mono text-xs font-bold text-[#be123c]">
                  Current: {liveOrder.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Stepper Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {STAGES.map((stg) => {
                  const isCurrent = liveOrder.status === stg.id;
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
          )}

          {/* Customer & Direct WhatsApp Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500 block">Customer Information</span>
              <h4 className="font-sans text-sm font-bold text-[#0f172a]">{liveOrder.customer.name}</h4>
              <p className="font-mono text-xs text-[#be123c] font-bold">📱 +977 {cleanPhone}</p>
              <p className="text-xs text-slate-600">✉️ {liveOrder.customer.email}</p>

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
                📍 {liveOrder.shippingAddress.toleAndStreet}, Ward {liveOrder.shippingAddress.ward}
              </p>
              <p className="text-xs text-slate-600">
                {liveOrder.shippingAddress.municipality}, {liveOrder.shippingAddress.district}
              </p>
              <p className="text-xs text-[#b45309] font-bold">
                {liveOrder.shippingAddress.province}
              </p>
              {liveOrder.shippingAddress.landmark && (
                <p className="text-[11px] text-slate-500 italic">
                  Landmark: {liveOrder.shippingAddress.landmark}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Products & Add Product Action */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#0f172a]">
                Itemized Ensembles ({liveOrder.items.length})
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-[#be123c] border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{showAddForm ? '✕ Close Form' : '+ Add Product to Order'}</span>
              </button>
            </div>

            {/* Form to Add New Product to this Order */}
            {showAddForm && (
              <form
                onSubmit={handleAddProductSubmit}
                className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3 animate-fade-in text-xs"
              >
                <h5 className="font-bold text-[#be123c] flex items-center gap-1.5">
                  <span>➕</span> Add Customer Requested Item
                </h5>

                {/* Select from existing store catalog */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Choose from Store Catalog (Optional)
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium outline-none cursor-pointer"
                  >
                    <option value="">-- Custom Product / Enter manually --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — NPR {p.basePrice.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variant selection if product has variants */}
                {selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Variant / Size</label>
                    <select
                      value={selectedVariantId}
                      onChange={(e) => {
                        const vId = e.target.value;
                        setSelectedVariantId(vId);
                        const v = selectedProduct.variants.find((v) => v.id === vId);
                        if (v) {
                          setCustomSize(v.size || 'Standard');
                          setCustomColor(v.colorName || '');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium outline-none cursor-pointer"
                    >
                      {selectedProduct.variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.title || v.size} (Stock: {v.stockQuantity}) {v.colorName && `· ${v.colorName}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Product Details Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Crimson Banarasi Dupatta"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit Price (NPR) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={customPrice || ''}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      placeholder="e.g. 12500"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-mono font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={customQty}
                      onChange={(e) => setCustomQty(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-mono font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Size / Variant</label>
                    <input
                      type="text"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder="Standard, M, L, XL"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-2 rounded-xl font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl font-bold bg-[#be123c] text-white hover:bg-[#9f1239] transition-all shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? 'Adding...' : '✓ Add to Order'}
                  </button>
                </div>
              </form>
            )}

            {/* Itemized List */}
            <div className="space-y-2 divide-y divide-slate-100">
              {liveOrder.items.map((item) => (
                <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      <Image src={item.image || '/images/hero-lehenga.jpg'} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h5 className="font-sans font-bold text-[#0f172a]">{item.name}</h5>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} {item.size && `· Size: ${item.size}`} {item.colorName && `· ${item.colorName}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#be123c] font-mono">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    {liveOrder.items.length > 1 && (
                      <button
                        onClick={() => promptRemoveItem(item.id, item.name)}
                        disabled={isSubmitting}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove item from order"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Financial Summary */}
          <div className="bg-slate-100 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-bold block">Total Amount Payable</span>
              <span className="font-display text-xl font-bold text-[#0f172a]">
                {formatPrice(liveOrder.totalAmountNPR)}
              </span>
            </div>

            <button
              onClick={copyTrackingLink}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{copied ? '✓ Copied Link' : '🔗 Copy Tracking Link'}</span>
            </button>
          </div>

          {/* Danger Zone & Order Control */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {liveOrder.status !== 'CANCELLED' && (
                <button
                  onClick={promptCancelOrder}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  🚫 Cancel Order
                </button>
              )}
              <button
                onClick={promptDeleteOrder}
                disabled={isSubmitting}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-300 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                🗑️ Delete Order
              </button>
            </div>

            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl font-sans text-xs font-bold bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>

      {/* LUXURY CUSTOM CONFIRMATION POPUP DIALOG */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Icon */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  confirmDialog.type === 'DELETE'
                    ? 'bg-rose-100 text-rose-600'
                    : confirmDialog.type === 'CANCEL'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {confirmDialog.type === 'DELETE' ? '⚠️' : confirmDialog.type === 'CANCEL' ? '🚫' : '🗑️'}
              </div>

              <div className="space-y-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    confirmDialog.type === 'DELETE'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : confirmDialog.type === 'CANCEL'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {confirmDialog.badge}
                </span>
                <h3 className="font-display text-base font-bold text-[#0f172a]">
                  {confirmDialog.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="font-sans text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              {confirmDialog.description}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl font-sans text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel / Keep
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  confirmDialog.type === 'DELETE'
                    ? 'bg-[#be123c] hover:bg-[#9f1239]'
                    : confirmDialog.type === 'CANCEL'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                } disabled:opacity-60`}
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : confirmDialog.type === 'DELETE' ? (
                  <span>Confirm Delete</span>
                ) : confirmDialog.type === 'CANCEL' ? (
                  <span>Confirm Cancellation</span>
                ) : (
                  <span>Remove Item</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
