import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CATEGORIES_META } from '@/lib/mock/categories';
import { getProductsByCategoryFromDb, getAllProductsFromDb } from '@/lib/db/productsDb';
import { CategoryHeader } from '@/components/catalog/CategoryHeader';
import { ProductCatalogView } from '@/components/catalog/ProductCatalogView';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORIES_META[category];

  if (!meta) {
    return {
      title: 'Catalog | Puja Collection',
    };
  }

  return {
    title: `${meta.name} | Puja Collection`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const meta = CATEGORIES_META[category];

  // If not a recognized category route, 404
  if (!meta) {
    // If it's a known route like favicon, ignore, else notFound
    if (category === 'favicon.ico' || category.startsWith('_')) {
      notFound();
    }
    notFound();
  }

  const products = category === 'collections'
    ? await getAllProductsFromDb()
    : await getProductsByCategoryFromDb(category);

  return (
    <div>
      {/* Category Editorial Hero */}
      <CategoryHeader category={meta} totalCount={products.length} />

      {/* Catalog & Faceted Filters */}
      <ProductCatalogView initialProducts={products} categorySlug={category} />
    </div>
  );
}
