import type { Metadata } from 'next';
import { HeroCanvas } from '@/components/home/HeroCanvas';
import { BentoGrid } from '@/components/home/BentoGrid';
import { SignaturePiecesTabs } from '@/components/home/SignaturePiecesTabs';
import { HeritageStory } from '@/components/home/HeritageStory';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Puja Collection — Luxury Indian Ethnic Wear in Nepal',
  description:
    "Nepal's premier boutique for authentic Indian ethnic wear in Rangeli-7, Morang. Shop Banarasi silk sarees, bridal lehengas, Chikankari anarkalis & festive kurtis. Fonepay & Cash on Delivery. Free delivery all over Nepal.",
};

export default function HomePage() {
  return (
    <>
      {/* Full-viewport editorial hero */}
      <HeroCanvas />

      {/* Editorial bento grid — curated collections */}
      <BentoGrid />

      {/* Tabbed product showcase */}
      <SignaturePiecesTabs />

      {/* Heritage storytelling section */}
      <HeritageStory />
    </>
  );
}
