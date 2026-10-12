import "server-only";

import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { FC } from "react";

import { decideArticleVisitorAccess } from "@/lib/article-request-gate";
import { getDefaultStoryCategory } from "@/lib/blog";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { StoryContent } from "@/storyblok/renderer";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

type RenderProps = Pick<PageProps<"/blog/[category]/[slug]">, "params">;

export const Render: FC<RenderProps> = async ({ params }) => {
  const { category, slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug, version });

  const decision = decideArticleVisitorAccess({
    story,
    category,
    slug,
    draft: isEnabled,
    canonicalCategory: story ? getDefaultStoryCategory(story) : null,
  });

  switch (decision.type) {
    case "not-found":
      return notFound();
    case "redirect":
      return redirect(decision.href);
    case "render": {
      if (!story) {
        return notFound();
      }

      const pathname = `/blog/${category}/${slug}`;
      const storyContent = (
        <StoryContent mode={version} pathname={pathname} story={story} />
      );

      return (
        <main>
          {isEnabled ? (
            <StoryPreview pathname={pathname} storyId={story.id} story={story}>
              {storyContent}
            </StoryPreview>
          ) : (
            storyContent
          )}
        </main>
      );
    }
    default: {
      const unreachable: never = decision;
      return unreachable;
    }
  }
};
