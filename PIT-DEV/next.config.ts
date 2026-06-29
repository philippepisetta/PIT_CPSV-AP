import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/beneficiaries",
        destination: "/accompaniment/beneficiaries",
        permanent: true,
      },
      {
        source: "/journeys",
        destination: "/accompaniment/journeys",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/accompaniment/services",
        permanent: true,
      },
      {
        source: "/activities",
        destination: "/accompaniment/activities",
        permanent: true,
      },
      {
        source: "/communities",
        destination: "/accompaniment/communities",
        permanent: true,
      },
      {
        source: "/consortia",
        destination: "/accompaniment/consortia",
        permanent: true,
      },
      {
        source: "/evidences",
        destination: "/accompaniment/evidences",
        permanent: true,
      },
      {
        source: "/ecosystem-challenges",
        destination: "/challenges",
        permanent: true,
      },
      {
        source: "/strategic/demonstrator",
        destination: "/resilience/demonstrator",
        permanent: true,
      },
      {
        source: "/graph",
        destination: "/intelligence/graph",
        permanent: true,
      },
      {
        source: "/interoperability",
        destination: "/data",
        permanent: true,
      },
      {
        source: "/interoperability/quality",
        destination: "/data/quality",
        permanent: true,
      },
      {
        source: "/interoperability/api-exports",
        destination: "/data/api-exports",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    return [
      {
        source: "/api/v2/:path*",
        destination: `${apiUrl}/api/v2/:path*`,
      },
      {
        source: "/accompaniment/beneficiaries",
        destination: "/beneficiaries",
      },
      {
        source: "/accompaniment/journeys",
        destination: "/journeys",
      },
      {
        source: "/accompaniment/services",
        destination: "/services",
      },
      {
        source: "/accompaniment/activities",
        destination: "/activities",
      },
      {
        source: "/accompaniment/communities",
        destination: "/communities",
      },
      {
        source: "/accompaniment/consortia",
        destination: "/consortia",
      },
      {
        source: "/accompaniment/evidences",
        destination: "/evidences",
      },
      {
        source: "/challenges",
        destination: "/ecosystem-challenges",
      },
      {
        source: "/resilience",
        destination: "/analysis-views/resilience",
      },
      {
        source: "/resilience/demonstrator",
        destination: "/strategic/demonstrator",
      },
      {
        source: "/pilotage",
        destination: "/strategic",
      },
      {
        source: "/pilotage/evidences",
        destination: "/evidences?readOnly=true",
      },
      {
        source: "/intelligence/graph",
        destination: "/graph",
      },
      {
        source: "/data",
        destination: "/interoperability",
      },
      {
        source: "/data/quality",
        destination: "/interoperability/quality",
      },
      {
        source: "/data/api-exports",
        destination: "/interoperability/api-exports",
      },
    ];
  },
};

export default nextConfig;
