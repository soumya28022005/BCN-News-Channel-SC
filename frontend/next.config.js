const imageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || 'res.cloudinary.com')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.31.205', '10.207.12.107'], 

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;