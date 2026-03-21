import type { FC } from "react";
import { Suspense } from "react";
import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

const Page: FC<PageProps<"/blog/date/[year]/[month]/[day]">> = ({
  params,
  searchParams,
}) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
