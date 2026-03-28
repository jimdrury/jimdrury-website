import "server-only";

import type { FC } from "react";

import { Skeleton as BlogSkeleton } from "../../../_components/skeleton";

export const Skeleton: FC = () => {
  return <BlogSkeleton showCategorySidebar={false} />;
};
