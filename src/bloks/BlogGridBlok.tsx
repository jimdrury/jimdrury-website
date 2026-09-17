import "server-only";
import { draftMode } from "next/headers";
import type { FC } from "react";
import type { BlogCardDensity } from "@/components/blog-card";
import { BlogGrid } from "@/components/blog-grid";
import { getBlogIndexArchive, getPageFromPathname } from "@/lib/blog";
import { getBlogIndexPath } from "@/lib/seo";
import {
  type SbBlokData,
  type StoryRenderProps,
  storyblokEditable,
} from "@/storyblok/lib";

type BlogGridBlokData = SbBlokData & {
  per_page?: number;
  density?: string;
  limit?: number;
};

type BlogGridBlokProps = StoryRenderProps & {
  blok: BlogGridBlokData;
};

const isDensity = (value: unknown): value is BlogCardDensity =>
  value === "default" || value === "compact";

const parseLimit = (value: unknown): number | undefined => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const BlogGridBlok: FC<BlogGridBlokProps> = async ({
  blok,
  pathname,
}) => {
  const page = getPageFromPathname(pathname);
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";

  const density: BlogCardDensity = isDensity(blok.density)
    ? blok.density
    : "default";
  const isCompact = density === "compact";
  const limit = parseLimit(blok.limit);

  const archive = await getBlogIndexArchive({ page, version });
  const stories =
    limit != null ? archive.stories.slice(0, limit) : archive.stories;

  return (
    <div {...storyblokEditable(blok)}>
      <BlogGrid
        stories={stories}
        pagination={archive.pagination}
        pathname={pathname}
        density={density}
        hidePagination={isCompact}
        viewAllHref={isCompact ? getBlogIndexPath(1) : undefined}
      />
    </div>
  );
};
