/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
    },
  },
};
module.exports = nextConfig;
