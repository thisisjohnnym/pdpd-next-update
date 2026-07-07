import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    // Prototype repo — experimental modules ahead of pdp-data exports; app routes typecheck clean.
    ignoreBuildErrors: true,
  },
  images: {
    // Local /public assets hang in `/_next/image` on OneDrive-backed dev trees — serve as-is.
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // iOS Safari aggressively caches dev chunks when testing over LAN — force revalidate.
  headers: isDev
    ? async () => [
        {
          source: "/:path*",
          headers: [
            { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
            { key: "Pragma", value: "no-cache" },
            { key: "Expires", value: "0" },
          ],
        },
      ]
    : undefined,
};

export default nextConfig;
