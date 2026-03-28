import "server-only";

import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import { getDefaultStoryCategory } from "@/lib/blog";
import { buildArticleJsonLd, serializeJsonLd } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { StoryContent } from "@/storyblok/renderer";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

type RenderProps = Pick<PageProps<"/blog/read/[slug]">, "params">;

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

  const jsonLd = serializeJsonLd(buildArticleJsonLd(story));

  return (
    <main>
      <script type="application/ld+json">{jsonLd}</script>
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
