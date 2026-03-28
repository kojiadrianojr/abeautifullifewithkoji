import type { NextConfig } from 'next';

// Use NEXT_PUBLIC_BASE_PATH from environment or default to '/abeautifullifewithkoji' for production
const basePath = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_BASE_PATH || '/abeautifullifewithkoji')
  : '';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
  },
  // Required for GitHub Pages deployment at https://kojiadrianojr.github.io/abeautifullifewithkoji/
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
