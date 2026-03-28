import type { NextConfig } from 'next';

// Only use basePath if explicitly set via environment variable
// For custom domains: don't set NEXT_PUBLIC_BASE_PATH (or set to empty string)
// For GitHub Pages subdirectory: set NEXT_PUBLIC_BASE_PATH=/abeautifullifewithkoji
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
  },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
