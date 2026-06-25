/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['lotas.local', '192.168.1.7'],
  images: { // Changed "Images" to lowercase "images"
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;