import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    return [
      {
        source: "/api/users/:path*",
        destination: `${backendUrl}/users/:path*`,
      },
      {
        source: "/api/products/:path*",
        destination: `${backendUrl}/products/:path*`,
      },
      {
        source: "/api/orders/:path*",
        destination: `${backendUrl}/orders/:path*`,
      },
    ];
  },
};

export default nextConfig;
