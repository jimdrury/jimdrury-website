import "server-only";

import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import { getDefaultStoryCategory } from "@/lib/blog";
import {
  buildArticleBreadcrumbJsonLd,
  buildArticleJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { StoryContent } from "@/storyblok/renderer";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

type RenderProps = Pick<PageProps<"/blog/[category]/[slug]">, "params">;

export const Render: FC<RenderProps> = async ({ params }) => {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug, version });

  if (!story) {
    notFound();
  }

  if (!isEnabled && !getDefaultStoryCategory(story)) {
    notFound();
  }

  const articleJsonLd = serializeJsonLd(buildArticleJsonLd(story));
  const breadcrumbJsonLd = serializeJsonLd(buildArticleBreadcrumbJsonLd(story));

  return (
    <main>
      <script type="application/ld+json">{articleJsonLd}</script>
      <script type="application/ld+json">{breadcrumbJsonLd}</script>
      {isEnabled ? (
        <StoryPreview storyId={story.id} story={story}>
          <StoryContent story={story} />
        </StoryPreview>
      ) : (
        <StoryContent story={story} />
      )}
    </main>
  );
};
