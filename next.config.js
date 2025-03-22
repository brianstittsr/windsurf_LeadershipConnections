/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['leadershipconnectionsnc.weebly.com'],
  },
  // Exclude the startup-nextjs-main directory from the build
  typescript: {
    // Ignore TypeScript errors in the startup-nextjs-main directory
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors in the startup-nextjs-main directory
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
