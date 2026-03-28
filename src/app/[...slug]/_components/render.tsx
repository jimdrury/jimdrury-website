import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import { getStoryblokApi, getStoryblokCv } from "@/storyblok";
import { StoryContent } from "@/storyblok/renderer";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

type RenderProps = Pick<PageProps<"/[...slug]">, "params" | "searchParams">;

type StoryblokStoryResponse = {
  data?: {
    story?: Parameters<typeof StoryContent>[0]["story"];
  };
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
  const story = await fetchData({ slug: storySlug, version });

  if (!story) {
    notFound();
  }

  if (!isEnabled) {
    return <StoryContent story={story} />;
  }

  return (
    <StoryPreview storyId={story.id ?? 0} story={story}>
      <StoryContent story={story} />
    </StoryPreview>
  );
};

const fetchData = async ({
  slug,
  version,
}: {
  slug: string;
  version: "draft" | "published";
}) => {
  "use cache";
  cacheLife("default");
  cacheTag(`story-page`);
  cacheTag(`story-page-${slug}-${version}`);
  const storyblokApi = getStoryblokApi();

  try {
    const response = (await storyblokApi.get(`cdn/stories/${slug}`, {
      version,
      cv: getStoryblokCv(),
    })) as StoryblokStoryResponse;

    return response.data?.story ?? null;
  } catch {
    return null;
  }
};
