import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return [
      {
        source: "/api/v2/:path*",
        destination: `${apiUrl}/api/v2/:path*`,
      },
    ];
  },
};

export default nextConfig;
