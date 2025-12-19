/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.rtaservices.net',
      },
    ],
  },
}

module.exports = nextConfig

