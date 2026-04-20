import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "aristarhstudio.org",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "aristarhstudio.org",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.aristarhstudio.org",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
