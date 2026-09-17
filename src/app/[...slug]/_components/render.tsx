import "server-only";

import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import { setCurrentSearchParams } from "@/lib/search-params-context";
import { StoryContent } from "@/storyblok/renderer";
import { ArticleBreadcrumbJsonLd } from "./json-ld/article-breadcrumb-json-ld";
import { ArticleJsonLd } from "./json-ld/article-json-ld";
import { OrganizationJsonLd } from "./json-ld/organization-json-ld";
import { PersonJsonLd } from "./json-ld/person-json-ld";
import { StaticPageJsonLd } from "./json-ld/static-page-json-ld";
import { fetchStoryBySlug } from "./story";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

type RenderProps = {
  storySlug: string;
  pathname: string;
};

export const Render: FC<RenderProps> = async ({ storySlug, pathname }) => {
  const { isEnabled } = await draftMode();
  setCurrentSearchParams({}, pathname);
  const version = isEnabled ? "draft" : "published";
  const story = await fetchStoryBySlug({ slug: storySlug, version });

  if (!story) {
    notFound();
  }

  const storyContent = (
    <>
      <StaticPageJsonLd story={story} storySlug={storySlug} />
      <ArticleJsonLd story={story} />
      <ArticleBreadcrumbJsonLd story={story} />
      <OrganizationJsonLd storySlug={storySlug} />
      <PersonJsonLd storySlug={storySlug} />
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
