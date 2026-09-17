import type { MetadataRoute } from "next";
import { getStaticPagePath, SITE_ORIGIN } from "@/lib/seo";

export const buildSiteSitemap = (
  params: { slug: string[] }[],
): MetadataRoute.Sitemap => {
  return params.map(({ slug }) => {
    const path = getStaticPagePath(slug);
    const isHome = path === "/";

    return {
      url: `${SITE_ORIGIN}${path}`,
      changeFrequency: isHome ? "weekly" : "monthly",
      priority: isHome ? 1 : 0.9,
    };
  });
};
