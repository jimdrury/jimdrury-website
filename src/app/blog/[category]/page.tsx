import type { Metadata } from "next";
import type { FC } from "react";
import { Suspense } from "react";

import { parsePageParam } from "@/lib/blog";
import { buildBlogCategoryMetadata } from "@/lib/seo";
import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps<"/blog/[category]">): Promise<Metadata> => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const pageValue = resolvedSearchParams.page;
  const pageParam = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = parsePageParam(pageParam);

  return buildBlogCategoryMetadata({
    category,
    page,
  });
};

const Page: FC<PageProps<"/blog/[category]">> = ({ params, searchParams }) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
