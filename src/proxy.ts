import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getArticleSlugFromPath,
  isPublicArticleStory,
} from "@/app/blog/[category]/[slug]/_helpers/article-request-gate";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

const DRAFT_COOKIE_NAME = "__prerender_bypass";
const ARTICLE_NOT_FOUND_PATH = "/article-not-found";

type CdnStory = {
  content?: { component?: string };
  first_published_at?: string | null;
  published_at?: string | null;
};

const toBlogStory = (slug: string, story: CdnStory): BlogStory => {
  return {
    id: 0,
    name: slug,
    slug,
    full_slug: `blog/${slug}`,
    content: { component: story.content?.component },
    first_published_at: story.first_published_at,
    published_at: story.published_at,
  };
};

const loadPublishedStory = async (
  slug: string,
): Promise<CdnStory | null | undefined> => {
  const token = process.env.STORYBLOK_ACCESS_TOKEN;
  if (!token) {
    return undefined;
  }

  const url = new URL(
    `https://api.storyblok.com/v2/cdn/stories/blog/${encodeURIComponent(slug)}`,
  );
  url.searchParams.set("token", token);
  url.searchParams.set("version", "published");

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return undefined;
    }

    const body = (await response.json()) as { story?: CdnStory };
    return body.story ?? null;
  } catch {
    return undefined;
  }
};

const rewriteNotFound = (request: NextRequest): NextResponse => {
  const url = request.nextUrl.clone();
  url.pathname = ARTICLE_NOT_FOUND_PATH;
  url.search = "";
  return NextResponse.rewrite(url);
};

export const proxy = async (request: NextRequest) => {
  if (request.cookies.has(DRAFT_COOKIE_NAME)) {
    return NextResponse.next();
  }

  const slug = getArticleSlugFromPath(request.nextUrl.pathname);
  if (!slug) {
    return NextResponse.next();
  }

  const story = await loadPublishedStory(slug);
  if (story === undefined) {
    return NextResponse.next();
  }

  if (!isPublicArticleStory(story ? toBlogStory(slug, story) : null)) {
    return rewriteNotFound(request);
  }

  return NextResponse.next();
};

export const config = {
  matcher: "/blog/:category/:slug",
};
