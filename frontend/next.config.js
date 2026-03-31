const imageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || 'res.cloudinary.com')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
