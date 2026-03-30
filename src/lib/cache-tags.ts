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

const normalizeSegment = (value: string): string => {
  return encodeURIComponent(value.trim().toLowerCase());
};

export const getHomePageTag = (): string => "content:home-page";

export const getStoryPageTag = (): string => "content:story-page";

export const getStoryVersionTag = (version: ContentVersion): string => {
  return `content:story-page:${version}`;
};

export const getStorySlugVersionTag = ({
  slug,
  version,
}: {
  slug: string;
  version: ContentVersion;
}): string => {
  return `content:story-page:${version}:${normalizeSegment(slug)}`;
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

const ALL_BLOG_SCOPE_VALUES: readonly BlogScope[] = Object.freeze(
  Object.values(BLOG_SCOPES),
);

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
  getStoryPageTag(),
  getStoryVersionTag("draft"),
  getStoryVersionTag("published"),
  ...ALL_CONTENT_VERSIONS.flatMap((version) => {
    return ALL_BLOG_SCOPE_VALUES.map((scope) => {
      return getBlogVersionTag({ scope, version });
    });
  }),
]);
