import "server-only";

import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import {
  buildArticleBreadcrumbJsonLd,
  buildArticleJsonLd,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildStaticPageJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import type { StoryData } from "@/storyblok/lib";
import { StoryContent } from "@/storyblok/renderer";
import { fetchStoryBySlug } from "./story";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

type RenderProps = Pick<PageProps<"/[...slug]">, "params" | "searchParams">;

const isArticleStory = (story: StoryData): story is BlogStory => {
  if (
    typeof story.content !== "object" ||
    story.content === null ||
    !("component" in story.content) ||
    story.content.component !== "article"
  ) {
    return false;
  }

  return (
    typeof story.id === "number" &&
    typeof story.slug === "string" &&
    typeof story.full_slug === "string" &&
    typeof story.name === "string"
  );
};

export const Render: FC<RenderProps> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const storySlug = slug.join("/");
  const { isEnabled } = await draftMode();
  const resolvedSearchParams = await searchParams;
  const storyblokParam = resolvedSearchParams._storyblok;
  const isStoryblokPreviewRequest = Array.isArray(storyblokParam)
    ? storyblokParam.length > 0
    : Boolean(storyblokParam);
  const shouldUseDraftVersion = isEnabled || isStoryblokPreviewRequest;
  const version = shouldUseDraftVersion ? "draft" : "published";
  const story = await fetchStoryBySlug({ slug: storySlug, version });

  if (!story) {
    notFound();
  }

  const articleStory = isArticleStory(story) ? story : null;
  const staticPageJsonLd = !articleStory
    ? serializeJsonLd(buildStaticPageJsonLd({ story, slug: storySlug }))
    : null;
  const articleJsonLd = articleStory
    ? serializeJsonLd(buildArticleJsonLd(articleStory))
    : null;
  const articleBreadcrumbJsonLd = articleStory
    ? serializeJsonLd(buildArticleBreadcrumbJsonLd(articleStory))
    : null;
  const organizationJsonLd =
    storySlug === "home" ? serializeJsonLd(buildOrganizationJsonLd()) : null;
  const personJsonLd =
    storySlug === "about" ? serializeJsonLd(buildPersonJsonLd()) : null;

  const storyContent = (
    <>
      {staticPageJsonLd ? (
        <script type="application/ld+json">{staticPageJsonLd}</script>
      ) : null}
      {articleJsonLd ? (
        <script type="application/ld+json">{articleJsonLd}</script>
      ) : null}
      {articleBreadcrumbJsonLd ? (
        <script type="application/ld+json">{articleBreadcrumbJsonLd}</script>
      ) : null}
      {organizationJsonLd ? (
        <script type="application/ld+json">{organizationJsonLd}</script>
      ) : null}
      {personJsonLd ? (
        <script type="application/ld+json">{personJsonLd}</script>
      ) : null}
      <StoryContent story={story} />
    </>
  );

  if (!isEnabled) {
    return storyContent;
  }

  return (
    <StoryPreview storyId={story.id ?? 0} story={story}>
      {storyContent}
    </StoryPreview>
  );
};
