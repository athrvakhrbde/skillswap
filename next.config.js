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
  // Configure asset prefixes for production if needed
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  // Configure trailing slashes
  trailingSlash: false,
  // Additional features like static file fallbacks
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          }
        ],
      },
    ]
  },
};

module.exports = nextConfig; 