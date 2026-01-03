/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Auth Avatars
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub Auth Avatars
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com', // WordPress Gravatars
      },
    ],
  },
  // Ensure we can handle the distinct styling modules without conflict
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;