import "server-only";

import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { getDefaultStoryCategory } from "@/lib/blog";
import { renderArticleMarkdown } from "@/lib/article-markdown";
import { getArticleBySlug } from "@/storyblok/blog-listings";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export const GET = async (_request: Request, context: RouteContext) => {
  const { slug } = await context.params;
  const normalizedSlug = slug.trim();
  const requestUrl = new URL(_request.url);
  const requestedCategory = requestUrl.searchParams.get("category")?.trim();

  if (!normalizedSlug) {
    notFound();
  }

  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug: normalizedSlug, version });

  if (!story) {
    notFound();
  }

  if (!isEnabled && !getDefaultStoryCategory(story)) {
    notFound();
  }

  const canonicalCategory = getDefaultStoryCategory(story);
  if (
    canonicalCategory &&
    requestedCategory &&
    requestedCategory.toLowerCase() !== canonicalCategory.toLowerCase()
  ) {
    redirect(`/blog/${canonicalCategory}/${normalizedSlug}.md`);
  }

  const markdown = renderArticleMarkdown(story);

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": isEnabled
        ? "private, no-store, max-age=0"
        : "public, s-maxage=300, stale-while-revalidate=600",
      "x-content-type-options": "nosniff",
      "content-disposition": `inline; filename="${encodeURIComponent(normalizedSlug)}.md"`,
    },
  });
};
