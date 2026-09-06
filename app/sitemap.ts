import { MetadataRoute } from 'next';
import { mockProducts } from '@/lib/mock/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://pujacollection.com.np';

  // Static routes
  const staticRoutes = [
    '',
    '/sarees',
    '/lehengas',
    '/kurtis-suits',
    '/heritage',
    '/track-order',
    '/checkout',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic Product routes
  const productRoutes = mockProducts.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
