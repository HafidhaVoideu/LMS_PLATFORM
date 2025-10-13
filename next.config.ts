import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        hostname: "sofia-lms.t3.storage.dev",
        port: "",
        protocol: "https",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
