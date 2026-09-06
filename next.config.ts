import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Allow locally hosted images in /public
    localPatterns: [
      {
        pathname: '/images/**',
        search: '',
      },
      {
        pathname: '/uploads/**',
        search: '',
      },
    ],
    // Remote images & CDN support
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
