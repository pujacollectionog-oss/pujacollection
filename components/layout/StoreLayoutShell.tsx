'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

interface StoreLayoutShellProps {
  children: React.ReactNode;
}

export function StoreLayoutShell({ children }: StoreLayoutShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/atelier-dashboard');

  if (isAdminRoute) {
    // Render clean, distraction-free admin view without storefront navigation
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800">
        {children}
      </div>
    );
  }

  // Regular Storefront Layout
  return (
    <>
      {/* Announcement bar */}
      <AnnouncementBar />

      {/* Sticky glassmorphic navbar */}
      <Navbar />

      {/* Cart drawer — portal-level */}
      <CartDrawer />

      {/* Page content */}
      <main id="main-content" className="flex-1 w-full max-w-full overflow-x-hidden">
        {children}
      </main>

      {/* Fixed Floating WhatsApp Redirection Button */}
      <WhatsAppButton />

      {/* Footer */}
      <Footer />
    </>
  );
}
