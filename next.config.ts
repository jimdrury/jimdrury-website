import type { NextConfig } from "next";
import { buildContentSecurityPolicy } from "./src/lib/content-security-policy";
import { getStoryblokDraftEnableRedirects } from "./src/lib/storyblok-preview-redirects";

const contentSecurityPolicy = buildContentSecurityPolicy({
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
  productionBrowserSourceMaps: true,
  experimental: {
    serverComponentsHmrCache: false,
  },
  async headers() {
    const contentSecurityPolicyHeader = {
      key: "Content-Security-Policy",
      value: contentSecurityPolicy,
    };

    return [
      {
        source: "/",
        headers: [contentSecurityPolicyHeader],
      },
      {
        source: "/:path*",
        headers: [contentSecurityPolicyHeader],
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
