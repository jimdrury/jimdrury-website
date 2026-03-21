import "server-only";
import GithubSlugger from "github-slugger";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

type TocHeadingLevel = "h2" | "h3";

type StoryblokBlok = {
  _uid?: unknown;
  component?: unknown;
  as?: unknown;
  content?: unknown;
  [key: string]: unknown;
};

export type TocHeading = {
  uid?: string;
  id: string;
  level: TocHeadingLevel;
  text: string;
};

const isTocHeadingLevel = (value: unknown): value is TocHeadingLevel => {
  return value === "h2" || value === "h3";
};

const isStoryblokBlok = (value: unknown): value is StoryblokBlok => {
  return Boolean(value) && typeof value === "object";
};

const normalizeHeadingText = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const slugifyHeading = (value: string): string => {
  const slugger = new GithubSlugger();
  return slugger.slug(value);
};

export const getTypographyHeadingId = (headingText: string): string => {
  return slugifyHeading(headingText);
};

const extractHeadingsFromBloks = (bloks: unknown): TocHeading[] => {
  const headings: TocHeading[] = [];
  const slugger = new GithubSlugger();

  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!isStoryblokBlok(value)) {
      return;
    }

    if (value.component === "typography" && isTocHeadingLevel(value.as)) {
      const text = normalizeHeadingText(value.content);
      const uid = typeof value._uid === "string" ? value._uid : undefined;

      if (text) {
        headings.push({
          uid,
          id: slugger.slug(text),
          level: value.as,
          text,
        });
      }
    }

    Object.values(value).forEach(visit);
  };

  visit(bloks);
  return headings;
};

export const getTypographyHeadingIdByUid = ({
  uid,
  story,
  content,
}: {
  uid?: string;
  story: BlogStory | null;
  content: string;
}): string => {
  if (uid) {
    const heading = getTableOfContentsHeadings(story).find(
      (item) => item.uid === uid,
    );
    if (heading) {
      return heading.id;
    }
  }

  return getTypographyHeadingId(content);
};

export const getTableOfContentsHeadingsFromBloks = (
  bloks: unknown,
): TocHeading[] => {
  if (!Array.isArray(bloks)) {
    return [];
  }

  return extractHeadingsFromBloks(bloks);
};

export const getTableOfContentsHeadings = (
  story: BlogStory | null,
): TocHeading[] => {
  return getTableOfContentsHeadingsFromBloks(story?.content?.body);
};
