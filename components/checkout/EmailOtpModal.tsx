'use client';

import React, { useState, useEffect } from 'react';

interface EmailOtpModalProps {
  isOpen: boolean;
  email: string;
  customerName?: string;
  onVerified: (verificationToken?: string) => void;
  onClose: () => void;
}

export function EmailOtpModal({
  isOpen,
  email,
  customerName,
  onVerified,
  onClose,
}: EmailOtpModalProps) {
  const [enteredOtp, setEnteredOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState('');

  const sendOtpRequest = async () => {
    setIsSending(true);
    setSendSuccessMessage('');
    setError('');
    try {
      const res = await fetch('/api/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: customerName,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSendSuccessMessage(data.message || `Verification code sent to ${email}`);
      } else {
        setError(data.error || 'Failed to dispatch verification code. Please try again.');
      }
    } catch {
      setError('Network error while requesting verification code.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setEnteredOtp('');
    setError('');
    setCountdown(60);
    sendOtpRequest();

    const interval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, email]);

  if (!isOpen) return null;

  const handleVerify = async () => {
    if (enteredOtp.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: enteredOtp.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onVerified(data.verificationToken);
      } else {
        setError(data.error || 'Incorrect verification code. Please check your inbox and try again.');
      }
    } catch {
      setError('Failed to verify code due to a network issue.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#f9f9f6] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[rgba(115,92,0,0.3)] animate-fade-in-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(226,190,194,0.4)] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#a00041] text-white flex items-center justify-center shadow-sm text-sm font-bold">
              ✉️
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#1a1c1b] leading-none">
                Email OTP Verification
              </h3>
              <span className="text-[10px] text-slate-500 font-sans">
                Cash on Delivery (COD) Security Check
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8e6f74] hover:text-[#1a1c1b] text-base p-1 cursor-pointer">
            ✕
          </button>
        </div>

        {/* Status Prompt */}
        <div className="bg-[#f4f4f1] p-4 rounded-2xl border border-[rgba(115,92,0,0.18)] mb-5 text-center space-y-1.5">
          <p className="font-sans text-xs text-[#5a4044]">
            A 6-digit verification code has been dispatched to:
          </p>
          <p className="font-mono text-sm font-bold text-[#a00041] break-all">
            {email}
          </p>
          {sendSuccessMessage && (
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              {sendSuccessMessage}
            </p>
          )}
        </div>

        {/* 6-Digit Input Box */}
        <div className="mb-4">
          <label className="block text-center text-xs font-bold text-[#735c00] uppercase tracking-wider mb-2">
            Enter 6-Digit Verification Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={enteredOtp}
            onChange={(e) => {
              setEnteredOtp(e.target.value.replace(/\D/g, ''));
              setError('');
            }}
            placeholder="• • • • • •"
            className="w-full py-3.5 text-center font-mono text-2xl font-bold tracking-[0.5em] rounded-2xl border-2 border-[#a00041]/40 bg-white text-[#1a1c1b] focus:border-[#a00041] focus:ring-4 focus:ring-rose-500/15 outline-none shadow-inner"
            autoFocus
          />
        </div>

        {error && (
          <p className="font-sans text-xs text-[#ba1a1a] text-center mb-4 font-semibold">
            ⚠️ {error}
          </p>
        )}

        {/* Resend timer */}
        <div className="flex justify-between items-center text-xs font-sans text-[#8e6f74] mb-5">
          <span>Didn&apos;t receive email?</span>
          {countdown > 0 ? (
            <span>Resend in <strong className="font-mono text-[#a00041]">{countdown}s</strong></span>
          ) : (
            <button
              onClick={() => {
                setCountdown(60);
                sendOtpRequest();
              }}
              disabled={isSending}
              className="text-[#a00041] font-bold hover:underline cursor-pointer"
            >
              {isSending ? 'Sending...' : 'Resend Email Code'}
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isVerifying || enteredOtp.length !== 6}
          className="w-full py-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#a00041] text-white hover:bg-[#800034] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isVerifying ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <span>✓ Verify Email &amp; Place COD Order</span>
          )}
        </button>
      </div>
    </div>
  );
}
