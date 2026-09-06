'use client';

import React, { useState, useEffect } from 'react';

interface SmsOtpModalProps {
  isOpen: boolean;
  phone: string;
  expectedOtp: string;
  onVerified: () => void;
  onClose: () => void;
}

export function SmsOtpModal({
  isOpen,
  phone,
  expectedOtp,
  onVerified,
  onClose,
}: SmsOtpModalProps) {
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState('');
  const [showSmsBanner, setShowSmsBanner] = useState(true);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!isOpen) return;
    setEnteredOtp('');
    setError('');
    setShowSmsBanner(true);
    setCountdown(60);

    const interval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = () => {
    if (enteredOtp.trim() === expectedOtp.trim()) {
      onVerified();
    } else {
      setError('Invalid 6-digit OTP code. Please check your SMS and try again.');
    }
  };

  const handleAutoFill = () => {
    setEnteredOtp(expectedOtp);
    setError('');
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#f9f9f6] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[rgba(115,92,0,0.3)] animate-fade-in-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(226,190,194,0.4)] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📱</span>
            <h3 className="font-display text-base font-bold text-[#1a1c1b]">
              Cash on Delivery (COD) OTP Guard
            </h3>
          </div>
          <button onClick={onClose} className="text-[#8e6f74] hover:text-[#1a1c1b] text-base">
            ✕
          </button>
        </div>

        {/* Simulated Incoming SMS Push Banner */}
        {showSmsBanner && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#1a1c1b] text-white shadow-lg border border-[rgba(233,195,73,0.4)] animate-slide-in-right">
            <div className="flex items-center justify-between text-[10px] text-[#e9c349] font-bold uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1.5">
                <span>💬 Sparrow SMS API</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
              </span>
              <span>Just now</span>
            </div>
            <p className="font-sans text-xs text-[#f1f1ee] leading-relaxed">
              Your Puja Collection COD verification code is: <strong className="text-[#fed65b] font-mono text-sm tracking-widest">{expectedOtp}</strong>. Valid for 5 mins.
            </p>
            <button
              onClick={handleAutoFill}
              className="mt-2 text-[11px] font-bold text-[#fed65b] hover:underline flex items-center gap-1"
            >
              ⚡ Click to Auto-fill Code ({expectedOtp})
            </button>
          </div>
        )}

        <p className="font-sans text-xs text-[#5a4044] mb-4 text-center">
          We have dispatched an SMS OTP to <strong className="text-[#1a1c1b] font-mono">+977 {phone}</strong>. Enter the 6-digit verification code below to confirm your order.
        </p>

        {/* 6-Digit Input */}
        <div className="mb-4">
          <input
            type="text"
            maxLength={6}
            value={enteredOtp}
            onChange={(e) => {
              setEnteredOtp(e.target.value);
              setError('');
            }}
            placeholder="• • • • • •"
            className="w-full py-3 text-center font-mono text-2xl font-bold tracking-[0.5em] rounded-xl border border-[rgba(115,92,0,0.4)] bg-white text-[#1a1c1b] focus:border-[#a00041] outline-none"
            autoFocus
          />
        </div>

        {error && (
          <p className="font-sans text-xs text-[#ba1a1a] text-center mb-4 font-semibold">
            {error}
          </p>
        )}

        <div className="flex justify-between items-center text-xs font-sans text-[#8e6f74] mb-5">
          <span>Didn&apos;t receive SMS?</span>
          {countdown > 0 ? (
            <span>Resend in {countdown}s</span>
          ) : (
            <button onClick={() => setCountdown(60)} className="text-[#a00041] font-bold hover:underline">
              Resend OTP
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#c81857] text-white hover:bg-[#a00041] transition-all shadow-md cursor-pointer"
        >
          Verify OTP &amp; Place COD Order
        </button>
      </div>
    </div>
  );
}
