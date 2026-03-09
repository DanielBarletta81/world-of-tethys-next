/** @type {import('next').NextConfig} */
function normalizeBaseUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol);
  } catch {
    return null;
  }
}

const cdnCandidates = [
  process.env.NEXT_PUBLIC_CDN_DIST,
  process.env.NEXT_PUBLIC_CDN_BASE,
  process.env.CLOUDFRONT_URL,
].map(normalizeBaseUrl).filter(Boolean);

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
  {
    protocol: 'https',
    hostname: 'world-of-tethys-site.s3.us-east-1.amazonaws.com',
  },
  ...cdnCandidates.map((url) => ({
    protocol: url.protocol.replace(':', ''),
    hostname: url.hostname,
    pathname: '/**',
  })),
];

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
