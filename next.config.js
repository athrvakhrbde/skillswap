/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
  },
  // Output is handled by the Netlify plugin, so don't specify output: 'export'
  
  // Environment variables
  env: {
    // Set a dummy Firebase API key for build time
    // This prevents Firebase initialization errors during build
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key-for-build',
  },
  
  // Disable trailing slashes
  trailingSlash: false,
  
  // We're not using headers in next.config.js because they don't work with static export
  // Instead, we configure these in vercel.json or netlify.toml
};

module.exports = nextConfig; 