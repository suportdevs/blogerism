const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: { unoptimized: true },
  // Serve uploaded media from the same origin as the site so stored "/uploads/..." paths work everywhere.
  async rewrites() {
    return [{ source: '/uploads/:path*', destination: `${API_URL}/uploads/:path*` }];
  },
};
