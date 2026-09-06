'use client';

import React, { useEffect } from 'react';

interface ConfirmDialogModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  itemType?: 'coupon' | 'product' | 'item' | 'order';
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialogModal({
  isOpen,
  title = 'Confirm Deletion',
  itemName,
  itemType = 'item',
  message,
  confirmLabel = 'Yes, Delete Permanently',
  cancelLabel = 'Cancel',
  isDangerous = true,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glowing Background Accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top Icon Badge */}
        <div className="flex items-center justify-center mb-5">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/15 to-rose-500/5 border border-rose-200/80 flex items-center justify-center shadow-inner">
            <span className="text-3xl animate-bounce">🗑️</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-2.5 mb-6">
          <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
            {title}
          </h3>

          {itemName ? (
            <div className="py-2">
              <p className="text-xs text-slate-500 mb-1.5 font-sans">
                Are you sure you want to remove this {itemType}?
              </p>
              <div className="inline-block px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 font-mono text-sm font-bold text-rose-700 shadow-sm break-all">
                {itemName}
              </div>
            </div>
          ) : null}

          <p className="font-sans text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            {message ||
              'This action cannot be undone. All associated data will be permanently removed from the store database.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-sans text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-sans text-xs font-bold text-white transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${
              isDangerous
                ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-500/25'
                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-amber-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
