import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  productionBrowserSourceMaps: true,
  experimental: {
    serverComponentsHmrCache: false,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          { type: "query", key: "_storyblok" },
          { type: "query", key: "_storyblok_tk[space_id]" },
          { type: "query", key: "_storyblok_tk[timestamp]" },
          { type: "query", key: "_storyblok_tk[token]" },
        ],
        missing: [
          { type: "query", key: "returnTo" },
          { type: "cookie", key: "__prerender_bypass" },
        ],
        destination: "/api/storyblok/enable-draft?returnTo=/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/blog/:slug",
          has: [{ type: "query", key: "_storyblok" }],
          destination: "/blog/_/:slug",
        },
        {
          source: "/:key.txt",
          destination: "/api/indexnow?key=:key",
        },
        {
          source: "/",
          destination: "/home",
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
