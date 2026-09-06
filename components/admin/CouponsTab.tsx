import React, { useState, useEffect } from 'react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { ConfirmDialogModal } from '@/components/ui/ConfirmDialogModal';

export interface CouponRecord {
  id: string;
  code: string;
  description: string | null;
  discountType: 'PERCENTAGE' | 'FLAT_NPR';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountNPR: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export function CouponsTab() {
  const { formatPrice } = useCurrencyStore();
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'FLAT_NPR' | 'PERCENTAGE'>('FLAT_NPR');
  const [discountValue, setDiscountValue] = useState<number>(1000);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(10000);
  const [maxDiscountNPR, setMaxDiscountNPR] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<string>('100');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) {
          setCoupons(data.coupons);
        }
      }
    } catch (e) {
      console.error('Failed to fetch coupons', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) setCoupons(data.coupons);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = (id: string, couponCode: string) => {
    setDeleteTarget({ id, code: couponCode });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch('/api/coupons', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.coupons) setCoupons(data.coupons);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!code.trim()) {
      setFormError('Please enter a coupon code.');
      return;
    }
    if (discountValue <= 0) {
      setFormError('Discount value must be greater than 0.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description: description.trim() || null,
          discountType,
          discountValue: Number(discountValue),
          minOrderAmount: Number(minOrderAmount) || 0,
          maxDiscountNPR: maxDiscountNPR ? Number(maxDiscountNPR) : null,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          expiresAt: expiresAt || null,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to create coupon.');
        return;
      }

      if (data.coupons) {
        setCoupons(data.coupons);
      }

      // Reset form & close
      setCode('');
      setDescription('');
      setDiscountType('FLAT_NPR');
      setDiscountValue(1000);
      setMinOrderAmount(10000);
      setMaxDiscountNPR('');
      setUsageLimit('100');
      setExpiresAt('');
      setIsModalOpen(false);
    } catch {
      setFormError('Network error while creating coupon.');
    } finally {
      setSaving(false);
    }
  };

  // KPIs
  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((acc, c) => acc + c.usedCount, 0);

  const filteredCoupons = coupons.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return c.code.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Total Coupons</span>
          <span className="font-display text-2xl font-bold text-[#0f172a]">{coupons.length}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Configured in store</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Active Promotions</span>
          <span className="font-display text-2xl font-bold text-emerald-600">{activeCount}</span>
          <span className="text-[11px] text-emerald-600/80 block mt-1">Live for customers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Total Redemptions</span>
          <span className="font-display text-2xl font-bold text-[#be123c]">{totalRedemptions}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Times redeemed at checkout</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Quick Action</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-[#be123c] text-white hover:bg-[#9f1239] transition-all font-sans text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>➕ Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search coupons by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#be123c] outline-none text-[#0f172a]"
          />
        </div>

        <span className="text-xs font-sans text-slate-500 whitespace-nowrap">
          Showing <strong>{filteredCoupons.length}</strong> promo codes
        </span>
      </div>

      {/* Coupons Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-sans text-xs animate-pulse">
            Loading active store coupons...
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <span className="text-4xl block">🎟️</span>
            <p className="font-display text-base font-bold text-[#0f172a]">No coupons found</p>
            <p className="text-xs text-slate-500">Create a promotional code to attract customers with discounts.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#be123c] text-white text-xs font-bold hover:bg-[#9f1239] cursor-pointer"
            >
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Type & Value</th>
                  <th className="py-3.5 px-4">Min. Subtotal</th>
                  <th className="py-3.5 px-4">Usage Count</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredCoupons.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-rose-50 text-[#be123c] border border-rose-200 px-2.5 py-1 rounded-lg">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(c.code)}
                            title="Copy code"
                            className="text-slate-400 hover:text-slate-700 text-xs p-1"
                          >
                            {copiedCode === c.code ? '✓' : '📋'}
                          </button>
                        </div>
                        {c.description && (
                          <p className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">{c.description}</p>
                        )}
                      </td>

                      {/* Discount Value */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0f172a]">
                          {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `NPR ${c.discountValue.toLocaleString()} OFF`}
                        </div>
                        {c.discountType === 'PERCENTAGE' && c.maxDiscountNPR && (
                          <span className="text-[10px] text-slate-500 block">
                            Max Cap: NPR {c.maxDiscountNPR.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Min Order Amount */}
                      <td className="py-3.5 px-4">
                        {c.minOrderAmount > 0 ? (
                          <span className="font-mono font-semibold text-slate-700">
                            NPR {c.minOrderAmount.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No minimum</span>
                        )}
                      </td>

                      {/* Usage Count & Limit */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-mono text-slate-700 font-bold">
                            {c.usedCount} {c.usageLimit ? `/ ${c.usageLimit}` : 'used'}
                          </span>
                          {c.usageLimit && (
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#be123c] rounded-full"
                                style={{ width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(c.id, c.isActive)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            c.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {c.isActive ? '● Active' : '○ Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="px-2.5 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-semibold cursor-pointer"
                        >
                          Delete ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setIsModalOpen(false)}>
          <div
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 animate-fade-in-up max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5 border-b border-slate-100 flex-shrink-0 bg-white">
              <div>
                <h3 className="font-display text-lg font-bold text-[#0f172a]">Create Promotional Coupon</h3>
                <p className="text-xs text-slate-500">Configure promotional discount codes for Puja Collection.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 md:px-8">
              {formError && (
                <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold">
                  ⚠️ {formError}
                </div>
              )}

              <form id="create-coupon-form" onSubmit={handleCreateCoupon} className="space-y-4 font-sans text-xs">
                {/* Coupon Code */}
                <div>
                  <label className="font-bold text-[#0f172a] block mb-1">
                    Coupon Code * <span className="text-slate-400 font-normal">(Uppercase, no spaces)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DASHAIN2026, BRIDAL10"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none font-mono font-bold tracking-wider uppercase text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-bold text-[#0f172a] block mb-1">Description / Customer Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat NPR 5,000 off on bridal collections"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0f172a] block mb-1">Discount Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none bg-white font-semibold cursor-pointer"
                    >
                      <option value="FLAT_NPR">Flat NPR (Rs.)</option>
                      <option value="PERCENTAGE">Percentage (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-[#0f172a] block mb-1">
                      {discountType === 'PERCENTAGE' ? 'Discount Percentage (%) *' : 'Discount Amount (NPR) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={discountType === 'PERCENTAGE' ? 100 : undefined}
                      placeholder={discountType === 'PERCENTAGE' ? 'e.g. 10 for 10%' : 'e.g. 5000'}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Minimum Order Amount & Usage Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#0f172a] block mb-1">Min Order Amount (NPR)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 25000 (0 for no minimum)"
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none font-mono"
                    />
                  </div>

                  {discountType === 'PERCENTAGE' && (
                    <div>
                      <label className="font-bold text-[#0f172a] block mb-1">Max Discount Cap (NPR)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 8000 (Optional)"
                        value={maxDiscountNPR}
                        onChange={(e) => setMaxDiscountNPR(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none font-mono"
                      />
                    </div>
                  )}

                  {discountType !== 'PERCENTAGE' && (
                    <div>
                      <label className="font-bold text-[#0f172a] block mb-1">Total Usage Limit</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 100 (Optional)"
                        value={usageLimit}
                        onChange={(e) => setUsageLimit(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="font-bold text-[#0f172a] block mb-1">Expiration Date (Optional)</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#be123c] outline-none font-sans"
                  />
                </div>
              </form>
            </div>

            {/* Modal Fixed Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 md:px-8 border-t border-slate-100 bg-slate-50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-coupon-form"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#be123c] hover:bg-[#9f1239] transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Publish Coupon Code →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialogModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Coupon"
        itemName={deleteTarget?.code}
        itemType="coupon"
        message="Are you sure you want to delete this promotional coupon? Customers will no longer be able to apply this discount at checkout."
        confirmLabel="Yes, Delete Coupon"
        isLoading={isDeleting}
        onConfirm={executeDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
