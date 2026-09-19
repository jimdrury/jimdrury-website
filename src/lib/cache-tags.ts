import "server-only";

type ContentVersion = "draft" | "published";
type BlogScope =
  | "articles-by-tag"
  | "all-articles"
  | "latest-seed"
  | "tags"
  | "article"
  | "date-archive"
  | "index"
  | "category";

const HOME_STORY_SLUG = "home";

const normalizeSegment = (value: string): string => {
  return encodeURIComponent(value.trim().toLowerCase());
};

export const getHomePageTag = (): string => "content:home-page";

export const getPublishedPagesTag = (): string => "content:published-pages";

export const getStorySlugVersionTag = ({
  slug,
  version,
}: {
  slug: string;
  version: ContentVersion;
}): string => {
  return `content:story-page:${version}:${normalizeSegment(slug)}`;
};

export const getStoryCacheTags = ({
  slug,
  version,
}: {
  slug: string;
  version: ContentVersion;
}): string[] => {
  const tags = [getStorySlugVersionTag({ slug, version })];

  if (slug === HOME_STORY_SLUG) {
    tags.push(getHomePageTag());
  }

  return tags;
};

export const BLOG_SCOPES: Record<string, BlogScope> = {
  articlesByTag: "articles-by-tag",
  allArticles: "all-articles",
  latestSeed: "latest-seed",
  tags: "tags",
  article: "article",
  dateArchive: "date-archive",
  index: "index",
  category: "category",
} as const;

const BLOG_LISTING_SCOPES: readonly BlogScope[] = Object.freeze([
  BLOG_SCOPES.articlesByTag,
  BLOG_SCOPES.allArticles,
  BLOG_SCOPES.latestSeed,
  BLOG_SCOPES.tags,
  BLOG_SCOPES.dateArchive,
  BLOG_SCOPES.index,
  BLOG_SCOPES.category,
]);

const ALL_CONTENT_VERSIONS: readonly ContentVersion[] = Object.freeze([
  "draft",
  "published",
]);

export const getBlogVersionTag = ({
  scope,
  version,
}: {
  scope: BlogScope;
  version: ContentVersion;
}): string => {
  return `content:blog:${scope}:${version}`;
};

export const getBlogListingVersionTags = (
  version: ContentVersion,
): string[] => {
  return BLOG_LISTING_SCOPES.map((scope) => {
    return getBlogVersionTag({ scope, version });
  });
};

export const getBlogArticlesByTagIndexTag = ({
  tag,
  index,
  version,
}: {
  tag: string;
  index: number;
  version: ContentVersion;
}): string => {
  return `content:blog:articles-by-tag:${version}:${normalizeSegment(tag)}:${index}`;
};

export const getBlogArticlesByTagTag = ({
  tag,
  version,
}: {
  tag: string;
  version: ContentVersion;
}): string => {
  return `content:blog:articles-by-tag:${version}:${normalizeSegment(tag)}`;
};

export const getBlogIndexPageTag = ({
  page,
  version,
}: {
  page: number;
  version: ContentVersion;
}): string => {
  return `content:blog:index:${version}:page:${page}`;
};

export const getBlogCategoryPageTag = ({
  category,
  page,
  version,
}: {
  category: string;
  page: number;
  version: ContentVersion;
}): string => {
  return `content:blog:category:${version}:${normalizeSegment(category)}:page:${page}`;
};

export const getBlogDateArchiveTag = ({
  datePrefix,
  version,
}: {
  datePrefix: string;
  version: ContentVersion;
}): string => {
  return `content:blog:date-archive:${version}:${normalizeSegment(datePrefix)}`;
};

export const getBlogArticleSlugTag = ({
  slug,
  version,
}: {
  slug: string;
  version: ContentVersion;
}): string => {
  return `content:blog:article:${version}:${normalizeSegment(slug)}`;
};

export const ALL_CONTENT_CACHE_TAGS: readonly string[] = Object.freeze([
  getHomePageTag(),
  getPublishedPagesTag(),
  ...ALL_CONTENT_VERSIONS.flatMap((version) => {
    return getBlogListingVersionTags(version);
  }),
]);
