'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useOrderStore } from '@/store/useOrderStore';
import { NEPAL_PROVINCES, isValidNepaliPhone } from '@/lib/nepal-address';
import { applyCoupon } from '@/lib/coupons';
import { generateOtp, sendCodVerificationSms, sendOrderConfirmedSms } from '@/lib/payment/sms';
import { FonepayQRModal } from './FonepayQRModal';
import { EmailOtpModal } from './EmailOtpModal';

type PaymentGatewayType = 'FONEPAY' | 'COD';

export function CheckoutEngine() {
  const router = useRouter();
  const { items, subtotalNPR, clearCart } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const { addOrder } = useOrderStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Address Form State — Initialized to Morang, Rangeli-7
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState('KOSHI');
  const [selectedDistrict, setSelectedDistrict] = useState('Morang');
  const [municipality, setMunicipality] = useState('Rangeli Municipality');
  const [ward, setWard] = useState('7');
  const [toleAndStreet, setToleAndStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Payment State (Only Fonepay & COD)
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>('FONEPAY');
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [fonepayModalOpen, setFonepayModalOpen] = useState(false);
  const [emailOtpModalOpen, setEmailOtpModalOpen] = useState(false);

  const subtotal = subtotalNPR();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryFee = 0; // Free delivery all over Nepal
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee);

  // Current Province & District Data
  const currentProvince = NEPAL_PROVINCES.find((p) => p.id === selectedProvinceId) || NEPAL_PROVINCES[0];
  const currentDistricts = currentProvince.districts;
  const currentDistrictObj = currentDistricts.find((d) => d.name === selectedDistrict) || currentDistricts[0];
  const currentMunicipalities = currentDistrictObj?.municipalities || [];
  const currentMunicipalityObj = currentMunicipalities.find((m) => m.name === municipality) || currentMunicipalities[0];
  const currentWardCount = currentMunicipalityObj?.wardCount || 9;

  // Handle Province Change
  const handleProvinceChange = (provId: string) => {
    setSelectedProvinceId(provId);
    const prov = NEPAL_PROVINCES.find((p) => p.id === provId);
    if (prov && prov.districts.length > 0) {
      const firstDist = prov.districts[0];
      setSelectedDistrict(firstDist.name);
      if (firstDist.municipalities.length > 0) {
        setMunicipality(firstDist.municipalities[0].name);
      }
      setWard('1');
    }
  };

  // Handle District Change
  const handleDistrictChange = (distName: string) => {
    setSelectedDistrict(distName);
    const dist = currentDistricts.find((d) => d.name === distName);
    if (dist && dist.municipalities.length > 0) {
      setMunicipality(dist.municipalities[0].name);
      setWard('1');
    }
  };

  // Handle Municipality Change
  const handleMunicipalityChange = (muniName: string) => {
    setMunicipality(muniName);
    const muniObj = currentMunicipalities.find((m) => m.name === muniName);
    const maxWard = muniObj?.wardCount || 9;
    const currentWardNum = parseInt(ward, 10);
    if (isNaN(currentWardNum) || currentWardNum > maxWard || currentWardNum < 1) {
      setWard('1');
    }
  };

  // Validate Step 1 Address
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    if (!isValidNepaliPhone(phone)) errs.phone = 'Valid 10-digit mobile number required (e.g. 9811XXXXXX)';
    if (!toleAndStreet.trim()) errs.toleAndStreet = 'Tole / Street address is required';

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Apply Coupon
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(couponInput.trim())}&subtotal=${subtotal}`);
      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          setAppliedCoupon({ code: data.code, discount: data.discount, message: data.message });
          setCouponInput('');
          return;
        } else {
          setCouponError(data.message || 'Invalid coupon code');
          return;
        }
      }
    } catch {}

    const result = applyCoupon(couponInput, subtotal);
    if (result.valid) {
      setAppliedCoupon({ code: couponInput.trim().toUpperCase(), discount: result.discount, message: result.message });
      setCouponInput('');
    } else {
      setCouponError(result.message);
    }
  };

  // Final Order Finalizer (Authoritative Database Sync)
  const finalizeOrder = async (gateway: PaymentGatewayType, paymentStatus: 'PAID' | 'COD_VERIFIED') => {
    try {
      setIsProcessing(true);

      const orderPayload = {
        customer: {
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim().replace(/\D/g, ''),
        },
        shippingAddress: {
          province: currentProvince.name,
          district: selectedDistrict,
          municipality,
          ward,
          toleAndStreet,
          landmark: landmark.trim() || undefined,
        },
        items,
        subtotalNPR: subtotal,
        discountNPR: discount,
        couponCode: appliedCoupon?.code,
        deliveryFeeNPR: deliveryFee,
        totalAmountNPR: totalAmount,
        paymentMethod: gateway,
        paymentStatus,
        status: 'CONFIRMED',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        alert(data.error || 'Failed to place order. Please check your network and try again.');
        setIsProcessing(false);
        return;
      }

      const confirmedOrder = data.order;
      const smsReceipt = sendOrderConfirmedSms(phone, confirmedOrder.id, confirmedOrder.totalAmountNPR);

      addOrder({
        orderId: confirmedOrder.id,
        customer: {
          name: confirmedOrder.customerName,
          email: confirmedOrder.customerEmail,
          phone: confirmedOrder.customerPhone,
        },
        shippingAddress: {
          province: confirmedOrder.province,
          district: confirmedOrder.district,
          municipality: confirmedOrder.municipality,
          ward: confirmedOrder.ward,
          toleAndStreet: confirmedOrder.toleAndStreet,
          landmark: confirmedOrder.landmark || undefined,
        },
        items: items,
        subtotalNPR: confirmedOrder.subtotalNPR,
        discountNPR: confirmedOrder.discountNPR,
        couponCode: confirmedOrder.couponCode || undefined,
        deliveryFeeNPR: confirmedOrder.deliveryFeeNPR,
        totalAmountNPR: confirmedOrder.totalAmountNPR,
        paymentMethod: gateway,
        paymentStatus,
        status: 'CONFIRMED',
        createdAt: confirmedOrder.createdAt,
        smsReceipt: smsReceipt.text,
      });

      clearCart();
      router.push(`/order-success/${confirmedOrder.id}`);
    } catch (err) {
      console.error('Order submission error:', err);
      alert('An unexpected network error occurred while submitting your order. Please try again.');
      setIsProcessing(false);
    }
  };

  // Payment Initiator
  const handleInitiatePayment = () => {
    if (selectedGateway === 'FONEPAY') {
      setFonepayModalOpen(true);
      return;
    }

    if (selectedGateway === 'COD') {
      setEmailOtpModalOpen(true);
      return;
    }
  };

  if (items.length === 0 && currentStep === 1) {
    return (
      <div className="container-luxury py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-[#1a1c1b] mb-4">Your Shopping Bag is Empty</h2>
        <p className="font-sans text-xs text-[#8e6f74] mb-8">Add exquisite Indian ethnic wear pieces before checkout.</p>
        <Link
          href="/sarees"
          className="inline-flex py-3 px-8 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041]"
        >
          Explore Catalog →
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury py-10 md:py-14">
      {/* Checkout Progress Stepper */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[rgba(226,190,194,0.6)] -translate-y-1/2 z-0" />
          {[
            { step: 1, label: 'Delivery Address' },
            { step: 2, label: 'Review Order' },
            { step: 3, label: 'Nepali Payment' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  currentStep >= s.step
                    ? 'bg-[#c81857] text-white shadow-md'
                    : 'bg-[#eeeeeb] text-[#8e6f74] border border-[rgba(226,190,194,0.6)]'
                }`}
              >
                {currentStep > s.step ? '✓' : s.step}
              </div>
              <span className={`font-sans text-[11px] font-semibold mt-1.5 ${currentStep >= s.step ? 'text-[#1a1c1b]' : 'text-[#8e6f74]'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Step Form Area (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-[rgba(115,92,0,0.18)] shadow-sm">

          {/* STEP 1: Contact & Localized Nepali Address */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-xl font-bold text-[#1a1c1b] mb-1">
                  1. Contact &amp; Nepal Delivery Address
                </h2>
                <p className="font-sans text-xs text-[#8e6f74]">
                  Free doorstep delivery across all 7 provinces of Nepal
                </p>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aayusha Shrestha"
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                  />
                  {addressErrors.fullName && <p className="text-[11px] text-[#ba1a1a] mt-1">{addressErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aayusha@gmail.com"
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                  />
                  {addressErrors.email && <p className="text-[11px] text-[#ba1a1a] mt-1">{addressErrors.email}</p>}
                </div>
              </div>

              {/* 10-Digit Mobile */}
              <div>
                <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                  Nepali Mobile Number (for WhatsApp OTP &amp; Courier) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-xs font-mono font-bold bg-[#f4f4f1] text-[#735c00] border border-r-0 border-[rgba(226,190,194,0.8)] rounded-l-xl">
                    +977
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9811313666"
                    className="flex-1 p-3 text-xs font-sans font-mono rounded-r-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                  />
                </div>
                {addressErrors.phone && <p className="text-[11px] text-[#ba1a1a] mt-1">{addressErrors.phone}</p>}
              </div>

              {/* Nepali Administrative Hierarchy Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[rgba(226,190,194,0.3)]">
                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Province (प्रदेश) *
                  </label>
                  <select
                    value={selectedProvinceId}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] bg-white focus:border-[#a00041] outline-none cursor-pointer"
                  >
                    {NEPAL_PROVINCES.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name} ({prov.nameNepali})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    District (जिल्ला) *
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] bg-white focus:border-[#a00041] outline-none cursor-pointer"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Palika / Nagarpalika & Dynamic Ward Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Palika / Nagarpalika (नगरपालिका / गाउँपालिका) *
                  </label>
                  <select
                    value={municipality}
                    onChange={(e) => handleMunicipalityChange(e.target.value)}
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] bg-white focus:border-[#a00041] outline-none cursor-pointer"
                  >
                    {currentMunicipalities.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} ({m.wardCount} Wards)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Ward No. (वडा नं.) *
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] bg-white focus:border-[#a00041] outline-none cursor-pointer"
                  >
                    {Array.from({ length: currentWardCount }, (_, i) => i + 1).map((wNum) => (
                      <option key={wNum} value={wNum.toString()}>
                        Ward {wNum} (वडा {wNum})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tole / Street & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Tole / Street Name *
                  </label>
                  <input
                    type="text"
                    value={toleAndStreet}
                    onChange={(e) => setToleAndStreet(e.target.value)}
                    placeholder="e.g. Rangeli Bazaar, Main Road"
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                  />
                  {addressErrors.toleAndStreet && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1">{addressErrors.toleAndStreet}</p>
                  )}
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold text-[#1a1c1b] mb-1">
                    Nearest Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Kali Mandir / Hospital Chowk"
                    className="w-full p-3 text-xs font-sans rounded-xl border border-[rgba(226,190,194,0.8)] focus:border-[#a00041] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041] transition-all shadow-md cursor-pointer mt-4"
              >
                Continue to Order Review →
              </button>
            </form>
          )}

          {/* STEP 2: Order Review & Coupon */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-xl font-bold text-[#1a1c1b] mb-1">
                  2. Review Outfits &amp; Bag Items
                </h2>
                <p className="font-sans text-xs text-[#8e6f74]">
                  Verify selected sizes, colors, and quantities before proceeding to payment
                </p>
              </div>

              {/* Item List */}
              <div className="space-y-4 divide-y divide-[rgba(226,190,194,0.3)]">
                {items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#f4f4f1] flex-shrink-0 border border-[rgba(226,190,194,0.4)]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="font-sans text-sm font-bold text-[#1a1c1b]">{item.name}</h3>
                      <p className="font-sans text-xs text-[#8e6f74]">
                        Qty: {item.quantity} {item.size && `· Size: ${item.size}`} {item.colorName && `· Color: ${item.colorName}`}
                      </p>
                      <p className="font-sans text-xs font-bold text-[#a00041] pt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Box */}
              <div className="p-4 rounded-2xl bg-[#f4f4f1] border border-[rgba(115,92,0,0.18)]">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. PUJA2026)"
                    className="flex-1 px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-xl border border-[rgba(226,190,194,0.8)] bg-white outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-[#735c00] text-white hover:bg-[#574500]"
                  >
                    Apply
                  </button>
                </form>

                {couponError && <p className="text-[11px] text-[#ba1a1a] mt-2 font-semibold">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[11px] text-[#055858] mt-2 font-bold flex items-center gap-1">
                    ✓ {appliedCoupon.message} (-{formatPrice(appliedCoupon.discount)})
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[rgba(226,190,194,0.3)]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-3 px-5 rounded-xl text-xs font-semibold text-[#5a4044] border border-[rgba(115,92,0,0.3)] hover:bg-[#f4f4f1]"
                >
                  ← Edit Address
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3 px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041] shadow-md"
                >
                  Proceed to Payment Gateway →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Nepali Payment Gateways Selection (Fonepay & COD) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-display text-xl font-bold text-[#1a1c1b] mb-1">
                  3. Select Payment Gateway
                </h2>
                <p className="font-sans text-xs text-[#8e6f74]">
                  Instant digital settlement via Fonepay or verified Cash on Delivery across Nepal
                </p>
              </div>

              {/* Gateway Options (Fonepay & COD) */}
              <div className="space-y-3">
                {[
                  {
                    id: 'FONEPAY' as PaymentGatewayType,
                    title: 'Fonepay Dynamic QR',
                    desc: 'Scan on-screen QR with any Nepali Mobile Banking or Digital Wallet App (Global IME, Nabil, NIC Asia, Siddhartha, etc.)',
                    badge: 'Instant Confirmation',
                    icon: '🟥',
                  },
                  {
                    id: 'COD' as PaymentGatewayType,
                    title: 'Cash on Delivery (COD)',
                    desc: 'Pay in cash upon doorstep delivery anywhere across Nepal.',
                    badge: undefined,
                    icon: '💵',
                  },
                ].map((gw) => (
                  <label
                    key={gw.id}
                    onClick={() => setSelectedGateway(gw.id)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedGateway === gw.id
                        ? 'border-[#c81857] bg-[rgba(160,0,65,0.04)] shadow-sm'
                        : 'border-[rgba(226,190,194,0.6)] bg-white hover:border-[#735c00]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-gateway"
                      checked={selectedGateway === gw.id}
                      onChange={() => setSelectedGateway(gw.id)}
                      className="mt-1 accent-[#c81857]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs font-bold text-[#1a1c1b] flex items-center gap-2">
                          <span>{gw.icon}</span>
                          {gw.title}
                        </span>
                        {gw.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(115,92,0,0.1)] text-[#735c00]">
                            {gw.badge}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[11px] text-[#5a4044] mt-1 leading-snug">
                        {gw.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-[rgba(226,190,194,0.3)]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-3 px-5 rounded-xl text-xs font-semibold text-[#5a4044] border border-[rgba(115,92,0,0.3)] hover:bg-[#f4f4f1]"
                >
                  ← Back to Review
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleInitiatePayment}
                  className="flex-1 py-4 px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connecting with Gateway...
                    </>
                  ) : (
                    `Pay ${formatPrice(totalAmount)} & Confirm Order →`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar (5 cols) */}
        <aside className="lg:col-span-5 bg-[#f9f9f6] p-6 md:p-8 rounded-3xl border border-[rgba(115,92,0,0.18)] shadow-sm space-y-6 sticky top-28">
          <h3 className="font-display text-lg font-bold text-[#1a1c1b] pb-3 border-b border-[rgba(226,190,194,0.4)]">
            Order Summary
          </h3>

          {/* Quick Line Items */}
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-xs font-sans gap-2">
                <span className="text-[#1a1c1b] truncate font-medium">
                  {i.quantity}x {i.name}
                </span>
                <span className="font-bold text-[#a00041] flex-shrink-0">
                  {formatPrice(i.price * i.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-2.5 pt-4 border-t border-[rgba(226,190,194,0.4)] text-xs font-sans">
            <div className="flex justify-between text-[#5a4044]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#1a1c1b]">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[#055858] font-bold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#735c00] font-bold">
              <span>All-Nepal Doorstep Delivery</span>
              <span className="uppercase tracking-wider">FREE (रू 0)</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-[rgba(226,190,194,0.4)]">
              <span className="font-bold text-sm text-[#1a1c1b]">Grand Total</span>
              <span className="font-display text-2xl font-bold text-[#a00041]">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="p-4 rounded-2xl bg-white border border-[rgba(226,190,194,0.4)] space-y-2 text-[11px] text-[#5a4044]">
            <p className="flex items-center gap-2 font-bold text-[#735c00]">
              <span>🕊️</span> 100% Authentic Indian Silk &amp; Handloom
            </p>
            <p className="flex items-center gap-2 font-medium">
              <span>✨</span> Handpicked Quality &amp; Genuine Fabric Guarantee
            </p>
            <p className="flex items-center gap-2">
              <span>🚚</span> Free Doorstep Delivery Across Nepal
            </p>
          </div>
        </aside>
      </div>

      {/* Payment Modals */}
      <FonepayQRModal
        isOpen={fonepayModalOpen}
        amountNPR={totalAmount}
        orderId={`PUJA-${Date.now().toString().slice(-4)}`}
        onSuccess={() => {
          setFonepayModalOpen(false);
          finalizeOrder('FONEPAY', 'PAID');
        }}
        onClose={() => setFonepayModalOpen(false)}
      />

      <EmailOtpModal
        isOpen={emailOtpModalOpen}
        email={email}
        customerName={fullName}
        onVerified={() => {
          setEmailOtpModalOpen(false);
          finalizeOrder('COD', 'COD_VERIFIED');
        }}
        onClose={() => setEmailOtpModalOpen(false)}
      />
    </div>
  );
}
