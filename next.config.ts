import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: "/blog/:slug",
        has: [
          { type: "query", key: "_storyblok" },
          { type: "query", key: "_storyblok_tk[space_id]" },
          { type: "query", key: "_storyblok_tk[timestamp]" },
          { type: "query", key: "_storyblok_tk[token]" },
        ],
        missing: [{ type: "query", key: "returnTo" }],
        destination: "/api/storyblok/enable-draft?returnTo=/blog/:slug",
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
          destination: "/blog/read/:slug",
        },
        {
          source: "/blog/:slug/opengraph-image",
          destination: "/blog/read/:slug/opengraph-image",
        },
        {
          source: "/blog/:slug.md",
          destination: "/blog/read/:slug.md",
        },
        {
          source: "/blog/:category/:slug.md",
          destination: "/blog/read/:slug.md?category=:category",
        },
        {
          source: "/blog/:slug/twitter-image",
          destination: "/blog/read/:slug/twitter-image",
        },
        {
          source: "/blog/:category/:slug/opengraph-image",
          destination: "/blog/read/:slug/opengraph-image",
        },
        {
          source: "/blog/:category/:slug/twitter-image",
          destination: "/blog/read/:slug/twitter-image",
        },
        {
          source: "/blog/:year(\\d{4})",
          destination: "/blog/date/:year",
        },
        {
          source: "/blog/:year(\\d{4})/:month(\\d{2})",
          destination: "/blog/date/:year/:month",
        },
        {
          source: "/blog/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})",
          destination: "/blog/date/:year/:month/:day",
        },
        {
          source: "/blog/:category/:slug",
          destination: "/blog/read/:slug",
        },
      ],
      afterFiles: [
        {
          source: "/blog/:category",
          destination: "/blog/category/:category",
        },
      ],
      fallback: [],
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
