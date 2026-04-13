import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { connection } from "next/server";
import type { FC } from "react";
import { Suspense } from "react";
import { BackToTop } from "@/components/back-to-top";
import { getDefaultStoryCategory } from "@/lib/blog";
import { buildArticleMetadata } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/[category]/[slug]">): Promise<Metadata> => {
  await connection();
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug, version });

  if (!story || (!isEnabled && !getDefaultStoryCategory(story))) {
    return {
      title: "Article not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildArticleMetadata(story);
};

const Page: FC<PageProps<"/blog/[category]/[slug]">> = ({ params }) => {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <Render params={params} />
      </Suspense>
      <BackToTop />
    </>
  );
};

export default Page;
