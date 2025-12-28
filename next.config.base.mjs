/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.dcbarletta.com'
      }
    ]
  }
};

export default nextConfig;
