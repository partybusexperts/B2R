// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    deviceSizes: [360, 640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 512],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.scdn.co" }, // spotify covers
      {
        protocol: "https",
        hostname: "scnmubytflrxvokmrfnc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    const POLL_TARGET = process.env.POLL_TARGET;
    if (!POLL_TARGET) return [];
    return [{ source: "/api/poll/:path*", destination: `${POLL_TARGET}/api/poll/:path*` }];
  },
};

export default nextConfig;
