import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/webp', 'image/avif'],
  },
  // basePath and assetPrefix are not needed when using custom domain
  // Only uncomment these if deploying to a subdirectory (e.g., github.io/repo-name)
  // basePath: process.env.NODE_ENV === 'production' ? '/repo-name' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/repo-name' : '',
};

export default nextConfig;
