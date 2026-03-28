import type { Metadata } from "next";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { Suspense } from "react";
import { Render } from "@/app/[...slug]/_components/render";
import { Skeleton } from "@/app/[...slug]/_components/skeleton";
import { fetchStoryBySlug } from "@/app/[...slug]/_components/story";
import { buildStaticPageMetadata } from "@/lib/seo";

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps<"/[...slug]">): Promise<Metadata> => {
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
    return {};
  }

  return buildStaticPageMetadata({ story, slug: storySlug });
};

const Page: FC<PageProps<"/[...slug]">> = ({ params, searchParams }) => {
  return (
    // Keep route composition in `page.tsx` and async runtime work in `_components/render.tsx`.
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
