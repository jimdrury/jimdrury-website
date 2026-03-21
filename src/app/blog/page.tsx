import type { Metadata } from "next";
import type { FC } from "react";
import { Suspense } from "react";

import { parsePageParam } from "@/lib/blog";
import { buildBlogIndexMetadata } from "@/lib/seo";
import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

export const generateMetadata = async ({
  searchParams,
}: PageProps<"/blog">): Promise<Metadata> => {
  const resolvedSearchParams = await searchParams;
  const pageValue = resolvedSearchParams.page;
  const pageParam = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = parsePageParam(pageParam);

  return buildBlogIndexMetadata(page);
};

const Page: FC<PageProps<"/blog">> = ({ searchParams }) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Render searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
