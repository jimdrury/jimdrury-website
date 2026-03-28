import "server-only";
import type { Metadata } from "next";
import { getDefaultStoryCategory } from "@/lib/blog";
import { estimateWordCount } from "@/lib/read-time";
import {
  type BlogStory,
  getFeaturedImageAsset,
} from "@/storyblok/blog-listings-utils";

export const SITE_ORIGIN = "https://www.jimdrury.co.uk";
export const SITE_NAME = "Jim Drury";
const SITE_LOCALE = "en_GB";
const SITE_LANGUAGE = "en-GB";
const AUTHOR_JOB_TITLE = "Head of Platform Innovation";
const AUTHOR_PROFILE_URLS = [
  "https://linked.in/jimdrury",
  "https://x.com/jim_drury",
  "https://github.com/jimdrury",
] as const;
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
const BLOG_INDEX_DESCRIPTION =
  "Latest writing, ideas, and technical deep dives from Jim Drury.";
const BLOG_INDEX_KEYWORDS = [
  "blog",
  "software engineering",
  "web development",
  "next.js",
  "typescript",
] as const;

const normalizeText = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
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

export const getArticlePath = (story: BlogStory): string => {
  const canonicalCategory = getDefaultStoryCategory(story);

  if (canonicalCategory) {
    return `/blog/${canonicalCategory}/${story.slug}`;
  }

  return `/blog/${story.slug}`;
};

export const getArticleCanonicalUrl = (story: BlogStory): string => {
  return toAbsoluteUrl(getArticlePath(story));
};

export const getBlogIndexPath = (page: number): string => {
  return page > 1 ? `/blog?page=${page}` : "/blog";
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
      numberOfItems: stories.length,
      itemListElement: stories.map((story, index) => {
        return {
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(getArticlePath(story)),
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
      numberOfItems: stories.length,
      itemListElement: stories.map((story, index) => {
        return {
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(getArticlePath(story)),
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
    normalizeText(story.first_published_at ?? undefined) ??
    normalizeText(story.published_at ?? undefined)
  );
};

const getArticleModifiedTime = (story: BlogStory): string | undefined => {
  return (
    normalizeText(story.published_at ?? undefined) ??
    normalizeText(story.first_published_at ?? undefined)
  );
};

const getArticleKeywords = (story: BlogStory): string[] => {
  const keywords = (story.tag_list ?? [])
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return [...new Set(keywords)];
};

export const getArticleOgImageUrl = (story: BlogStory): string => {
  return toAbsoluteUrl(`${getArticlePath(story)}/opengraph-image`);
};

export const getArticleTwitterImageUrl = (story: BlogStory): string => {
  return toAbsoluteUrl(`${getArticlePath(story)}/twitter-image`);
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

  return {
    title: story.name,
    description,
    keywords,
    category: canonicalCategory ?? keywords[0],
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
      type: "article",
      title: story.name,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      publishedTime,
      modifiedTime,
      tags: keywords,
      images: [
        {
          url: generatedOgImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: story.name,
      description,
      images: [generatedTwitterImage],
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
  const images = [getArticleOgImageUrl(story)];
  const wordCount = estimateWordCount(story.content.body);
  const articleSection = getDefaultStoryCategory(story);
  const author = {
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    jobTitle: AUTHOR_JOB_TITLE,
    sameAs: [...AUTHOR_PROFILE_URLS],
    worksFor: AUTHOR_WORKS_FOR,
  };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: story.name,
    description,
    inLanguage: SITE_LANGUAGE,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    image: images,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author,
    publisher: author,
    keywords,
    ...(wordCount > 0 && { wordCount }),
    ...(articleSection && { articleSection }),
  };
};

export const serializeJsonLd = (value: Record<string, unknown>): string => {
  return JSON.stringify(value).replace(/</g, "\\u003c");
};
