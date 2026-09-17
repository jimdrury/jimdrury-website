import type { MetadataRoute } from "next";
import { getPublishedPageParams } from "@/lib/published-pages";
import { buildSiteSitemap } from "./_helpers/build-site-sitemap";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const params = await getPublishedPageParams();
  return buildSiteSitemap(params);
};

export default sitemap;
