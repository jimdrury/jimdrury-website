import type { NextConfig } from "next";

const DRAFT_COOKIE_NAME = "__prerender_bypass";
const CURRENT_PREVIEW_MODE_ID = process.env.__NEXT_PREVIEW_MODE_ID;

const draftCookieCondition = {
  type: "cookie" as const,
  key: DRAFT_COOKIE_NAME,
  ...(CURRENT_PREVIEW_MODE_ID ? { value: CURRENT_PREVIEW_MODE_ID } : {}),
};

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  async redirects() {
    return [
      {
        source: "/blog/:slug",
        has: [{ type: "query", key: "_storyblok" }],
        missing: [draftCookieCondition, { type: "query", key: "returnTo" }],
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
          has: [{ type: "query", key: "_storyblok" }, draftCookieCondition],
          destination: "/blog/read/:slug",
        },
        {
          source: "/blog/:slug/opengraph-image",
          destination: "/blog/read/:slug/opengraph-image",
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
        {
          source: "/blog/:category",
          destination: "/blog/category/:category",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  typescript: {
    tsconfigPath: "tsconfig.build.json",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
      },
    ],
  },
};

export default nextConfig;
