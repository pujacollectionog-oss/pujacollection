import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { StoreLayoutShell } from '@/components/layout/StoreLayoutShell';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  title: {
    default: 'Puja Collection — Luxury Indian Ethnic Wear in Nepal',
    template: '%s | Puja Collection',
  },
  description:
    'Nepal\'s premier destination for authentic Indian ethnic wear — Banarasi silk sarees, bridal lehengas, handloom anarkalis & festive kurtis. Located in Rangeli-7, Morang. Fonepay & Cash on Delivery. Free delivery all over Nepal.',
  keywords: [
    'Indian ethnic wear Nepal',
    'Banarasi silk saree Nepal',
    'bridal lehenga Nepal',
    'Kanjivaram saree Nepal',
    'anarkali suit Nepal',
    'Rangeli Morang ethnic boutique',
    'Fonepay COD payment Nepal',
    'Indian wedding dress Nepal',
    'Puja Collection',
  ],
  authors: [{ name: 'Puja Collection' }],
  creator: 'Puja Collection Pvt. Ltd.',
  metadataBase: new URL('https://pujacollection.com.np'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pujacollection.com.np',
    siteName: 'Puja Collection',
    title: 'Puja Collection — Luxury Indian Ethnic Wear in Nepal',
    description:
      'Authentic Banarasi silks, bridal lehengas & artisan-crafted ensembles — Rangeli-7, Morang, Nepal. Free delivery across Nepal.',
    images: [
      {
        url: '/images/hero-lehenga.jpg',
        width: 1280,
        height: 720,
        alt: 'Puja Collection — Luxury Indian Ethnic Wear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Puja Collection — Luxury Indian Ethnic Wear in Nepal',
    description:
      'Authentic Banarasi silks, bridal lehengas & artisan-crafted ensembles — delivered across Nepal.',
    images: ['/images/hero-lehenga.jpg'],
  },
  icons: {
    icon: [
      { url: '/images/logo.jpg' },
      { url: '/images/logo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/images/logo.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
    shortcut: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne" className={`scroll-smooth ${bricolage.variable}`}>
      <body className={`${bricolage.className} min-h-screen flex flex-col relative`}>
        <StoreLayoutShell>{children}</StoreLayoutShell>
      </body>
    </html>
  );
}
