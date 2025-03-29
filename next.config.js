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
  // Use the Next.js serverless mode for Netlify
  // output: 'export',
  // Disable trailing slashes
  trailingSlash: false,
};

module.exports = nextConfig; 