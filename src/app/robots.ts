import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo";

const SITEMAP_URLS = [
  `${SITE_ORIGIN}/sitemap.xml`,
  `${SITE_ORIGIN}/blog/sitemap.xml`,
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      {
        userAgent: "*",
        allow: "/",
        // Keep internal endpoints and private URLs out of search results.
        disallow: ["/api/", "/private/", "/draft/"],
      },
    ],
    sitemap: SITEMAP_URLS,
    host: SITE_ORIGIN,
  };
}
