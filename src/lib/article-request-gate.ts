import {
  type BlogStory,
  isArticleReleased,
  isArticleStory,
} from "@/storyblok/blog-listings-utils";

const RESERVED_CATEGORIES = new Set(["page", "_"]);
const MARKDOWN_SUFFIX = ".md";

const toArticleAlias = (value: string): ArticleAlias | null => {
  switch (value) {
    case "markdown":
    case "opengraph-image":
    case "twitter-image":
      return value;
    default:
      return null;
  }
};

export type ArticleAlias = "markdown" | "opengraph-image" | "twitter-image";

export type ArticleRoute =
  | { kind: "bare"; slug: string }
  | { kind: "canonical"; slug: string; category: string }
  | { kind: "alias"; slug: string; category: string; alias: ArticleAlias };

export type ArticleVisitorDecision =
  | { type: "not-found" }
  | { type: "redirect"; href: string }
  | { type: "render" };

type ArticleReleaseFields = {
  content?: unknown;
  first_published_at?: string | null;
  published_at?: string | null;
};

const readComponent = (content: unknown): string | undefined => {
  if (
    typeof content !== "object" ||
    content === null ||
    !("component" in content)
  ) {
    return undefined;
  }

  const component = content.component;
  return typeof component === "string" ? component : undefined;
};

const decodeSegment = (segment: string): string | null => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
};

const hasFileExtension = (segment: string): boolean => {
  return segment.includes(".");
};

const stripMarkdownSuffix = (segment: string): string | null => {
  if (!segment.endsWith(MARKDOWN_SUFFIX)) {
    return segment;
  }

  const slug = segment.slice(0, -MARKDOWN_SUFFIX.length);
  return slug.length > 0 ? slug : null;
};

const normalizePathname = (pathname: string): string => {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
};

export const getArticleRoute = (pathname: string): ArticleRoute | null => {
  const path = normalizePathname(pathname);
  if (!path.startsWith("/blog/")) {
    return null;
  }

  const segments = path.slice("/blog/".length).split("/");
  if (
    segments.length === 0 ||
    segments.length > 3 ||
    segments.some((segment) => segment.length === 0)
  ) {
    return null;
  }

  const decoded = segments.map(decodeSegment);
  if (decoded.some((segment) => segment === null)) {
    return null;
  }

  const [first, second, third] = decoded as [string, string?, string?];

  if (decoded.length === 1) {
    if (
      !first ||
      (hasFileExtension(first) && !first.endsWith(MARKDOWN_SUFFIX))
    ) {
      return null;
    }

    const slug = stripMarkdownSuffix(first);
    return slug ? { kind: "bare", slug } : null;
  }

  if (
    !first ||
    !second ||
    RESERVED_CATEGORIES.has(first) ||
    hasFileExtension(first)
  ) {
    return null;
  }

  if (decoded.length === 2) {
    if (hasFileExtension(second) && !second.endsWith(MARKDOWN_SUFFIX)) {
      return null;
    }

    const slug = stripMarkdownSuffix(second);
    if (!slug) {
      return null;
    }

    if (second.endsWith(MARKDOWN_SUFFIX)) {
      return { kind: "alias", category: first, slug, alias: "markdown" };
    }

    return { kind: "canonical", category: first, slug };
  }

  if (!third || hasFileExtension(second)) {
    return null;
  }

  const alias = toArticleAlias(third);
  if (!alias) {
    return null;
  }

  return { kind: "alias", category: first, slug: second, alias };
};

export const isPublicArticleStory = (
  story: BlogStory | null,
  now: Date = new Date(),
): boolean => {
  if (!story || !isArticleStory(story)) {
    return false;
  }

  return isArticleReleased(story, now);
};

export const isUnreleasedArticleStory = (
  story: ArticleReleaseFields | null,
  now: Date = new Date(),
): boolean => {
  if (!story || readComponent(story.content) !== "article") {
    return false;
  }

  return !isArticleReleased(
    {
      id: 0,
      name: "",
      slug: "",
      full_slug: "",
      content: { component: "article" },
      first_published_at: story.first_published_at,
      published_at: story.published_at,
    },
    now,
  );
};

export const shouldBlockArticleRequest = (
  route: ArticleRoute,
  story: BlogStory | null | undefined,
  now: Date = new Date(),
): boolean => {
  if (story === undefined) {
    return false;
  }

  switch (route.kind) {
    case "bare":
      if (!story || !isArticleStory(story)) {
        return false;
      }

      return !isArticleReleased(story, now);
    case "canonical":
    case "alias":
      return !isPublicArticleStory(story, now);
    default: {
      const exhaustive: never = route;
      return exhaustive;
    }
  }
};

export const resolveArticleProxyAction = ({
  pathname,
  story,
  draft = false,
  now = new Date(),
}: {
  pathname: string;
  story: BlogStory | null | undefined;
  draft?: boolean;
  now?: Date;
}): "next" | "block" => {
  if (draft) {
    return "next";
  }

  const route = getArticleRoute(pathname);
  if (!route || story === undefined) {
    return "next";
  }

  return shouldBlockArticleRequest(route, story, now) ? "block" : "next";
};

export const decideArticleVisitorAccess = ({
  story,
  category,
  slug,
  draft,
  canonicalCategory,
  now = new Date(),
}: {
  story: BlogStory | null;
  category: string;
  slug: string;
  draft: boolean;
  canonicalCategory: string | null;
  now?: Date;
}): ArticleVisitorDecision => {
  if (!story || (!draft && !isArticleReleased(story, now))) {
    return { type: "not-found" };
  }

  if (draft) {
    return { type: "render" };
  }

  if (!canonicalCategory) {
    return { type: "not-found" };
  }

  if (category !== canonicalCategory) {
    return { type: "redirect", href: `/blog/${canonicalCategory}/${slug}` };
  }

  return { type: "render" };
};

export const decideMarkdownVisitorAccess = ({
  story,
  requestedCategory,
  slug,
  draft,
  canonicalCategory,
  now = new Date(),
}: {
  story: BlogStory | null;
  requestedCategory: string | null;
  slug: string;
  draft: boolean;
  canonicalCategory: string | null;
  now?: Date;
}): ArticleVisitorDecision => {
  if (!story || (!draft && !isArticleReleased(story, now))) {
    return { type: "not-found" };
  }

  if (!draft && !canonicalCategory) {
    return { type: "not-found" };
  }

  if (
    canonicalCategory &&
    requestedCategory &&
    requestedCategory.toLowerCase() !== canonicalCategory.toLowerCase()
  ) {
    return {
      type: "redirect",
      href: `/blog/${canonicalCategory}/${slug}.md`,
    };
  }

  return { type: "render" };
};

export const canRenderArticleImage = ({
  story,
  draft,
  now = new Date(),
}: {
  story: BlogStory | null;
  draft: boolean;
  now?: Date;
}): boolean => {
  if (!story || (!draft && !isArticleReleased(story, now))) {
    return false;
  }

  return true;
};
