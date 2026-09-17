import "server-only";

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { renderArticleMarkdown } from "@/lib/article-markdown";
import { getDefaultStoryCategory } from "@/lib/blog";
import { StoryblokUnavailableError } from "@/lib/storyblok-errors";
import { getArticleBySlug } from "@/storyblok/blog-listings";

const GET = async (
  request: Request,
  context: RouteContext<"/blog/[category]/[slug]/markdown">,
) => {
  const params = await context.params;
  const slugValue = params.slug;
  const slug = typeof slugValue === "string" ? slugValue : "";
  const normalizedSlug = slug.trim();
  const requestUrl = new URL(request.url);
  const requestedCategory = requestUrl.searchParams.get("category")?.trim();

  if (!normalizedSlug) {
    return new Response("Not Found", { status: 404 });
  }

  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  let story: Awaited<ReturnType<typeof getArticleBySlug>>;

  try {
    story = await getArticleBySlug({ slug: normalizedSlug, version });
  } catch (error) {
    if (error instanceof StoryblokUnavailableError) {
      return new Response("Service Unavailable", { status: 503 });
    }

    throw error;
  }

  if (!story) {
    return new Response("Not Found", { status: 404 });
  }

  const canonicalCategory = getDefaultStoryCategory(story);
  if (!isEnabled && !canonicalCategory) {
    return new Response("Not Found", { status: 404 });
  }

  if (
    canonicalCategory &&
    requestedCategory &&
    requestedCategory.toLowerCase() !== canonicalCategory.toLowerCase()
  ) {
    return NextResponse.redirect(
      new URL(`/blog/${canonicalCategory}/${normalizedSlug}.md`, request.url),
    );
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

export { GET };
