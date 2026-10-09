import "server-only";
import type { Metadata } from "next";
import { getDefaultStoryCategory } from "@/lib/blog";
import { estimateWordCount } from "@/lib/read-time";
import {
  type BlogStory,
  getFeaturedImageAsset,
  parseStoryblokImageDimensions,
} from "@/storyblok/blog-listings-utils";
import type { StoryData } from "@/storyblok/lib";

export const SITE_ORIGIN = "https://www.jimdrury.co.uk";
export const SITE_NAME = "Jim Drury";
const SITE_LOCALE = "en_GB";
const SITE_LANGUAGE = "en-GB";
const AUTHOR_JOB_TITLE = "Head of Platform Innovation";
const AUTHOR_PROFILE_URLS = [
  "https://www.linkedin.com/in/jimdrury",
  "https://x.com/jim_drury",
  "https://github.com/jimdrury",
] as const;
const AUTHOR_ABOUT_URL = `${SITE_ORIGIN}/about`;
const ISO_8601_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const AUTHOR_WORKS_FOR = {
  "@type": "Organization",
  name: "Virgin Media O2",
  url: "https://www.virginmediao2.co.uk",
  sameAs: [
    "https://www.virginmedia.com",
    "https://www.o2.co.uk",
    "https://www.virginmediao2.co.uk",
  ],
} as const;
const AUTHOR_KNOWS_ABOUT = [
  "Next.js",
  "React",
  "TypeScript",
  "AI coding agents",
  "headless CMS",
  "Claude Code",
  "web performance",
  "frontend architecture",
  "design systems",
] as const;
const BLOG_INDEX_DESCRIPTION =
  "Latest writing, ideas, and technical deep dives from Jim Drury.";
const ORGANIZATION_LOGO_URL = `${SITE_ORIGIN}/logo.png`;
const PERSON_IMAGE_URL =
  "https://a.storyblok.com/f/291093583118629/1463x3182/3fe55ff77b/profile-picture-full.jpg?cv=1774741806321";
const PERSON_DESCRIPTION =
  "Jim Drury is Head of Platform Innovation at Virgin Media O2 and writes about Next.js, TypeScript, AI coding agents, and frontend architecture.";
const BLOG_INDEX_KEYWORDS = [
  "blog",
  "software engineering",
  "web development",
  "next.js",
  "typescript",
] as const;
const KNOWN_ACRONYMS: Readonly<Record<string, string>> = {
  ai: "AI",
  api: "API",
  cms: "CMS",
  css: "CSS",
};

const normalizeText = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const toIso8601 = (value: string | undefined): string | undefined => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return undefined;
  }

  let candidate = normalized.includes("T")
    ? normalized
    : normalized.replace(" ", "T");

  if (/^\d{4}-\d{2}-\d{2}$/.test(candidate)) {
    candidate = `${candidate}T00:00:00Z`;
  } else if (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(candidate)
  ) {
    candidate = `${candidate}Z`;
  }

  const date = new Date(candidate);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

const isRecordValue = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isAbsoluteHttpUrl = (value: unknown): value is string => {
  return typeof value === "string" && /^https?:\/\//.test(value);
};

const formatCategoryLabel = (category: string): string => {
  const trimmed = category.trim();
  if (!trimmed) {
    return "General";
  }

  return trimmed
    .split(/[\s-]+/g)
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      const normalizedSegment = segment.toLowerCase();
      const knownAcronym = KNOWN_ACRONYMS[normalizedSegment];
      if (knownAcronym) {
        return knownAcronym;
      }
      const [first = "", ...rest] = segment;
      return first.toUpperCase() + rest.join("");
    })
    .join(" ");
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const toAbsoluteUrl = (value: string): string => {
  try {
    return new URL(value).toString();
  } catch {
    return new URL(
      value.startsWith("/") ? value : `/${value}`,
      SITE_ORIGIN,
    ).toString();
  }
};

export const MISSING_STORY_METADATA: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const getStaticPagePath = (slug: string | string[]): string => {
  const value = Array.isArray(slug) ? slug.join("/") : slug;
  const normalized = value.replace(/^\/+|\/+$/g, "");

  if (normalized === "home" || normalized.length === 0) {
    return "/";
  }

  return `/${normalized}`;
};

export const getArticlePath = (story: BlogStory): string | null => {
  const canonicalCategory = getDefaultStoryCategory(story);

  if (!canonicalCategory) {
    return null;
  }

  return `/blog/${canonicalCategory}/${story.slug}`;
};

export const getArticlesWithPath = (
  stories: BlogStory[],
): { story: BlogStory; path: string }[] => {
  return stories.flatMap((story) => {
    const path = getArticlePath(story);
    return path ? [{ story, path }] : [];
  });
};

export const getArticleCanonicalUrl = (story: BlogStory): string | null => {
  const path = getArticlePath(story);
  return path ? toAbsoluteUrl(path) : null;
};

export const getBlogIndexPath = (page: number): string => {
  return page > 1 ? `/blog/page/${page}` : "/blog";
};

export const getBlogCategoryPath = (category: string, page: number): string => {
  const normalizedCategory = category.trim().toLowerCase();
  const encodedCategory = encodeURIComponent(normalizedCategory);

  if (page > 1) {
    return `/blog/${encodedCategory}?page=${page}`;
  }

  return `/blog/${encodedCategory}`;
};

export const buildBlogIndexMetadata = (page: number): Metadata => {
  const normalizedPage = Number.isFinite(page)
    ? Math.max(1, Math.trunc(page))
    : 1;
  const canonicalPath = getBlogIndexPath(normalizedPage);
  const title = normalizedPage > 1 ? `Blog - Page ${normalizedPage}` : "Blog";
  const description =
    normalizedPage > 1
      ? `Page ${normalizedPage} of the ${SITE_NAME} blog: ${BLOG_INDEX_DESCRIPTION.toLowerCase()}`
      : BLOG_INDEX_DESCRIPTION;

  return {
    title,
    description,
    keywords: [...BLOG_INDEX_KEYWORDS],
    category: "technology",
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export const buildBlogIndexJsonLd = ({
  page,
  stories,
}: {
  page: number;
  stories: BlogStory[];
}): Record<string, unknown> => {
  const normalizedPage = Number.isFinite(page)
    ? Math.max(1, Math.trunc(page))
    : 1;
  const canonicalPath = getBlogIndexPath(normalizedPage);
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const pageName =
    normalizedPage > 1 ? `Blog - Page ${normalizedPage}` : "Blog";
  const listedArticles = getArticlesWithPath(stories);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageName,
    description: BLOG_INDEX_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: listedArticles.length,
      itemListElement: listedArticles.map(({ story, path }, index) => {
        return {
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(path),
          name: story.name,
        };
      }),
    },
  };
};

export const buildBlogCategoryMetadata = ({
  category,
  page,
}: {
  category: string;
  page: number;
}): Metadata => {
  const normalizedPage = Number.isFinite(page)
    ? Math.max(1, Math.trunc(page))
    : 1;
  const normalizedCategory = category.trim().toLowerCase();
  const categoryLabel = formatCategoryLabel(normalizedCategory);
  const canonicalPath = getBlogCategoryPath(normalizedCategory, normalizedPage);
  const title =
    normalizedPage > 1
      ? `Blog category: ${normalizedCategory} - Page ${normalizedPage}`
      : `Blog category: ${normalizedCategory}`;
  const description =
    normalizedPage > 1
      ? `Page ${normalizedPage} of ${SITE_NAME} posts in the ${categoryLabel} category.`
      : `Posts from ${SITE_NAME} in the ${categoryLabel} category.`;
  const keywords = [...BLOG_INDEX_KEYWORDS, normalizedCategory];

  return {
    title,
    description,
    keywords,
    category: normalizedCategory,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export const buildBlogCategoryJsonLd = ({
  category,
  page,
  stories,
}: {
  category: string;
  page: number;
  stories: BlogStory[];
}): Record<string, unknown> => {
  const normalizedPage = Number.isFinite(page)
    ? Math.max(1, Math.trunc(page))
    : 1;
  const normalizedCategory = category.trim().toLowerCase();
  const categoryLabel = formatCategoryLabel(normalizedCategory);
  const canonicalPath = getBlogCategoryPath(normalizedCategory, normalizedPage);
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const pageName =
    normalizedPage > 1
      ? `Blog category: ${normalizedCategory} - Page ${normalizedPage}`
      : `Blog category: ${normalizedCategory}`;
  const listedArticles = getArticlesWithPath(stories);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageName,
    description:
      normalizedPage > 1
        ? `Page ${normalizedPage} of ${SITE_NAME} posts in the ${categoryLabel} category.`
        : `Posts from ${SITE_NAME} in the ${categoryLabel} category.`,
    inLanguage: SITE_LANGUAGE,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    about: {
      "@type": "Thing",
      name: normalizedCategory,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: listedArticles.length,
      itemListElement: listedArticles.map(({ story, path }, index) => {
        return {
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(path),
          name: story.name,
        };
      }),
    },
  };
};

export const getArticleExcerpt = (story: BlogStory): string | undefined => {
  const topLevelExcerpt = normalizeText(story.content?.excerpt);
  if (topLevelExcerpt) {
    return topLevelExcerpt;
  }

  const body = story.content?.body;
  if (!Array.isArray(body)) {
    return undefined;
  }

  for (const blok of body) {
    if (!isRecord(blok)) {
      continue;
    }

    const excerpt = normalizeText(
      typeof blok.excerpt === "string" ? blok.excerpt : undefined,
    );
    if (excerpt) {
      return excerpt;
    }
  }

  return undefined;
};

const getArticleDescription = (story: BlogStory): string => {
  return (
    normalizeText(story.content?.meta_description) ??
    getArticleExcerpt(story) ??
    `Read ${story.name} on ${SITE_NAME}.`
  );
};

const getArticlePublishedTime = (story: BlogStory): string | undefined => {
  return (
    toIso8601(story.first_published_at ?? undefined) ??
    toIso8601(story.published_at ?? undefined)
  );
};

const laterIso8601 = (
  left: string | undefined,
  right: string | undefined,
): string | undefined => {
  if (!left) {
    return right;
  }
  if (!right) {
    return left;
  }
  return left >= right ? left : right;
};

const getArticleModifiedTime = (story: BlogStory): string | undefined => {
  return laterIso8601(
    toIso8601(story.published_at ?? undefined),
    toIso8601(story.first_published_at ?? undefined),
  );
};

export type ArticleStructuredData = {
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  keywords: string[];
  canonicalUrl: string | null;
  authorName: string;
  authorUrl: string;
  authorJobTitle: string;
  authorSameAs: readonly string[];
  publisherName: string;
  publisherUrl: string;
  publisherLogoUrl: string;
};

export const getArticleStructuredData = (
  story: BlogStory,
): ArticleStructuredData => {
  const datePublished = getArticlePublishedTime(story);

  return {
    headline: story.name,
    description: getArticleDescription(story),
    datePublished,
    dateModified: getArticleModifiedTime(story) ?? datePublished,
    keywords: getArticleKeywords(story),
    canonicalUrl: getArticleCanonicalUrl(story),
    authorName: SITE_NAME,
    authorUrl: AUTHOR_ABOUT_URL,
    authorJobTitle: AUTHOR_JOB_TITLE,
    authorSameAs: AUTHOR_PROFILE_URLS,
    publisherName: SITE_NAME,
    publisherUrl: SITE_ORIGIN,
    publisherLogoUrl: ORGANIZATION_LOGO_URL,
  };
};

export const validateBlogPostingJsonLd = (
  jsonLd: Record<string, unknown>,
): string[] => {
  const errors: string[] = [];

  if (jsonLd["@context"] !== "https://schema.org") {
    errors.push("@context must be https://schema.org");
  }

  if (jsonLd["@type"] !== "BlogPosting") {
    errors.push("@type must be BlogPosting");
  }

  if (typeof jsonLd.headline !== "string" || jsonLd.headline.trim() === "") {
    errors.push("headline must be a non-empty string");
  }

  if (
    typeof jsonLd.description !== "string" ||
    jsonLd.description.trim() === ""
  ) {
    errors.push("description must be a non-empty string");
  }

  if (
    typeof jsonLd.datePublished !== "string" ||
    !ISO_8601_UTC.test(jsonLd.datePublished)
  ) {
    errors.push("datePublished must be an ISO 8601 UTC timestamp");
  }

  if (
    typeof jsonLd.dateModified !== "string" ||
    !ISO_8601_UTC.test(jsonLd.dateModified)
  ) {
    errors.push("dateModified must be an ISO 8601 UTC timestamp");
  } else if (
    typeof jsonLd.datePublished === "string" &&
    jsonLd.dateModified < jsonLd.datePublished
  ) {
    errors.push("dateModified must not be earlier than datePublished");
  }

  const author = isRecordValue(jsonLd.author) ? jsonLd.author : null;
  if (
    !author ||
    author["@type"] !== "Person" ||
    author.name !== SITE_NAME ||
    author.url !== AUTHOR_ABOUT_URL
  ) {
    errors.push(
      "author must be a Person named Jim Drury with url https://www.jimdrury.co.uk/about",
    );
  }

  const publisher = isRecordValue(jsonLd.publisher) ? jsonLd.publisher : null;
  const logo =
    publisher && isRecordValue(publisher.logo) ? publisher.logo : null;
  if (
    !publisher ||
    publisher["@type"] !== "Organization" ||
    typeof publisher.name !== "string" ||
    publisher.name.trim() === "" ||
    !isAbsoluteHttpUrl(publisher.url) ||
    !logo ||
    logo["@type"] !== "ImageObject" ||
    !isAbsoluteHttpUrl(logo.url)
  ) {
    errors.push("publisher must be an Organization with an ImageObject logo");
  }

  const image = isRecordValue(jsonLd.image) ? jsonLd.image : null;
  if (
    !image ||
    image["@type"] !== "ImageObject" ||
    !isAbsoluteHttpUrl(image.url)
  ) {
    errors.push("image must be an ImageObject with an absolute url");
  }

  const mainEntity = isRecordValue(jsonLd.mainEntityOfPage)
    ? jsonLd.mainEntityOfPage
    : null;
  if (
    !mainEntity ||
    mainEntity["@type"] !== "WebPage" ||
    !isAbsoluteHttpUrl(mainEntity["@id"])
  ) {
    errors.push("mainEntityOfPage must be a WebPage with an absolute @id");
  }

  if (
    !Array.isArray(jsonLd.keywords) ||
    jsonLd.keywords.some(
      (keyword) => typeof keyword !== "string" || keyword.trim() === "",
    )
  ) {
    errors.push("keywords must be an array of tag strings");
  }

  return errors;
};

const getArticleKeywords = (story: BlogStory): string[] => {
  const keywords = (story.tag_list ?? [])
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return [...new Set(keywords)];
};

export const getArticleOgImageUrl = (story: BlogStory): string | null => {
  const path = getArticlePath(story);
  return path ? toAbsoluteUrl(`${path}/opengraph-image`) : null;
};

export const getArticleTwitterImageUrl = (story: BlogStory): string | null => {
  const path = getArticlePath(story);
  return path ? toAbsoluteUrl(`${path}/twitter-image`) : null;
};

const getFeaturedImage = (
  story: BlogStory,
): { url: string; alt?: string } | null => {
  const image = getFeaturedImageAsset(story.content?.featured_image);
  if (!image?.filename) {
    return null;
  }

  return {
    url: toAbsoluteUrl(image.filename),
    alt: normalizeText(image.alt) ?? `Featured image for ${story.name}`,
  };
};

const getArticleJsonLdImage = (
  story: BlogStory,
  description: string,
): Record<string, unknown> | undefined => {
  const featuredImage = getFeaturedImage(story);
  const imageName = featuredImage?.alt ?? `Featured image for ${story.name}`;
  const dimensions = parseStoryblokImageDimensions(featuredImage?.url);

  if (featuredImage && dimensions) {
    return {
      "@type": "ImageObject",
      url: featuredImage.url,
      width: dimensions.width,
      height: dimensions.height,
      name: imageName,
      description,
    };
  }

  const ogImageUrl = getArticleOgImageUrl(story);
  if (ogImageUrl) {
    return {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: 1200,
      height: 630,
      name: imageName,
      description,
    };
  }

  if (featuredImage) {
    return {
      "@type": "ImageObject",
      url: featuredImage.url,
      name: imageName,
      description,
    };
  }

  return undefined;
};

const getStaticPageDescription = (story: StoryData): string => {
  if (isRecord(story.content)) {
    const metaDescription = normalizeText(
      typeof story.content.meta_description === "string"
        ? story.content.meta_description
        : undefined,
    );
    if (metaDescription) {
      return metaDescription;
    }
    const excerpt = normalizeText(
      typeof story.content.excerpt === "string"
        ? story.content.excerpt
        : undefined,
    );
    if (excerpt) {
      return excerpt;
    }
  }

  const title = normalizeText(story.name ?? undefined) ?? "this page";
  return `Read ${title} on ${SITE_NAME}.`;
};

const getStaticPageDate = (
  story: StoryData,
  key: "published_at" | "first_published_at",
): string | undefined => {
  if (!isRecord(story)) {
    return undefined;
  }
  const storyRecord = story as Record<string, unknown>;
  return normalizeText(
    typeof storyRecord[key] === "string"
      ? (storyRecord[key] as string)
      : undefined,
  );
};

const isArticleStoryData = (story: StoryData): boolean => {
  return isRecord(story.content) && story.content.component === "article";
};

export const buildArticleMetadata = (story: BlogStory): Metadata => {
  const description = getArticleDescription(story);
  const canonicalPath = getArticlePath(story);
  const canonicalUrl = getArticleCanonicalUrl(story);
  const publishedTime = getArticlePublishedTime(story);
  const modifiedTime = getArticleModifiedTime(story);
  const keywords = getArticleKeywords(story);
  const canonicalCategory = getDefaultStoryCategory(story) ?? undefined;
  const featuredImage = getFeaturedImage(story);
  const generatedOgImage = getArticleOgImageUrl(story);
  const generatedTwitterImage = getArticleTwitterImageUrl(story);
  const imageAlt = featuredImage?.alt ?? `Open Graph image for ${story.name}`;
  const indexable = canonicalPath !== null;

  return {
    title: story.name,
    description,
    keywords,
    category: canonicalCategory ?? keywords[0],
    ...(canonicalPath && {
      alternates: {
        canonical: canonicalPath,
      },
    }),
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : MISSING_STORY_METADATA.robots,
    openGraph: {
      type: "article",
      title: story.name,
      description,
      ...(canonicalUrl && { url: canonicalUrl }),
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      publishedTime,
      modifiedTime,
      tags: keywords,
      ...(generatedOgImage && {
        images: [
          {
            url: generatedOgImage,
            width: 1200,
            height: 630,
            alt: imageAlt,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: story.name,
      description,
      ...(generatedTwitterImage && { images: [generatedTwitterImage] }),
    },
  };
};

export const buildStaticPageMetadata = ({
  story,
  slug,
}: {
  story: StoryData;
  slug: string;
}): Metadata => {
  if (isArticleStoryData(story)) {
    return {};
  }

  const title = normalizeText(story.name ?? undefined) ?? "Page";
  const description = getStaticPageDescription(story);
  const canonicalPath = getStaticPagePath(slug);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

export const buildArticleJsonLd = (
  story: BlogStory,
): Record<string, unknown> => {
  const description = getArticleDescription(story);
  const canonicalUrl = getArticleCanonicalUrl(story);
  const publishedTime = getArticlePublishedTime(story);
  const modifiedTime = getArticleModifiedTime(story) ?? publishedTime;
  const keywords = getArticleKeywords(story);
  const image = getArticleJsonLdImage(story, description);
  const wordCount = estimateWordCount(story.content.body);
  const articleSection = getDefaultStoryCategory(story);
  const author = {
    "@type": "Person",
    name: SITE_NAME,
    url: AUTHOR_ABOUT_URL,
    jobTitle: AUTHOR_JOB_TITLE,
    sameAs: [...AUTHOR_PROFILE_URLS],
    worksFor: AUTHOR_WORKS_FOR,
  };
  const publisher = {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION_LOGO_URL,
    },
  };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: story.name,
    description,
    inLanguage: SITE_LANGUAGE,
    ...(canonicalUrl && {
      url: canonicalUrl,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    }),
    ...(image && { image }),
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    author,
    publisher,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-headline", ".article-description"],
    },
    keywords,
    ...(wordCount > 0 && { wordCount }),
    ...(articleSection && { articleSection }),
  };
};

export const buildArticleBreadcrumbJsonLd = (
  story: BlogStory,
): Record<string, unknown> => {
  const canonicalCategory = getDefaultStoryCategory(story);
  const articlePath = getArticlePath(story);
  const itemListElement: Record<string, unknown>[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_ORIGIN,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: toAbsoluteUrl("/blog"),
    },
  ];

  if (canonicalCategory) {
    itemListElement.push({
      "@type": "ListItem",
      position: 3,
      name: formatCategoryLabel(canonicalCategory),
      item: toAbsoluteUrl(getBlogCategoryPath(canonicalCategory, 1)),
    });
  }

  if (articlePath) {
    itemListElement.push({
      "@type": "ListItem",
      position: itemListElement.length + 1,
      name: story.name,
      item: toAbsoluteUrl(articlePath),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
};

export const buildStaticPageJsonLd = ({
  story,
  slug,
}: {
  story: StoryData;
  slug: string;
}): Record<string, unknown> => {
  const canonicalPath = getStaticPagePath(slug);
  const canonicalUrl = toAbsoluteUrl(canonicalPath);
  const title = normalizeText(story.name ?? undefined) ?? "Page";
  const description = getStaticPageDescription(story);
  const publishedTime =
    getStaticPageDate(story, "first_published_at") ??
    getStaticPageDate(story, "published_at");
  const modifiedTime =
    getStaticPageDate(story, "published_at") ??
    getStaticPageDate(story, "first_published_at");

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    headline: title,
    description,
    inLanguage: SITE_LANGUAGE,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    datePublished: publishedTime,
    dateModified: modifiedTime,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: AUTHOR_ABOUT_URL,
      jobTitle: AUTHOR_JOB_TITLE,
      sameAs: [...AUTHOR_PROFILE_URLS],
      worksFor: AUTHOR_WORKS_FOR,
    },
  };
};

export const buildPersonJsonLd = (): Record<string, unknown> => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: AUTHOR_ABOUT_URL,
    image: PERSON_IMAGE_URL,
    description: PERSON_DESCRIPTION,
    jobTitle: AUTHOR_JOB_TITLE,
    worksFor: AUTHOR_WORKS_FOR,
    sameAs: [...AUTHOR_PROFILE_URLS],
    knowsAbout: [...AUTHOR_KNOWS_ABOUT],
  };
};

export const buildOrganizationJsonLd = (): Record<string, unknown> => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: ORGANIZATION_LOGO_URL,
    description: BLOG_INDEX_DESCRIPTION,
    sameAs: [...AUTHOR_PROFILE_URLS],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "technical support",
    },
  };
};

export const serializeJsonLd = (value: Record<string, unknown>): string => {
  return JSON.stringify(value).replace(/</g, "\\u003c");
};
