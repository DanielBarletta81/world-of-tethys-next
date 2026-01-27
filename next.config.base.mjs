/** @type {import('next').NextConfig} */
const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE;
let cdnPattern = null;

try {
  if (cdnBase) {
    const url = new URL(cdnBase);
    cdnPattern = {
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      pathname: '/**',
    };
  }
} catch {
  cdnPattern = null;
}

const remotePatterns = [
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
];

if (cdnPattern) {
  remotePatterns.push(cdnPattern);
}

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns,
  },
  // Ensure we can handle the distinct styling modules without conflict
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
// World of Tethys || D.C. Barletta
