/** @type {import('next').NextConfig} */
const nextConfig = {
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
        destination: `${process.env.API_PROXY_TARGET || 'http://114.205.56.204:9001'}/orbit/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
