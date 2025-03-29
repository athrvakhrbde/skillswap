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
  
  // Add headers for performance
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Add preconnect headers for Firebase services
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '<https://firestore.googleapis.com>; rel=preconnect; crossorigin, <https://identitytoolkit.googleapis.com>; rel=preconnect; crossorigin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 