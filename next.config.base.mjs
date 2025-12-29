/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  turbopack: {
    root: new URL('.', import.meta.url).pathname
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
