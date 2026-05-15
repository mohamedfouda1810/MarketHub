/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any domain for demo purposes, restrict in prod
      },
    ],
  },
};

export default nextConfig;