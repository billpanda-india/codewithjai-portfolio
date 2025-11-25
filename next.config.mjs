/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'irhsqcvxyovpvquslzki.supabase.co',
      },
    ],
    unoptimized: false,
  },
  async headers() {
    return [
      {
        // Allow homepage to be embedded in iframes (for project previews)
        source: '/',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *",
          },
        ],
      },
      {
        // Block all other pages from being embedded
        source: '/:path((?!$).*)*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
