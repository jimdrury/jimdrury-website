import type { FC } from "react";
import { Suspense } from "react";

import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

const Page: FC<PageProps<"/">> = () => {
  return (
    // Keep route composition in `page.tsx` and async runtime work in `_components/render.tsx`.
    <Suspense fallback={<Skeleton />}>
      <Render />
    </Suspense>
  );
};

export default Page;
