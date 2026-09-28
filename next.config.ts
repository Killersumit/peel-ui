import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your mobile device to connect to dev resources and HMR
  allowedDevOrigins: [
    "10.45.155.176",
    "10.45.155.176:3000",
    "localhost:3000",
  ],
};

export default nextConfig;