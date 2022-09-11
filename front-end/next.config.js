/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: "https://api-go.toucanleader.xyz/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
