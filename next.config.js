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
  // Output static files instead of using server rendering
  // Comment this out to use serverless functions with Netlify
  // output: 'export',
  
  // Environment variables
  env: {
    // Set a dummy Firebase API key for build time
    // This prevents Firebase initialization errors during build
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key-for-build',
  },
  
  // Disable trailing slashes
  trailingSlash: false,
};

module.exports = nextConfig; 