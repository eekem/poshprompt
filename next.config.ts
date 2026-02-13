import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'poshprompt.com',
      // },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
