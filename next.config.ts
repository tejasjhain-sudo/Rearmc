import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "mc-heads.net" },
      { protocol: "https", hostname: "crafatar.com" },
      { protocol: "https", hostname: "cravatar.eu" },
    ],
  },
};

export default nextConfig;
