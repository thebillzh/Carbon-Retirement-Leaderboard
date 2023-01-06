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
        destination: "https://api.i.loli.co/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
