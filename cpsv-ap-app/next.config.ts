import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Utilisation de l'URL du backend Express de Render en production par défaut si non définie dans Vercel
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pit-cpsv-ap.onrender.com";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
