/** @type {import('next').NextConfig} */

const remotePatterns = [
  {
    protocol: "https",
    hostname: "cdn.sanity.io",
    port: "",
  },
  {
    protocol: "http",
    hostname: "localhost",
  },
  {
    protocol: "https",
    hostname: "leadershipconnectionsnc.weebly.com",
  },
  {
    protocol: "https",
    hostname: "via.placeholder.com",
  },
];

// Add the Vercel deployment URL to the list of allowed domains
if (process.env.VERCEL_URL) {
  remotePatterns.push({
    protocol: "https",
    hostname: process.env.VERCEL_URL,
  });
}

const nextConfig = {
  images: {
    remotePatterns,
    // Disable optimization for local images to handle large files
    unoptimized: process.env.NODE_ENV === 'development',
    // Increase image size limits
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Set format to handle various image types
    formats: ['image/webp', 'image/avif'],
  },
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
