import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getAllArticles } from "@/storyblok/blog-listings";
import { buildBlogSitemap } from "./_helpers/build-blog-sitemap";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  await connection();
  const stories = await getAllArticles("published");
  return buildBlogSitemap(stories);
};

export default sitemap;
