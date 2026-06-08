import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Only proxy to the Express server if NEXT_PUBLIC_API_URL is explicitly set
    // (e.g. for local dev with a running Express server on port 3001).
    // On Vercel (no Express), the Next.js API Routes in /app/api/ handle everything directly.
    if (!apiUrl) {
      return [];
    }
    return [
      {
        // Proxy only routes that do NOT have a native Next.js Route Handler
        // (services, meta, graph, recommender, journeys, companies)
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
        // Exclude native routes handled by Next.js
        missing: [
          { type: "header", key: "x-skip-rewrite" },
        ],
      },
    ];
  },
};

export default nextConfig;
