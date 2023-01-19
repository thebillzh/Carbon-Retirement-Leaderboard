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
        source: "/p/:path*",
        destination: "https://external.loli.co/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
