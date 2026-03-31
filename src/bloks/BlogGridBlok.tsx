import "server-only";
import { draftMode } from "next/headers";
import type { FC } from "react";

import { BlogGrid } from "@/components/blog-grid";
import { getBlogIndexArchive, parsePageParam } from "@/lib/blog";
import {
  getCurrentPathname,
  getCurrentSearchParam,
} from "@/lib/search-params-context";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type BlogGridBlokData = SbBlokData & {
  per_page?: number;
};

type BlogGridBlokProps = {
  blok: BlogGridBlokData;
};

export const BlogGridBlok: FC<BlogGridBlokProps> = async ({ blok }) => {
  const pageParam = getCurrentSearchParam("page");
  const page = parsePageParam(pageParam);
  const pathname = getCurrentPathname();
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";

  const archive = await getBlogIndexArchive({ page, version });
  return (
    <div {...storyblokEditable(blok)}>
      <BlogGrid
        stories={archive.stories}
        pagination={archive.pagination}
        pathname={pathname}
      />
    </div>
  );
};
