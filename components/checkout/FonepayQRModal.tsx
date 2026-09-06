'use client';

import React, { useState, useEffect } from 'react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { generateFonepayQR } from '@/lib/payment/fonepay';

interface FonepayQRModalProps {
  isOpen: boolean;
  amountNPR: number;
  orderId: string;
  onSuccess: (traceId?: string) => void;
  onClose: () => void;
}

export function FonepayQRModal({
  isOpen,
  amountNPR,
  orderId,
  onSuccess,
  onClose,
}: FonepayQRModalProps) {
  const { formatPrice } = useCurrencyStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(300); // 5 min countdown
  const [txReference, setTxReference] = useState('');
  const [qrData, setQrData] = useState(() => generateFonepayQR(amountNPR, orderId));

  useEffect(() => {
    if (!isOpen) return;
    setQrData(generateFonepayQR(amountNPR, orderId));
    setTimer(300);
    setTxReference('');
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, amountNPR, orderId]);

  if (!isOpen) return null;

  const minutes = Math.floor(timer / 60);
  const seconds = (timer % 60).toString().padStart(2, '0');

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(txReference.trim() || qrData.traceId);
    }, 1200);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#f9f9f6] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[rgba(115,92,0,0.3)] animate-fade-in-up flex flex-col items-center text-center max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fonepay Official Header */}
        <div className="flex items-center justify-between w-full pb-4 border-b border-[rgba(226,190,194,0.4)] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b71c1c] text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
              f
            </div>
            <div className="text-left">
              <span className="font-display text-base font-bold text-[#1a1c1b] block leading-none">
                Fonepay Dynamic QR
              </span>
              <span className="text-[10px] text-slate-500 font-sans">
                Nepal&apos;s National Payment Gateway
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8e6f74] hover:text-[#1a1c1b] text-base p-1 cursor-pointer">
            ✕
          </button>
        </div>

        {/* Merchant & Amount Details */}
        <div className="w-full bg-white p-3 rounded-2xl border border-slate-200 mb-4 shadow-sm">
          <p className="font-sans text-[11px] font-bold text-[#735c00] tracking-wider uppercase">
            {qrData.merchantName}
          </p>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-[#a00041] my-0.5">
            {formatPrice(amountNPR)}
          </h3>
          <p className="font-sans text-[11px] text-slate-500 font-mono">
            Trace: {qrData.traceId} · Ref: #{orderId}
          </p>
        </div>

        {/* Dynamic QR Display Canvas */}
        <div className="relative p-4 bg-white rounded-2xl border-2 border-slate-300 shadow-inner mb-4">
          <div className="w-48 h-48 bg-[#fafafa] flex flex-col items-center justify-center border border-gray-200 relative overflow-hidden rounded-xl">
            {/* Standard QR Corner Markers */}
            <div className="absolute top-2 left-2 w-8 h-8 border-4 border-[#1a1c1b] rounded-sm flex items-center justify-center bg-white">
              <div className="w-3.5 h-3.5 bg-[#1a1c1b]" />
            </div>
            <div className="absolute top-2 right-2 w-8 h-8 border-4 border-[#1a1c1b] rounded-sm flex items-center justify-center bg-white">
              <div className="w-3.5 h-3.5 bg-[#1a1c1b]" />
            </div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-4 border-[#1a1c1b] rounded-sm flex items-center justify-center bg-white">
              <div className="w-3.5 h-3.5 bg-[#1a1c1b]" />
            </div>

            {/* Center Fonepay Badge */}
            <div className="w-10 h-10 rounded-full bg-[#b71c1c] text-white flex items-center justify-center font-bold text-base shadow-md border-2 border-white z-10">
              f
            </div>

            {/* Procedural QR Pattern */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, #000 0, #000 3px, transparent 0, transparent 7px), repeating-linear-gradient(90deg, #000 0, #000 3px, transparent 0, transparent 7px)',
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-sans font-bold text-[#055858]">
            <span className="w-2 h-2 rounded-full bg-[#055858] animate-ping" />
            Scan with any Mobile Banking App
          </div>
        </div>

        {/* Supported Apps List */}
        <p className="text-[10px] text-slate-500 max-w-xs mb-3">
          Compatible with <strong>eSewa, Khalti, Global Smart, NIC Asia, Nabil, Sanima</strong> &amp; 50+ Nepali banking apps.
        </p>

        {/* Timer */}
        <p className="font-sans text-xs text-[#5a4044] mb-4">
          QR Code expires in: <strong className="text-[#a00041] font-mono text-sm">{minutes}:{seconds}</strong>
        </p>

        {/* Optional Bank Reference Input */}
        <div className="w-full mb-4 text-left">
          <label className="block text-[11px] font-bold text-slate-600 mb-1">
            Bank Transaction ID / Remarks (Optional)
          </label>
          <input
            type="text"
            value={txReference}
            onChange={(e) => setTxReference(e.target.value)}
            placeholder="e.g. FNP-98412 or Bank Ref No."
            className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-300 bg-white focus:border-[#b71c1c] focus:ring-2 focus:ring-rose-500/15 outline-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={isProcessing || timer <= 0}
          className="w-full py-3.5 px-6 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#b71c1c] text-white hover:bg-[#8e1414] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying Transaction with Fonepay...
            </>
          ) : timer <= 0 ? (
            'QR Expired (Please Reload)'
          ) : (
            '✓ Confirm & Complete Payment'
          )}
        </button>
      </div>
    </div>
  );
}
