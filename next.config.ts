import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your mobile device to connect to dev resources and HMR
  allowedDevOrigins: [
    "10.45.155.176",
    "10.45.155.176:3000",
    "localhost:3000",
  ],
  async redirects() {
    return [
      {
        source: "/r/tactile-pin-field.json",
        destination: "/r/tactile-otp-input.json",
        permanent: true,
      },
      {
        source: "/components/tactile-pin-field",
        destination: "/components/tactile-otp-input",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;