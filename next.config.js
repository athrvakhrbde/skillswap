/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: false,
  },
  // Setting output to export for Netlify
  output: 'export',
  // Disable trailing slashes
  trailingSlash: false,
  // Add custom rewrites for client-side routing
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/messages/:id',
        destination: '/messages/[id]',
      },
    ];
  },
};

module.exports = nextConfig; 