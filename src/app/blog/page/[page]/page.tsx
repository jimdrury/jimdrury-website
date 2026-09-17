import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { FC } from "react";
import { Render } from "@/app/[...slug]/_components/render";
import {
  getBlogIndexArchive,
  getBlogPaginationStaticParams,
  parsePageParam,
} from "@/lib/blog";
import { buildBlogIndexMetadata } from "@/lib/seo";

const resolveBlogPaginationPage = async (page: string) => {
  const pageNumber = parsePageParam(page);

  if (pageNumber <= 1) {
    return { pageNumber, isValid: false as const };
  }

  const { isEnabled } = await draftMode();
  const archive = await getBlogIndexArchive({
    page: pageNumber,
    version: isEnabled ? "draft" : "published",
  });

  if (pageNumber > archive.pagination.totalPages) {
    return { pageNumber, isValid: false as const };
  }

  return { pageNumber, isValid: true as const };
};

export const generateStaticParams = async () => {
  return getBlogPaginationStaticParams();
};

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/page/[page]">): Promise<Metadata> => {
  const { page } = await params;
  const resolved = await resolveBlogPaginationPage(page);

  if (!resolved.isValid) {
    return {};
  }

  return buildBlogIndexMetadata(resolved.pageNumber);
};

const Page: FC<PageProps<"/blog/page/[page]">> = async ({ params }) => {
  const { page } = await params;
  const resolved = await resolveBlogPaginationPage(page);

  if (!resolved.isValid) {
    redirect("/blog");
  }

  return (
    <Render storySlug="blog" pathname={`/blog/page/${resolved.pageNumber}`} />
  );
};

export default Page;
