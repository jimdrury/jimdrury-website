import "server-only";
import type { Metadata } from "next";
import { getDefaultStoryCategory } from "@/lib/blog";
import {
  type BlogStory,
  getFeaturedImageAsset,
} from "@/storyblok/blog-listings-utils";

export const SITE_ORIGIN = "https://www.jimdrury.co.uk";
export const SITE_NAME = "Jim Drury";
const SITE_LOCALE = "en_GB";
const SITE_LANGUAGE = "en-GB";

const normalizeText = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
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

  return `/blog/read/${story.slug}`;
};

export const getArticleCanonicalUrl = (story: BlogStory): string => {
  return toAbsoluteUrl(getArticlePath(story));
};

const getArticleDescription = (story: BlogStory): string => {
  return (
    normalizeText(story.content?.excerpt) ??
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
  return toAbsoluteUrl(`/blog/read/${story.slug}/opengraph-image`);
};

export const getArticleTwitterImageUrl = (story: BlogStory): string => {
  return toAbsoluteUrl(`/blog/read/${story.slug}/twitter-image`);
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

  return {
    "@context": "https://schema.org",
    "@type": "Article",
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
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
    keywords,
  };
};

export const serializeJsonLd = (value: Record<string, unknown>): string => {
  return JSON.stringify(value).replace(/</g, "\\u003c");
};
