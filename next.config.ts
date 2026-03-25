import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from local uploads
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
