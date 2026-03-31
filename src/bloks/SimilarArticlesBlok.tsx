import "server-only";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { SimilarArticles } from "@/components/similar-articles";
import { getCurrentStory } from "@/lib/current-story-context";
import { getSimilarArticleItems } from "@/lib/similar-articles";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type SimilarArticlesBlokData = SbBlokData & {
  count?: number;
};

type SimilarArticlesBlokProps = {
  blok: SimilarArticlesBlokData;
};

export const SimilarArticlesBlok: FC<SimilarArticlesBlokProps> = async ({
  blok,
}) => {
  const currentStory = getCurrentStory();
  if (!currentStory) {
    return null;
  }

  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const items = await getSimilarArticleItems({
    currentStory,
    version,
    count: blok.count ?? 3,
  });
  if (items.length === 0) {
    return null;
  }

  return (
    <div {...storyblokEditable(blok)}>
      <SimilarArticles items={items} />
    </div>
  );
};
