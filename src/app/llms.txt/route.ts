import "server-only";

import { SITE_NAME, SITE_ORIGIN } from "@/lib/seo";

const LLMSTXT_CONTENT = [
  `# ${SITE_NAME}`,
  "",
  "> Personal website and technology blog by Jim Drury.",
  "",
  "## Crawler guidance",
  "# Allow crawling of all public blog content",
  "Allow: /blog/*",
  "Allow: /",
  "Allow: /about",
  "Allow: /projects",
  "",
  "# Disallow crawling of system paths",
  "Disallow: /api/",
  "Disallow: /private/",
  "Disallow: /draft/",
  "Disallow: /.env",
  "Disallow: /node_modules/",
  "",
  "## Primary content map",
  "# Sitemap location",
  `- Sitemap index: ${SITE_ORIGIN}/sitemap.xml`,
  `- Blog sitemap: ${SITE_ORIGIN}/blog/sitemap.xml`,
  `- Blog index: ${SITE_ORIGIN}/blog`,
  "",
  "## Structured sources",
  `- robots.txt: ${SITE_ORIGIN}/robots.txt`,
  "",
  "## Markdown article format",
  `- Preferred: ${SITE_ORIGIN}/blog/<category>/<slug>.md`,
  "",
  "## Site focus",
  "- Technology blogging",
  "",
  "## Author",
  "- Jim Drury",
  "- Head of Platform Innovation, Virgin Media O2",
  "- https://linked.in/jimdrury",
  "- https://x.com/jim_drury",
  "- https://github.com/jimdrury",
  "",
].join("\n");

export const GET = async () => {
  return new Response(LLMSTXT_CONTENT, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
