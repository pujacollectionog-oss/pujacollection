import React from 'react';
import type { Metadata } from 'next';
import { getProductBySlugFromDb, getAllProductsFromDb } from '@/lib/db/productsDb';
import { ProductDetailPageView } from '@/components/pdp/ProductDetailPageView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromDb(slug);

  if (!product) {
    return { title: 'Product Details | Puja Collection' };
  }

  return {
    title: `${product.name} | Puja Collection`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0]?.url || '/images/hero-lehenga.jpg' }],
    },
  };
}

export async function generateStaticParams() {
  const products = await getAllProductsFromDb();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlugFromDb(slug);

  return <ProductDetailPageView initialProduct={product} slug={slug} />;
}
