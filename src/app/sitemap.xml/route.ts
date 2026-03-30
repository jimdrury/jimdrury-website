import { SITE_ORIGIN } from "@/lib/seo";

const SITEMAP_URLS = [
  `${SITE_ORIGIN}/site/sitemap.xml`,
  `${SITE_ORIGIN}/blog/sitemap.xml`,
];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_URLS.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
