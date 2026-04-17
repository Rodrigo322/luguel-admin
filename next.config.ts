import type { NextConfig } from "next";

const backendOrigin = process.env.BACKEND_ORIGIN ?? "http://localhost:3333";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`
      },
      {
        source: "/api/auth/:path*",
        destination: `${backendOrigin}/api/auth/:path*`
      }
    ];
  }
};

export default nextConfig;
