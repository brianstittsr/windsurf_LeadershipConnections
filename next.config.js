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
