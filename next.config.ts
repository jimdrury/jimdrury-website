import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/lib/content-security-policy";
import { getStoryblokDraftEnableRedirects } from "./src/lib/storyblok-preview-redirects";

const securityHeaders = buildSecurityHeaders({
  isDevelopment: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  cacheLife: {
    ultraLong: {
      stale: 60 * 60 * 24,
      revalidate: 60 * 60 * 24 * 30,
      expire: 60 * 60 * 24 * 365 * 5,
    },
  },
  experimental: {
    serverComponentsHmrCache: false,
  },
  async headers() {
    return [
      {
        source: "/",
        headers: securityHeaders,
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      ...getStoryblokDraftEnableRedirects(),
      {
        source: "/home",
        destination: "/",
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/blog/:category/:slug.md",
          destination: "/blog/:category/:slug/markdown",
        },
        {
          source: "/blog/:slug",
          has: [{ type: "query", key: "_storyblok" }],
          destination: "/blog/_/:slug",
        },
        {
          source: "/blog",
          has: [{ type: "query", key: "page", value: "(?<page>\\d+)" }],
          destination: "/blog/page/:page",
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
