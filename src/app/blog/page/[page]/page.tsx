import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { FC } from "react";
import { Render } from "@/app/[...slug]/_components/render/render";
import { getBlogPaginationStaticParams } from "@/lib/blog";
import { buildBlogIndexMetadata } from "@/lib/seo";
import { resolveBlogPaginationPage } from "./_helpers/resolve-blog-pagination-page";

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
