import "server-only";
import type { FC } from "react";
import { TableOfContents } from "@/components/table-of-contents";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";
import type { TocHeadingLevel } from "@/storyblok/table-of-contents";

type TableOfContentsBlokData = SbBlokData & {
  max_heading_level?: TocHeadingLevel;
};

type TableOfContentsBlokProps = {
  blok: TableOfContentsBlokData;
};

export const TableOfContentsBlok: FC<TableOfContentsBlokProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)}>
      <TableOfContents maxHeadingLevel={blok.max_heading_level} />
    </div>
  );
};
