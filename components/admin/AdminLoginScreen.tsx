'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { STORE_ADDRESS, STORE_PHONE_DISPLAY } from '@/lib/nepal-address';

interface AdminLoginScreenProps {
  onSuccess: () => void;
}

export function AdminLoginScreen({ onSuccess }: AdminLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Invalid credentials. Access denied.');
      }
    } catch {
      setError('Unable to reach authentication service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1c1b] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gold Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[rgba(233,195,73,0.05)] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[rgba(190,18,60,0.06)] blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-amber-500/20 relative z-10 animate-fade-in-up space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-md border border-amber-200 bg-[#fdfbf5]">
            <Image
              src="/images/logo.png"
              alt="Puja Collection Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <span className="label-sm text-[#b45309] block mb-1">Restricted Access</span>
            <h1 className="font-display text-2xl font-bold text-[#0f172a]">
              Store Operations Portal
            </h1>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Puja Collection · 📍 {STORE_ADDRESS}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] mb-1.5">
              Manager Email or Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pujacollection.com.np"
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:border-[#be123c] focus:ring-2 focus:ring-rose-500/15 outline-none font-sans"
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-bold text-[#b45309] hover:underline"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:border-[#be123c] focus:ring-2 focus:ring-rose-500/15 outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-[#be123c] text-white hover:bg-[#9f1239] transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <span>🔒 Authenticate &amp; Access Dashboard</span>
            )}
          </button>
        </form>

        {/* Back to storefront link */}
        <div className="text-center pt-1">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium"
          >
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
