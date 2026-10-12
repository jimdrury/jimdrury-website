import "server-only";

import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { renderArticleMarkdown } from "@/lib/article-markdown";
import { readCurrentUtcDay } from "@/lib/article-release";
import { decideMarkdownVisitorAccess } from "@/lib/article-request-gate";
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

  const decision = decideMarkdownVisitorAccess({
    story,
    requestedCategory: requestedCategory ?? null,
    slug: normalizedSlug,
    draft: isEnabled,
    canonicalCategory: story ? getDefaultStoryCategory(story) : null,
    today: story && !isEnabled ? await readCurrentUtcDay() : "",
  });

  switch (decision.type) {
    case "not-found":
      return new Response("Not Found", { status: 404 });
    case "redirect":
      return NextResponse.redirect(new URL(decision.href, request.url));
    case "render": {
      if (!story) {
        return new Response("Not Found", { status: 404 });
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
    }
    default: {
      const unreachable: never = decision;
      return unreachable;
    }
  }
};

export { GET };
