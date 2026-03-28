import type { FC } from "react";
import { Suspense } from "react";

import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

const Page: FC<PageProps<"/[...slug]">> = ({ params, searchParams }) => {
  return (
    // Keep route composition in `page.tsx` and async runtime work in `_components/render.tsx`.
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default Page;
