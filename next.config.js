/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  output: 'standalone',
  images: {
    unoptimized: false,
    remotePatterns: [],
  },
  async rewrites() {
    return [
      {
        source: '/api/orbit/:path*',
        destination: 'http://114.205.56.204:9001/orbit/:path*',
      },
    ];
  },
}

module.exports = nextConfig
