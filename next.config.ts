import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
