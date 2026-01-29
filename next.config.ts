import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hair-rent.co.za",
      },
      {
        protocol: "https",
        hostname: "www.hair-rent.co.za",
      },
    ],
  },
};

export default nextConfig;
