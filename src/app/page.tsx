import type { Metadata } from "next";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { Render } from "@/app/[...slug]/_components/render/render";
import { fetchStoryBySlug } from "@/app/[...slug]/_helpers/story";
import {
  buildStaticPageMetadata,
  MISSING_STORY_METADATA,
  SITE_NAME,
} from "@/lib/seo";

export const generateMetadata = async (): Promise<Metadata> => {
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await fetchStoryBySlug({ slug: "home", version });

  if (!story) {
    return MISSING_STORY_METADATA;
  }

  const metadata = buildStaticPageMetadata({ story, slug: "home" });

  return {
    ...metadata,
    title: { absolute: SITE_NAME },
    alternates: {
      ...metadata.alternates,
      canonical: "/",
    },
    openGraph: {
      ...metadata.openGraph,
      title: SITE_NAME,
      url: "/",
    },
    twitter: {
      ...metadata.twitter,
      title: SITE_NAME,
    },
  };
};

const Page: FC<PageProps<"/">> = async () => {
  return <Render storySlug="home" pathname="/" />;
};

export default Page;
